import React from 'react';
import {
  SafeAreaView,
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface loginForm {
  id: string;
  pw: string;
}

interface signUpForm extends loginForm {
  confirmPw: string;
}

type LoginFormProps = {
  onSubmit: (form: loginForm) => void;
};

const LoginScreen = ({route}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [status, setStatus] = React.useState('');
  const [showCupom, setShowCupom] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleVerifyLogin = async () => {
    setStatus('');
    setShowCupom(false);
    setLoading(true);

    if (email.trim() != '' && password.trim() != '') {
      const req = await fetch('https://api.b7web.com.br/loginsimples/', {
        /// estou enviando para ver se consigo logar;
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password, //// como é o mesmo nome, posso só mandar ({email, password})
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
        setShowCupom(false);
      }
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>로그인</Text>

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
        secureTextEntry={true} /// para ele não aparecer a senha e mostrar ela codificada nesse secureTextEntry
      />

      <Button title="Submit" onPress={handleVerifyLogin} />

      {loading && (
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
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#444',
    padding: 20,
  },
  header: {
    marginTop: 4,
    color: '#111',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 45,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
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

export default LoginScreen;
