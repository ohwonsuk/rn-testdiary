import React, { useCallback } from 'react';
import { View } from 'react-native';
import Header from '../components/Header/Header';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import { useRecoilState } from 'recoil';
import { stateUserInfo } from '../states/stateUserInfo';
import Button from '../components/Button';
import RemoteImage from '../components/RemoteImage';
import Typography from '../components/Typography';
import useImagePickAndUpload from '../hooks/useImagePickAndUpload';
import database from '@react-native-firebase/database';

const SettingScreen = () => {
  const [userInfo, setUserInfo] = useRecoilState(stateUserInfo);
  const runImagePickAndUpload = useImagePickAndUpload(false);

  const navigation = useNavigation();
  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onPressProfile = useCallback(async () => {
    const result = await runImagePickAndUpload();
    console.log(result);

    if (result.length >= 1) {
      const userDB = `/users/${userInfo.uid}`
      // 프로필 이미지로 선택한 것이 업로드가 됨
      setUserInfo((prevState) => {
        return {
          ...prevState,
          profileImage: result[0]
        }
      });
      await database().ref(userDB).update({
        profileImage: result[0]
      })
    }
  }, [userInfo, runImagePickAndUpload]);

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Icon iconName="arrow-back" onPress={onPressBack} />
          <Spacer space={12} horizontal />
          <Header.Title title="SETTING" />
        </Header.Group>
      </Header>
      <View style={{ flex: 1, paddingTop: 32 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button onPress={onPressProfile}>
            <RemoteImage
              url={userInfo.profileImage}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
          </Button>
          <Spacer space={20} />
          <Typography fontSize={20}>{userInfo.name}</Typography>
        </View>
      </View>
    </View>
  )
}

export default SettingScreen;
