import {
  Flex,
  InputItem,
  WhiteSpace,
  WingBlank,
  Button,
} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useCallback} from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {registerAccount} from '../utils/redux/userSlice';

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

  // 유효성 검사
  const [isName, setIsName] = React.useState<boolean>(false);
  const [isEmail, setIsEmail] = React.useState<boolean>(false);
  const [isPhone, setIsPhone] = React.useState<boolean>(false);
  const [isPassword, setIsPassword] = React.useState<boolean>(false);
  const [isConfirmPassword, setIsConfirmPassword] =
    React.useState<boolean>(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (signUpInfo.password === signUpInfo.confirmPassword) {
      setConfirmPasswordMessage('비밀번호를 똑같이 입력했어요 : )');
      setIsConfirmPassword(true);
    } else {
      setConfirmPasswordMessage('비밀번호가 틀려요. 다시 확인해주세요 ㅜ ㅜ');
      setIsConfirmPassword(false);
      console.log('위', signUpInfo.password);
      console.log('아래', signUpInfo.confirmPassword);
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
        setEmailMessage('이메일 형식이 틀렸어요');
        setIsEmail(false);
      } else {
        setEmailMessage('올바른 이메일 형식이에요');
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
        setNameMessage('2글자 이상 5글자 미만으로 입력해주세요.');
        setIsName(false);
      } else {
        setNameMessage('올바른 이름 형식입니다 :)');
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
        setPhoneMessage('이메일 형식이 틀렸어요');
        setIsPhone(false);
        console.log(phone.length);
      } else {
        setPhoneMessage('올바른 이메일 형식이에요');
        setIsPhone(true);
      }
    },
    [signUpInfo],
  );

  const onChangePassword = useCallback(
    (e: string) => {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

      const password = e;
      setSignUpInfo({...signUpInfo, password});

      if (!passwordRegex.test(e)) {
        setPasswordMessage(
          '숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요',
        );
        setIsPassword(false);
      } else {
        setPasswordMessage('안전한 비밀번호에요');
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

  const handleVerifySignUp = async () => {
    dispatch(registerAccount(signUpInfo));
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
              onChange={e => onChangeEmail(e)}
              placeholder="Email">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
            <InputItem
              //clear
              value={signUpInfo.name}
              onChange={e => onChangeName(e)}
              placeholder="Name">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
            <InputItem
              clear
              type="phone"
              value={signUpInfo.phone}
              onChange={e => onChangePhone(e)}
              placeholder="Phone Number">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>
            <WhiteSpace size="xs" />
            <InputItem
              clear
              type="password"
              value={signUpInfo.password}
              onChange={e => onChangePassword(e)}
              placeholder="Password">
              <Icon name="delete-sweep" size={30} color="#aaa" />
            </InputItem>

            <InputItem
              type="password"
              clear
              value={signUpInfo.confirmPassword}
              onChange={e => onChangePasswordConfirm(e)}
              placeholder="Confirm Password">
              <Icon name="delete-sweep" size={30} color="#aaa" />
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
