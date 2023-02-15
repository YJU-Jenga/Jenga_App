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
} from '@ant-design/react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getValueFunction = () => {
  // Function to get the value from AsyncStorage
  AsyncStorage.getItem('login').then(
    value =>
      // AsyncStorage returns a promise
      // Adding a callback to get the value
      console.log(value),
    // Setting the value in Text
  );
};

const LoginScreen = ({route, navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [userData, setUserData] = React.useState({});

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarVisible: false,
      });

      if (parent) {
        parent.setOptions({
          tabBarStyle: {display: 'none'},
        });
      }

      userDataStorage.get(userData).then(setUserData).catch(console.error);

      return () => {
        if (parent) {
          parent.setOptions({
            tabBarVisible: true,
          });
        }
      };
    }, [navigation]),
  );

  const handleVerifyLogin = async () => {
    setStatus('');
    setShowCupom(false);
    setLoading(true);

    if (email.trim() !== '' && password.trim() !== '') {
      const req = await fetch('https://api.b7web.com.br/loginsimples/', {
        /// estou enviando para ver se consigo logar;
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await req.json();

      if (json.status === 'ok') {
        setStatus('로그인 성공');
        setShowCupom(true);
      } else {
        setStatus('로그인 실패');
        console.log('로그인 실패');
        // 백엔드로부터..,
        Alert.alert('경고', `아이디/비밀번호를 다시 확인해주세요`);
        navigation.navigate('record');
      }
      setLoading(false);
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
              onChange={e => setEmail(e)}
              placeholder="Id"
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

          <Button type="warning" onPress={handleVerifyLogin}>
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
