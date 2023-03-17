import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  Button,
  Linking,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import React, {useCallback} from 'react';
import {Audio} from 'expo-av';
import {selectUserData} from '../utils/redux/userSlice';
import {useSelector} from 'react-redux';
import {Toast} from '@ant-design/react-native';

const RecordScreen = ({navigation}) => {
  const [recording, setRecording] = React.useState();
  const _userData = useSelector(selectUserData);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const {recording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      // await recording.prepareToRecordAsync(
      //   Audio.RecordingOptionsPresets.HIGH_QUALITY,
      // );

      //await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (e) {
      //Linking.openSettings();
      if (e.code === 'E_MISSING_PERMISSION') {
        console.log(e.code);
        Alert.alert('권한 허용해라', '마이크 권한 접근', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: '접근 허용하기',
            onPress: () => Linking.openSettings(),
          },
        ]);
      } else if (e.code === 'E_AUDIO_RECORDERNOTCREATED') {
        Alert.alert('에러', '장치를 확인해주세요');
      } else {
        console.error(e);
      }
      //console.error('에러 해결 안 됨', e.constructor);
      // console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log(recording._uri);
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    // {"_canRecord": true, "_cleanupForUnloadedRecorder": [Function anonymous], "_finalDurationMillis": 0, "_isDoneRecording": false, "_onRecordingStatusUpdate": null, "_options": {"android": {"audioEncoder": 3, "bitRate": 128000, "extension": ".m4a", "numberOfChannels": 2, "outputFormat": 2, "sampleRate": 44100}, "ios": {"audioQuality": 127, "bitRate": 128000, "extension": ".m4a", "linearPCMBitDepth": 16, "linearPCMIsBigEndian": false, "linearPCMIsFloat": false, "numberOfChannels": 2, "outputFormat": "aac ", "sampleRate": 44100}, "isMeteringEnabled": true, "keepAudioActiveHint": true, "web": {"bitsPerSecond": 128000, "mimeType": "audio/webm"}}, "_pollingLoop": [Function anonymous], "_progressUpdateIntervalMillis": 500, "_progressUpdateTimeoutVariable": null, "_subscription": null, "_uri": "file:///Users/aedin/Library/Developer/CoreSimulator/Devices/B1ED6C42-7B2E-49CD-A57B-E88CD794E68D/data/Containers/Data/Application/D5A15A74-F871-4016-84E5-B8C41663F6F6/Library/Caches/AV/recording-45D5B202-6BC9-445C-9849-AFBE3F36014A.m4a", "getStatusAsync": [Function anonymous]}
    const uri = recording._uri;
    const filename = uri.split('/').pop();
    const filepath = FileSystem.documentDirectory + filename;
    await FileSystem.moveAsync({
      from: uri,
      to: filepath,
    });
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
          안녕 {_userData.name}!
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
