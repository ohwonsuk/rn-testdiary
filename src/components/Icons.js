import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export default Icon = (props) => {
  return (
    <Ionicons
      name={props.name}
      size={props.size}
      color={props.color}
    />
  )
}