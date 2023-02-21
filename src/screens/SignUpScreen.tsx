import {
  Flex,
  InputItem,
  WhiteSpace,
  WingBlank,
  Button,
} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

interface signUp {
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen = ({route, navigation}) => {
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [signUpInfo, setSignUpInfo] = React.useState<signUp>({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleVerifySignUp = async () => {
    // if (email.trim() !== '' && password.trim() !== '') {
    //   const req = await fetch('https://api.b7web.com.br/loginsimples/', {
    //     /// estou enviando para ver se consigo logar;
    //     method: 'POST',
    //     body: JSON.stringify({
    //       email: email,
    //       password: password,
    //     }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   const json = await req.json();
    //   if (json.status === 'ok') {
    //   } else {
    //   }
    // }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <View
      style={{backgroundColor: '#fba0b5', widht: '100%', height: 150}}></View> */}
      <View>
        <Text style={styles.header}>회원가입</Text>
        <WingBlank size="lg">
          <Flex direction="column">
            <InputItem
              //clear
              value={signUpInfo.email}
              onChange={e => setSignUpInfo({...signUpInfo, email: e})}
              placeholder="Email">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
            <InputItem
              //clear
              value={signUpInfo.name}
              onChange={e => setSignUpInfo({...signUpInfo, name: e})}
              placeholder="Name">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
            <InputItem
              //clear
              type="phone"
              value={signUpInfo.phone}
              onChange={e => setSignUpInfo({...signUpInfo, phone: e})}
              placeholder="Phone Number">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
            <WhiteSpace size="xs" />
            <InputItem
              //clear
              type="password"
              value={signUpInfo.password}
              onChange={e => setSignUpInfo({...signUpInfo, password: e})}
              placeholder="Password">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>

            <InputItem
              type="password"
              //clear
              value={signUpInfo.confirmPassword}
              onChange={e => setSignUpInfo({...signUpInfo, confirmPassword: e})}
              placeholder="Confirm Password">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
          </Flex>

          <WhiteSpace size="lg" />

          <Button type="warning" onPress={handleVerifySignUp}>
            확인
          </Button>

          <WhiteSpace size="xl" />
          <Text
            onPress={() =>
              navigation.navigate('login', {type: 'myInfo', id: '아이디'})
            }
            style={{
              fontSize: 15,
              color: 'gray',
              textAlign: 'center',
            }}>
            Already a user?
          </Text>
        </WingBlank>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    marginTop: 70,
    color: '#111',
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default SignUpScreen;
