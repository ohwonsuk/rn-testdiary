import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Typography from './components/Typography';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { stateUserInfo } from './states/stateUserInfo';
import useGetDiaryList from './hooks/useGetDiaryList';
import { PasswordInputBox } from './components/PasswordInputBox';

const SplashView = (props) => {

  const [loading, setLoading] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const [userInfo, setUserInfo] = useRecoilState(stateUserInfo);
  const runGetDiaryList = useGetDiaryList();

  const signinUserIndentify = useCallback(async (idToken) => {
    setLoading(true);
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const result = await auth().signInWithCredential(googleCredential);
    // console.log('result', result);
    setShowLoginButton(false);
    const userDBRefKey = `/users/${result.user.uid}`;
    const userResult = await database().ref(userDBRefKey).once('value').then((snapshot) => {
      return snapshot.val();
    });

    console.log(userResult);
    const now = new Date().toISOString();

    if (userResult === null) {
      await database().ref(userDBRefKey).set({
        name: result.additionalUserInfo.profile.name,
        profileImage: result.additionalUserInfo.profile.picture,
        uid: result.user.uid,
        password: '',
        createdAt: now,
        lastLoginAt: now
      })
    }

    const userInfo = await database().ref(userDBRefKey).once('value').then((snapshot) => snapshot.val());
    setUserInfo(userInfo);
    await runGetDiaryList(userInfo);

    if (userInfo.password !== '') {
      setShowPasswordInput(true);
      setLoading(false);

      return;
    }
    console.log('userInfo', userInfo);

    await database().ref(userDBRefKey).update({
      lastLoginAt: now
    })


    props.onFinishLoad();

  }, []);

  const onPressGoogleLogin = useCallback(async () => {
    try {
      // await GoogleSignin.signOut();
      console.log('user select');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('user select pop-up');
      const userInfo = await GoogleSignin.signIn();
      idToken = userInfo.data?.idToken;
      // console.log('User Info:', userInfo);
      if (idToken) {
        console.log('idToken', idToken);
        signinUserIndentify(userInfo.data.idToken);
      } else {
        console.error('idToken is null');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }, []);

  const userSilentLogin = useCallback(async () => {
    try {
      const { idToken } = await GoogleSignin.signInSilently();
      setLoading(true);
      signinUserIndentify(idToken);
      console.log('silentlogin check', result.idToken);
    } catch (ex) {
      setLoading(false);
      setShowLoginButton(true);
      console.log('first login', ex);
    }
  }, []);

  useEffect(() => {
    userSilentLogin();
    console.log('start');
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {showLoginButton && <GoogleSigninButton onPress={onPressGoogleLogin} />}
      {showPasswordInput && (
        <PasswordInputBox
          errorMessage={passwordError}
          value={inputPassword}
          onChangeText={async (text) => {
            setInputPassword(text);
            if (text.length === 4) {
              if (userInfo.password === text) {
                const now = new Date().toISOString();
                const userDB = `/users/${userInfo.uid}`;
                await database().ref(userDB).update({
                  lastLoginAt: now
                });
                props.onFinishLoad();
                setInputPassword('');
                setPasswordError('비밀번호가 다릅니다.');
              }
            }
          }}
        />
      )}
      {loading && (
        <ActivityIndicator />
      )}
    </View>
  )
}

export default SplashView;
