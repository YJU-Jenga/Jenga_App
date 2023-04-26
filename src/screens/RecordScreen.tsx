import {
  Animated,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  Linking,
  Alert,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import {MotiView} from 'moti';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import React, {useCallback, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Snackbar} from 'react-native-paper';

import {AVPlaybackStatus, Audio} from 'expo-av';
import {selectUserData} from '../utils/redux/userSlice';
import {useSelector} from 'react-redux';
import {Button, Flex, WingBlank} from '@ant-design/react-native';
import Title from '../components/Title';
import Slider from '@react-native-community/slider';
import {useInterval} from '../utils/useInterval';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Easing} from 'react-native-reanimated';
import {height, width} from '../config/globalStyles';
import PopupMessage from '../components/PopupMessage';
import Prompt from '../components/Prompt';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from 'expo-av/build/Audio';

const RecordScreen = ({navigation}) => {
  const [recording, setRecording] = React.useState<Audio.Recording | null>();
  const [recordingInfo, setRecordingInfo] = React.useState();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [soundPath, setSoundPath] = useState<string | null>('');
  const [soundList, setSoundList] = useState<string | null>('');
  const [recordingUri, setRecordingUri] = useState<string | null>();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [displayPosition, setDisplayPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');
  const [promptVisible, setPromptVisible] = useState(false);
  const [result, setResult] = useState('');

  useInterval(
    () => {
      //onSliderValueChange(position);
      console.log('가자');
      sound?.getStatusAsync().then((res: AVPlaybackStatus) => {
        setDisplayPosition(res.positionMillis);

        if (res.positionMillis >= res.durationMillis) {
          setIsPlaying(false);
          setPosition(0);
          sound?.pauseAsync();
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

      const {recording}: Audio.Recording | null =
        await Audio.Recording.createAsync(
          {
            isMeteringEnabled: true,
            android: {
              extension: '.m4a',
              outputFormat: AndroidOutputFormat.MPEG_4,
              audioEncoder: AndroidAudioEncoder.AAC,
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
            },
            ios: {
              extension: '.m4a',
              outputFormat: IOSOutputFormat.MPEG4AAC,
              audioQuality: IOSAudioQuality.MAX,
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
            web: {
              mimeType: 'audio/webm',
              bitsPerSecond: 128000,
            },
          },
          //Audio.RecordingOptionsPresets.LOW_QUALITY,
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
            text: '확인',
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
        Alert.alert('알 수 없는 에러', `제작자에게 문의해주세요`);
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
    setModalVisible(true);
  }

  async function deleteRecord() {
    setSnackbarContent('녹음이 삭제되었습니다');
    setModalVisible(false);
    setSnackbarVisible(true);
    setIsPlaying(false);
    await FileSystem.deleteAsync(soundPath);
    setRecordingInfo(null);
    setRecordingUri(null);
    setSound(null);
    setSoundPath(null);
  }

  React.useEffect(
    () =>
      navigation.addListener('blur', async () => {
        console.log('초기화');
        setIsPlaying(false);
        setRecordingInfo(null);
        setRecordingUri(null);
        setSound(null);
        setSoundPath(null);
      }),
    [],
  );

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
            type: 'record',
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
            type: 'record',
          },
        ]),
      );
    }
    setRecordingInfo(null);
    setRecordingUri(null);
    setSound(null);
    setSoundPath(null);
    setSnackbarContent('녹음을 저장했습니다');
    setModalVisible(false);
    setSnackbarVisible(true);
  }

  async function loadSound(soundPath: string) {
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync({uri: soundPath});
    setSound(sound);
    sound.getStatusAsync().then(res => {
      setDuration(Math.floor(res.durationMillis));
      sound.setPositionAsync(0);
    });
    setIsPlaying(true);
    await playSound(sound);
  }

  const playSound = React.useCallback(
    async sound => {
      await sound.setPositionAsync(position);
      setDisplayPosition(position);
      await sound.playAsync();
      setIsPlaying(true);
    },
    [sound],
  );

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

  React.useEffect(
    () =>
      navigation.addListener('blur', async () => {
        console.log('초기화');
        setIsPlaying(false);
        setSoundPath(null);
        try {
          if (soundPath) await FileSystem.deleteAsync(soundPath);
        } catch {
          setSoundPath(null);
        }
        setRecordingInfo(null);
        setRecordingUri(null);
        setSound(null);
        setSoundPath(null);
        setRecording(null);
      }),
    [],
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title title="Record"></Title>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          setSnackbarContent('');
        }}
        duration={2500}>
        {snackbarContent}
      </Snackbar>

      <WingBlank style={{}} size="lg">
        <Pressable
          onPress={recording ? stopRecording : startRecording}
          style={{
            width: '100%',
            height: '100%',
            paddingTop: height * 150,
            alignItems: 'center',
          }}>
          <View style={[styles.dot, styles.center, {}]}>
            <View
              style={[
                styles.dot,
                styles.center,
                {
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F9C8C8',
                },
              ]}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  //flex: 1,
                }}
                onPress={recording ? stopRecording : startRecording}>
                <Text style={{textAlign: 'center', zIndex: 1}}>
                  <Icon name="microphone" size={80} color="#fff" />
                </Text>
              </Pressable>
            </View>

            {recording &&
              [...Array(2).keys()].map(i => {
                return (
                  <MotiView
                    from={{opacity: 1, scale: 1}}
                    animate={{opacity: 0, scale: 3.5}}
                    key={i}
                    transition={{
                      type: 'timing',
                      duration: 1500,
                      easing: Easing.out(Easing.ease),
                      delay: i * 400,

                      repeatReverse: false,
                      loop: true,
                    }}
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.dot,
                      {width: '100%', height: '100%'},
                    ]}></MotiView>
                );
              })}
          </View>
          {/* {!recording && (
            <PopupMessage
              onPress={recording ? stopRecording : startRecording}
              msg={'터치해서 녹음을 시작하세요'}></PopupMessage>
          )} */}
        </Pressable>

        {/* {isCompletedRecord && (
            
          )} */}
      </WingBlank>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <SafeAreaView
          style={{position: 'relative', width: '100%', height: '100%'}}>
          <View style={[styles.modalView]}>
            <View style={styles.sliderContainer}>
              <Flex>
                {!isPlaying ? (
                  <Ionicons
                    name="ios-play-circle"
                    size={48}
                    color="#444"
                    onPress={() => playSound(sound)}
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
              </Flex>
              <Flex style={{width: '100%', gap: 10}} direction="row">
                <Button
                  style={{flex: 1}}
                  size="large"
                  onPress={() =>
                    // Alert.prompt(
                    //   '녹음 제목을 입력하세요',
                    //   '리스닝 파일에 저장됩니다.',
                    //   e => saveRecord(e),
                    // )
                    setPromptVisible(true)
                  }
                  // onPress={() => {
                  //   prompt(
                  //     'Enter password',
                  //     'Enter your password to claim your $1.5B in lottery winnings',
                  //     [
                  //       {
                  //         text: 'Cancel',
                  //         onPress: () => console.log('Cancel Pressed'),
                  //         style: 'cancel',
                  //       },
                  //       {
                  //         text: 'OK',
                  //         onPress: password =>
                  //           console.log('OK Pressed, password: ' + password),
                  //       },
                  //     ],
                  //     {
                  //       type: 'secure-text',
                  //       cancelable: false,
                  //       defaultValue: 'test',
                  //       placeholder: 'placeholder',
                  //     },
                  //   );
                  // }}
                >
                  저장
                </Button>
                <Button style={{flex: 1}} type="warning" onPress={deleteRecord}>
                  삭제
                </Button>
              </Flex>
            </View>
          </View>
          <Prompt
            visible={promptVisible}
            title="제목을 입력해주세요"
            message="리스닝 파일로 저장됩니다."
            onCancel={() => {
              setPromptVisible(false);
            }}
            onSubmit={text => {
              if (text.length == 0) {
                setPromptVisible(false);
                saveRecord('무제');
                return;
              } else {
                setPromptVisible(false);
                saveRecord(text);
              }
            }}
          />
        </SafeAreaView>
      </Modal>
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
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    padding: '10%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  slider: {
    width: '100%',
    height: 40,
    flex: 1,
  },
  dot: {
    width: width * 150,
    height: width * 150,
    borderRadius: 200,
    backgroundColor: '#ff6e6e',
  },
  center: {alignItems: 'center', justifyContent: 'center'},
  modalView: {
    // margin: 20,
    width: '100%',
    borderRadius: 20,
    height: '40%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default RecordScreen;
