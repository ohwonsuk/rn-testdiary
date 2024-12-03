import React from 'react';
import { View } from 'react-native';

export default HeaderGroup = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {props.children}
    </View>
  )
}