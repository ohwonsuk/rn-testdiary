import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootApp from './src/RootApp';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { RecoilRoot } from 'recoil';

GoogleSignin.configure({
  webClientId: '861545078404-cjoqadktsgenk7u7gp7k1hggsqh68ohs.apps.googleusercontent.com',
  offlineAccess: true
});

export default function App() {
  return (
    <SafeAreaProvider>
      <RecoilRoot>
        <RootApp />
      </RecoilRoot>
    </SafeAreaProvider>
  );
}