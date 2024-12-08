import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootApp from './src/RootApp';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


export default function App() {
  return (
    <SafeAreaProvider>
      <RootApp />
    </SafeAreaProvider>
  );
}