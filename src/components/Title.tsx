import React from 'react';
import {Text, SafeAreaView} from 'react-native';

interface Props {
  title: string;
}

const Title: React.FC<Props> = ({title}) => {
  return (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 36,
          marginStart: 25,
          marginTop: 20,
          marginBottom: 20,
          fontWeight: 600,
        }}>
        {title}
      </Text>
    </SafeAreaView>
  );
};

export default Title;
