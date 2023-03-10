import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  Button,
  Linking,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Audio} from 'expo-av';

const RecordScreen = ({navigation}) => {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      //Linking.openSettings();
      console.error('녹음기능이 없어 맥미니에', err);
      // console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 10,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{paddingBottom: 200}}>
        <Text style={{fontSize: 50, textAlign: 'center', paddingBottom: 20}}>
          🍓
        </Text>
        <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'center'}}>
          안녕 예진!
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/image/mic2.png')}
          style={{width: 100, height: 100, borderRadius: 60, padding: 40}}
        />
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>
    </View>
  );
};

export default RecordScreen;
