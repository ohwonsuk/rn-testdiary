import React, { useCallback, useMemo } from 'react';
import Header from '../components/Header/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import RemoteImage from '../components/RemoteImage';
import Typography from '../components/Typography';

const DiaryDetailScreen = () => {

  const natvigation = useNavigation();
  const route = useRoute();

  const { width } = useWindowDimensions();
  const photoSize = useMemo(() => {
    return {
      photoWidth: width - 12 * 2,
      photoHeight: (width - 12 * 2) * 0.5
    }
  }, [width]);
  const date = useMemo(() => {
    return new Date(route.params.item.date)
  }, [route.params.item]);

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
      <ScrollView style={{ flex: 1 }}>
        {typeof route.params.item.photoUrl !== 'undefined' && (
          <RemoteImage
            url={route.params.item.photoUrl}
            width={photoSize.photoWidth}
            height={photoSize.photoHeight}
            style={{ borderRadius: 8, marginLeft: 12, marginTop: 10 }}
          />
        )}
        <Spacer space={20} />
        <View style={{
          flexDirection: 'row',
          paddingVertical: 24,
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography fontSize={20}>날짜</Typography>
          <Typography fontSize={16}>
            {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
          </Typography>
        </View>

        <Spacer space={40} />

        <View style={{ paddingHorizontal: 24 }}>
          <Typography fontSize={32}>{route.params.item.title}</Typography>
          <Typography fontSize={24}>{route.params.item.content}</Typography>
        </View>

      </ScrollView>
    </View>
  )
}

export default DiaryDetailScreen
