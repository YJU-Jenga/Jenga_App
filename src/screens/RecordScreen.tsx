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
  SafeAreaView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import React, {useCallback, useState, useEffect} from 'react';

import {Audio} from 'expo-av';
import {selectUserData} from '../utils/redux/userSlice';
import {useSelector} from 'react-redux';
import {Flex, Toast, WingBlank} from '@ant-design/react-native';
import Title from '../components/Title';
import Slider from '@react-native-community/slider';
import {useInterval} from '../utils/useInterval';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordScreen = ({navigation}) => {
  const [recording, setRecording] = React.useState();
  const [recordingInfo, setRecordingInfo] = React.useState();
  const _userData = useSelector(selectUserData);
  const [sound, setSound] = useState(null);
  const [soundPath, setSoundPath] = useState<string>('');
  const [soundList, setSoundList] = useState<string>('');
  const [recordingUri, setRecordingUri] = useState();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [displayPosition, setDisplayPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useInterval(
    () => {
      //onSliderValueChange(position);
      sound.getStatusAsync().then(res => {
        setDisplayPosition(res.positionMillis);

        if (res.positionMillis == res.durationMillis) {
          setIsPlaying(false);
          setPosition(0);
          sound.setPositionAsync(0);
        }
      });
    },
    isPlaying ? 1000 : null,
  );

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
      setRecordingUri(recording._uri);
      setRecordingInfo({
        mimeType: recording._options.web.mimeType,
        isRecording: true,
      });
      console.log('Recording started');
    } catch (e) {
      //Linking.openSettings();
      if (e.code === 'E_MISSING_PERMISSION') {
        Alert.alert('에러', '마이크 권한 접근을 허용하세요', [
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
        Alert.alert('알 수 없는 에러', `교수님에게 문의해주세요`);
      }
      //console.error('에러 해결 안 됨', e.constructor);
      // console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    //console.log(recording._uri);
    await recording.stopAndUnloadAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    setRecording(undefined);
    //const uri = recording._uri;
    const filename = recordingUri.split('/').pop();
    console.log('fileName : ', filename);

    const filepath = FileSystem.documentDirectory + filename;
    setSoundPath(filepath);
    await FileSystem.moveAsync({
      from: recordingUri,
      to: filepath,
    });

    setRecordingInfo({
      ...recordingInfo,
      uri: filepath,
    });

    console.log('Recording stopped and stored at', filepath);
    loadSound(filepath);
    getSounds();
  }

  async function deleteRecord() {
    await FileSystem.deleteAsync(soundPath);
    setRecordingInfo(null);
    setRecordingUri(null);
    setSound(null);
    setSoundPath(null);
    Alert.alert('삭제됐습니다');
  }

  async function saveRecord(e) {
    //이름만 바꾸고 경로는 안 바꿀게요^^~~~~

    console.log('info: ', e);
    const extension = recordingInfo.uri.split('.');

    const name = e + '.' + extension[extension.length - 1];

    if (soundList) {
      console.log(soundList);
      await AsyncStorage.setItem(
        'sounds',
        JSON.stringify([
          {
            mimeType: recordingInfo.mimeType,
            name: name,
            uri: recordingInfo.uri,
          },
          ...soundList,
        ]),
      );
    } else {
      await AsyncStorage.setItem(
        'sounds',
        JSON.stringify([
          {
            mimeType: recordingInfo.mimeType,
            name: name,
            uri: recordingInfo.uri,
          },
        ]),
      );
    }
  }

  async function loadSound(soundPath: string) {
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync({uri: soundPath});
    setSound(sound);
    sound.getStatusAsync().then(res => {
      setDuration(Math.floor(res.durationMillis));
    });
  }

  async function playSound() {
    await sound.setPositionAsync(position);
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function pauseSound() {
    sound.getStatusAsync().then(res => {
      setPosition(res.positionMillis);
    });
    await sound.pauseAsync();
    sound.setPositionAsync(position);
    setIsPlaying(false);
    //clearInterval;
  }

  const getSounds = async () => {
    //AsyncStorage.removeItem('sounds');
    const data = await AsyncStorage.getItem('sounds');
    setSoundList(JSON.parse(data));
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <Title title="Record"></Title>
      <WingBlank size="lg">
        <View
          style={{
            alignItems: 'center',
            height: '100%',
            backgroundColor: 'pink',
          }}>
          <Pressable
            style={{
              backgroundColor: 'black',
              justifyContent: 'center',
              flex: 2.5,
            }}
            //</View>onPress={recording ? stopRecording : startRecording}
          >
            <Image
              alt="마이크"
              source={require('../assets/image/mic2.png')}
              style={{width: 100, height: 100, borderRadius: 60, padding: 40}}
            />
            <Button
              title={recording ? '녹음 종료' : '녹음 시작'}
              onPress={recording ? stopRecording : startRecording}
            />
          </Pressable>
          <View style={{flex: 1, backgroundColor: '#ddd', padding: '5%'}}>
            <View style={styles.sliderContainer}>
              {!isPlaying ? (
                <Ionicons
                  name="ios-play-circle"
                  size={48}
                  color="#444"
                  onPress={playSound}
                />
              ) : (
                <Ionicons
                  name="ios-pause"
                  size={48}
                  color="#444"
                  onPress={pauseSound}
                />
              )}
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={displayPosition}
                onSlidingComplete={async value =>
                  await sound.getStatusAsync().then(res => {
                    console.log(value);
                    setPosition(value);
                    setDisplayPosition(value);
                    sound.setPositionAsync(value);
                  })
                }
                onValueChange={value => setDisplayPosition(value)}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#000"
              />
            </View>
            <Flex justify="end">
              <Button
                title="저장"
                onPress={() =>
                  Alert.prompt(
                    '녹음 제목을 입력하세요',
                    '리스닝 파일에 저장됩니다.',
                    e => saveRecord(e),
                  )
                }></Button>
              <Button color="red" title="삭제" onPress={deleteRecord}></Button>
            </Flex>
          </View>
        </View>
      </WingBlank>
    </SafeAreaView>
  );
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sliderContainer: {
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 30,
  },
  slider: {
    width: '100%',
    height: 40,
    flex: 1,
  },
});

export default RecordScreen;
