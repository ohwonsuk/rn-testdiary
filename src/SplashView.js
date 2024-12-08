import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Typography from './components/Typography';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const SplashView = (props) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '861545078404-cjoqadktsgenk7u7gp7k1hggsqh68ohs.apps.googleusercontent.com',
      offlineAccess: true
    });
  }, []);
  const [showLoginButton, setShowLoginButton] = useState(false);

  const signinUserIndentify = useCallback(async (idToken) => {
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const result = await auth().signInWithCredential(googleCredential);
    console.log('result', result);
  }, []);

  const onPressGoogleLogin = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      console.log('user select');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('user select pop-up');
      const userInfo = await GoogleSignin.signIn();
      idToken = userInfo.data?.idToken;
      console.log('User Info:', userInfo);
      if (idToken) {
        console.log('idToken', idToken);
        signinUserIndentify(userInfo.data.idToken);
      } else {
        console.error('idToken is null');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      console.log('원인찾기');
    }
    // await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // const { idToken } = await GoogleSignin.signIn();
    // console.log('idToken', idToken);
    // signinUserIndentify(idToken);
  }, []);

  const userSilentLogin = useCallback(async () => {
    try {
      const result = await GoogleSignin.signInSilently();
      if (result.idToken) {
        signinUserIndentify(result.idToken);
        console.log('silentlogin check', result.idToken);
      } else {
        throw new Error('No idToken available');
      }
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
