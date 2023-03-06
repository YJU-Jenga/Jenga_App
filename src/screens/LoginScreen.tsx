import React, {useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  WhiteSpace,
  WingBlank,
  Flex,
  InputItem,
  Button,
  Toast,
} from '@ant-design/react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {
  initErrorMessage,
  loginAccount,
  selectErrorMsg,
  selectMsg,
} from '../utils/redux/authSlice';
import {validateEmail, removeWhitespace} from '../utils/regex';

const LoginScreen = ({route, navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  //오류메시지 상태저장
  const [nameMessage, setNameMessage] = React.useState<string>('');
  const [emailMessage, setEmailMessage] = React.useState<string>('');
  const [passwordMessage, setPasswordMessage] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  // 유효성 검사
  const [isName, setIsName] = React.useState<boolean>(false);
  const [isEmail, setIsEmail] = React.useState<boolean>(false);
  const [isPassword, setIsPassword] = React.useState<boolean>(false);

  const _msg = useSelector(selectMsg);
  const _errorMessage = useSelector(selectErrorMsg);
  const dispatch = useDispatch();
  React.useEffect(() => {}, []);
  React.useEffect(() => {
    setErrorMessage(_errorMessage);
    dispatch(initErrorMessage());
  }, [_errorMessage]);

  React.useEffect(() => {
    if (errorMessage !== '') {
      Alert.alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  // React.useEffect(() => {}, [errorMessage]);

  // 이메일
  const onChangeEmail = useCallback((e: string) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    // const emailCurrent = e;
    setEmail(e);

    if (!emailRegex.test(e)) {
      setEmailMessage('이메일 형식이 틀렸어요');
      setIsEmail(false);
    } else {
      setEmailMessage('올바른 이메일 형식이에요');
      setIsEmail(true);
    }
  }, []);

  // 비밀번호
  const onChangePassword = useCallback((e: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    // const passwordCurrent = e;
    setPassword(e);

    if (!passwordRegex.test(e)) {
      setPasswordMessage(
        '숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요',
      );
      setIsPassword(false);
    } else {
      setPasswordMessage('안전한 비밀번호에요');
      setIsPassword(true);
    }
  }, []);

  const handleVerifyLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      setLoading(true);
      dispatch(loginAccount({email, password}));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <View
        style={{backgroundColor: '#fba0b5', widht: '100%', height: 150}}></View> */}
      <View>
        <Text style={styles.header}>로그인</Text>
        <WingBlank size="lg">
          <Flex direction="column">
            <InputItem
              clear
              value={email}
              onChange={e => onChangeEmail(e)}
              placeholder="Email"
            />
            <InputItem
              type="password"
              clear
              value={password}
              onChangeText={e => onChangePassword(e)}
              placeholder="Password"
            />
          </Flex>

          <WhiteSpace size="lg" />

          <Button
            type="warning"
            disabled={!(isEmail && isPassword)}
            onPress={handleVerifyLogin}>
            Sign In
          </Button>

          <WhiteSpace size="xl" />

          <Flex justify="around">
            <Text
              onPress={() =>
                navigation.navigate('signUp', {type: 'myInfo', id: '아이디'})
              }
              style={{
                fontSize: 15,
                color: 'pink',
                textAlign: 'right',
              }}>
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'pink',
                textAlign: 'right',
              }}>
              Forgot Password?
            </Text>
          </Flex>
        </WingBlank>
      </View>

      {/* {loading && (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>로딩중...</Text>
        </View>
      )}

      <Text style={styles.status}>{status}</Text>

      {showCupom && (
        <View style={styles.cupomArea}>
          <Text style={styles.cupomTitle}>로그인성공함 </Text>
          <Text style={styles.cupomCode}>123</Text>
        </View>
      )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 70,
    color: '#111',
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 50,
  },
  input: {
    height: 45,
    fontSize: 18,
    color: '#444',
    backgroundColor: '#eee',
    borderRadius: 5,
    //marginHorizontal: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  status: {
    margin: 50,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LoginScreen;
