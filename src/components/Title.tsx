import {Flex} from '@ant-design/react-native';
import React from 'react';
import {Text, SafeAreaView, Image} from 'react-native';

interface Props {
  title: string;
}

const Title: React.FC<Props> = ({title}) => {
  return (
    <SafeAreaView>
      <Flex
        justify="between"
        style={{marginHorizontal: 25, marginTop: 20, marginBottom: 20}}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: 600,
          }}>
          {title}
        </Text>
        <Image
          source={require('./../scpark.jpeg')}
          style={{width: 30, height: 30, borderRadius: 40}}></Image>
      </Flex>
    </SafeAreaView>
  );
};

export default Title;
