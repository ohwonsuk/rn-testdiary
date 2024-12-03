import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import RootStackNavigation from './navigations/RootStackNavigation';
import SplashView from './SplashView';

const RootApp = () => {
  const [initialized, setInitialized] = useState(false);

  if (!initialized) {
    return (
      <SplashView
        onFinishLoad={() => setInitialized(true)}
      />
    )
  }

  return (
    <NavigationContainer>
      <RootStackNavigation />
    </NavigationContainer>
  )
}

export default RootApp;
