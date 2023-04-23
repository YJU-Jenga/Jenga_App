import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
const defaultValue = '#1E90FF';

const DefaultButton = ({onPress, title, type}) => {
  const [color, setColor] = React.useState('#1E90FF');

  React.useEffect(() => {
    switch (type) {
      case 'default':
        setColor('#1E90FF'); // dodgerblue
        break;
      case 'cancel':
        setColor('red');
        break;
    }
  }, []);
  return (
    <TouchableOpacity style={{padding: 15}} onPress={onPress}>
      <Text
        style={{
          textAlign: 'center',
          color: color,
          fontSize: 18,
          fontFamily: 'TheJamsilOTF_Light',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

DefaultButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

DefaultButton.defaultProps = {
  type: 'default',
};

export default DefaultButton;
