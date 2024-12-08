import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Typography from './components/Typography';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useSetRecoilState } from 'recoil';
import { stateUserInfo } from './states/stateUserInfo';

const SplashView = (props) => {

  const [showLoginButton, setShowLoginButton] = useState(false);
  const setUserInfo = useSetRecoilState(stateUserInfo);

  const signinUserIndentify = useCallback(async (idToken) => {
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
    } else {
      await database().ref(userDBRefKey).update({
        lastLoginAt: now
      })
    }

    const userInfo = await database().ref(userDBRefKey).once('value').then((snapshot) => snapshot.val());

    console.log('userInfo', userInfo);
    setUserInfo(userInfo);

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
      signinUserIndentify(idToken);
      console.log('silentlogin check', result.idToken);
    } catch (ex) {
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
    </View>
  )
}

export default SplashView;
