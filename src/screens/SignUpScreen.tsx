import React from 'react';
import {
  SafeAreaView,
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

const SignUpScreen = ({route, navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [status, setStatus] = React.useState('');
  const [showCupom, setShowCupom] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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
        Alert.alert(`다시 입력하세요`);
      }
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <View style={{marginHorizontal: 20, marginTop: 40}}>
        <TextInput
          style={styles.input}
          placeholder="id"
          value={email}
          onChangeText={e => setEmail(e)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          value={password}
          onChangeText={e => setPassword(e)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="re-password"
          value={password}
          onChangeText={e => setPassword(e)}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Record', {id: '아이디'})}
          style={{
            borderRadius: 10,
            // marginHorizontal: 10,
            backgroundColor: 'red',
            paddingVertical: 10,
          }}>
          <Text style={{textAlign: 'center', color: '#fff', fontSize: 18}}>
            Sign Up
          </Text>
        </TouchableOpacity>
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
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 30,
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
  cupomArea: {
    backgroundColor: '#444',
    borderRadius: 5,
    padding: 30,
  },
  cupomTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  cupomCode: {
    textAlign: 'center',
    fontSize: 40,
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

export default SignUpScreen;
