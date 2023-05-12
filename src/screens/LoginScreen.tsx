import React, {useCallback, useState} from 'react';
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

import {HelperText, Snackbar} from 'react-native-paper';

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

  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');

  const _errorMessage = useSelector(selectErrorMsg);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setErrorMessage(_errorMessage);
    dispatch(initErrorMessage());
    if (_errorMessage !== '') {
      setVisibleSnackbar(true);
      setSnackbarContent('다시 시도해주세요');
    }
  }, [_errorMessage]);

  // React.useEffect(() => {
  //   if (errorMessage !== '') {
  //     Alert.alert(errorMessage);
  //     setErrorMessage('');
  //   }
  // }, [errorMessage]);

  const handleVerifyLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      setLoading(true);
      dispatch(loginAccount({email, password}));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>로그인</Text>
        <WingBlank size="lg">
          <Flex direction="column">
            <InputItem
              clear
              value={email}
              onChange={e => setEmail(e)}
              placeholder="Email"
            />
            <InputItem
              type="password"
              clear
              value={password}
              onChangeText={e => setPassword(e)}
              placeholder="Password"
            />
          </Flex>

          <WhiteSpace size="lg" />

          <Button
            type="warning"
            disabled={isEmail && isPassword}
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
                color: 'lightpink',
                textAlign: 'right',
              }}>
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'lightpink',
                textAlign: 'right',
              }}>
              Forgot Password?
            </Text>
          </Flex>
        </WingBlank>
      </View>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => {
          setVisibleSnackbar(false);
          setSnackbarContent('');
        }}
        duration={2500}>
        {snackbarContent}
      </Snackbar>
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
