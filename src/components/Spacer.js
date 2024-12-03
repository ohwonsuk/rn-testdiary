import React from 'react';
import { View } from 'react-native';

export default Spacer = (props) => {
  return props.horizontal ? (
    <View style={{ marginLeft: props.space }} />
  ) : (
    <View style={{ marginTop: props.space }} />
  )
}