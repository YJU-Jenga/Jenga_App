import {
  Flex,
  InputItem,
  WhiteSpace,
  WingBlank,
  Button,
  Toast,
} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, Text, View, StyleSheet, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  initErrorMessage,
  registerAccount,
  selectErrorMsg,
} from '../utils/redux/authSlice';
import {HelperText, Snackbar} from 'react-native-paper';

interface signUp {
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen = ({route, navigation}) => {
  const [signUpInfo, setSignUpInfo] = React.useState<signUp>({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  //오류메시지 상태저장
  const [nameMessage, setNameMessage] = React.useState<string>('');
  const [emailMessage, setEmailMessage] = React.useState<string>('');
  const [phoneMessage, setPhoneMessage] = React.useState<string>('');
  const [passwordMessage, setPasswordMessage] = React.useState<string>('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] =
    React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  // 유효성 검사
  const [isName, setIsName] = React.useState<boolean>(false);
  const [isEmail, setIsEmail] = React.useState<boolean>(false);
  const [isPhone, setIsPhone] = React.useState<boolean>(false);
  const [isPassword, setIsPassword] = React.useState<boolean>(false);
  const [isConfirmPassword, setIsConfirmPassword] =
    React.useState<boolean>(false);

  const dispatch = useDispatch();
  const _errorMessage = useSelector(selectErrorMsg);

  React.useEffect(() => {
    if (signUpInfo.password === signUpInfo.confirmPassword) {
      setConfirmPasswordMessage('비밀번호를 똑같이 입력했어요 : )');
      setIsConfirmPassword(true);
    } else {
      setConfirmPasswordMessage('비밀번호가 틀려요. 다시 확인해주세요 ㅜ ㅜ');
      setIsConfirmPassword(false);
    }
  }, [signUpInfo.confirmPassword, signUpInfo.password]);

  const onChangeEmail = useCallback(
    (e: string) => {
      const email = e;
      console.log(e);
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      // const emailCurrent = e;
      setSignUpInfo({...signUpInfo, email});

      if (!emailRegex.test(e)) {
        setEmailMessage('이메일을 입력하세요');
        setIsEmail(false);
      } else {
        setEmailMessage('');
        setIsEmail(true);
      }
    },
    [signUpInfo],
  );

  const onChangeName = useCallback(
    (e: string) => {
      const name = e;
      setSignUpInfo({...signUpInfo, name});
      if (e.length < 2 || e.length > 5) {
        setNameMessage('2글자 이상 5글자 미만으로 입력하세요');
        setIsName(false);
      } else {
        setNameMessage('');
        setIsName(true);
      }
    },
    [signUpInfo],
  );

  const onChangePhone = useCallback(
    (e: string) => {
      const phone = e;
      const phoneRegex = /^01(?:0|1|[6-9])\s(?:\d{3}|\d{4})\s\d{4}$/;
      // const emailCurrent = e;
      setSignUpInfo({...signUpInfo, phone});

      if (!phoneRegex.test(e)) {
        setPhoneMessage('휴대폰 번호 (010xxxxxxxx)');
        setIsPhone(false);
        console.log(phone.length);
      } else {
        setPhoneMessage('');
        setIsPhone(true);
      }
    },
    [signUpInfo],
  );

  const onChangePassword = useCallback(
    (e: string) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

      const password = e;
      setSignUpInfo({...signUpInfo, password});

      if (!passwordRegex.test(e)) {
        setPasswordMessage('숫자, 대문자, 특수문자를 포함하세요');
        setIsPassword(false);
      } else {
        setPasswordMessage('');
        setIsPassword(true);
      }
    },
    [signUpInfo],
  );

  const onChangePasswordConfirm = useCallback(
    (e: string) => {
      const confirmPassword = e;
      setSignUpInfo({...signUpInfo, confirmPassword});
    },
    [signUpInfo],
  );

  const handleVerifySignUp = () => {
    dispatch(registerAccount(signUpInfo));
  };

  React.useEffect(() => {
    setErrorMessage(_errorMessage);
    dispatch(initErrorMessage());
  }, [_errorMessage]);

  useEffect(() => {
    if (errorMessage !== '') {
      Alert.alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          setSnackbarContent('');
        }}
        duration={2500}>
        {snackbarContent}
      </Snackbar> */}
        <Text style={styles.header}>회원가입</Text>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <Flex direction="column">
            <InputItem
              //clear
              value={signUpInfo.email}
              onChange={e => onChangeEmail(e)}
              placeholder="Email">
              <Icon name="email-outline" size={30} color="#aaa" />
            </InputItem>
            <HelperText type="error" visible={!isEmail}>
              {emailMessage}
            </HelperText>
            <InputItem
              //clear
              value={signUpInfo.name}
              onChange={e => onChangeName(e)}
              placeholder="Name">
              <Icon name="account-outline" size={30} color="#aaa" />
            </InputItem>
            <HelperText type="error" visible={!isName}>
              {nameMessage}
            </HelperText>
            <InputItem
              clear
              type="phone"
              value={signUpInfo.phone}
              onChange={e => onChangePhone(e)}
              placeholder="Phone Number">
              <Icon name="phone-outline" size={30} color="#aaa" />
            </InputItem>
            <HelperText type="error" visible={!isPhone}>
              {phoneMessage}
            </HelperText>
            <WhiteSpace size="xs" />
            <InputItem
              clear
              type="password"
              value={signUpInfo.password}
              onChange={e => onChangePassword(e)}
              placeholder="Password">
              <Icon name="lock-outline" size={30} color="#aaa" />
            </InputItem>
            <HelperText type="error" visible={!isPassword}>
              {passwordMessage}
            </HelperText>

            <InputItem
              type="password"
              clear
              value={signUpInfo.confirmPassword}
              onChange={e => onChangePasswordConfirm(e)}
              placeholder="Confirm Password">
              <Icon name="lock-outline" size={30} color="#aaa" />
            </InputItem>
          </Flex>

          <WhiteSpace size="lg" />

          <Button
            disabled={!(isName && isEmail && isPassword && isConfirmPassword)}
            type="warning"
            onPress={handleVerifySignUp}>
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
