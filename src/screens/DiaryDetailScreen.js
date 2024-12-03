import React, { useCallback } from 'react';
import Header from '../components/Header/Header';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';

const DiaryDetailScreen = () => {

  const natvigation = useNavigation();
  const onPressBack = useCallback(() => {
    natvigation.goBack();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Icon iconName='close' onPress={onPressBack} />
          <Spacer space={12} horizontal />
          <Header.Title title='DIARY DETAIL'></Header.Title>
        </Header.Group>
      </Header>
    </View>
  )
}

export default DiaryDetailScreen
