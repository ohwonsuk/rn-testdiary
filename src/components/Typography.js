import React from 'react';
import { Text as RNText } from 'react-native';
import propTypes from 'prop-types';

export default Typography = (props) => {
  return (
    <RNText
      style={{
        color: props.color,
        fontSize: props.fontSize
      }}>
      {props.children}
    </RNText>
  )
}

Typography.propTypes = {
  color: propTypes.string,
  fontSize: propTypes.number,
  children: propTypes.oneOfType([propTypes.string, propTypes.element]).isRequired
}