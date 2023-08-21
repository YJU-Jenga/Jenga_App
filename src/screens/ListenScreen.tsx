import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Button,
  Image,
  Platform,
  FlatList,
  Alert,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  PermissionsAndroid,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import Title from '../components/Title';
import {
  Provider,
  Modal,
  WhiteSpace,
  WingBlank,
  DatePickerView,
  List,
  Flex,
  SearchBar,
  PickerView,
} from '@ant-design/react-native';
import {Snackbar} from 'react-native-paper';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import {Audio} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';

import {useAppSelector, useAppDispatch} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useInterval} from '../utils/useInterval';
import FloatingButton from '../components/FloatingButton';
import DeleteButton from '../components/DeleteButton';
import DefaultButton from '../components/DefaultButton';
import * as FileSystem from 'expo-file-system';

import {height} from '../config/globalStyles';
import {createAlarm} from '../utils/redux/alarmSlice';
import {useNavigation} from '@react-navigation/native';
import {createMusic, getAllMusic, getOneMusic} from '../utils/redux/musicSlice';
import Prompt from '../components/Prompt';

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
  isRecording?: boolean;
}

const requestDocumentPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'ファイルアクセス権',
        message: 'ファイルへのアクセス権を許可してください。.',
        buttonNeutral: 'あとで',
        buttonNegative: 'キャンセル',
        buttonPositive: '許可',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the READ_EXTERNAL_STORAGE');
    } else {
      console.log('READ_EXTERNAL_STORAGE permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const ListenScreen = ({ui}) => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [soundInfo, setSoundInfo] = React.useState<ISound>();
  const [soundList, setSoundList] = React.useState([]);
  const [sound, setSound] = React.useState();

  const [currIdx, setCurrIdx] = React.useState<number>();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [name, setName] = useState<string>('');

  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [listPerPage, setListPerPage] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();

  const [promptVisible, setPromptVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const updateSearch = search => {
    setSearch(search);
    if (soundList) {
      const filtered = soundList?.filter(itemList => {
        return itemList.name.toUpperCase().includes(search.toUpperCase());
      });
      setSearchList(filtered);
      setTotalPage(Math.ceil(filtered.length / 10));
      setListPerPage(filtered.slice(0, 10));
    }
  };

  useInterval(
    () => {
      sound.getStatusAsync().then(res => {
        console.log(res.positionMillis);
        setPosition(res.positionMillis);

        if (res.positionMillis >= res.durationMillis) {
          setIsPlaying(false);
          sound?.pauseAsync();
          setPosition(0);
          sound.setPositionAsync(0);
        }
      });
    },
    isPlaying ? 1000 : null,
  );

  useEffect(() => {
    if (soundInfo?.uri) {
      console.log('로딩');
      console.log(soundInfo);
      loadSound(soundInfo?.uri);
    }
  }, [soundInfo]);

  React.useEffect(
    () =>
      navigation.addListener('blur', async () => {
        setIsPlaying(false);
        setPosition(0);
        setDuration(null);
        setSound(null);
        setVisibleModal(false);
      }),
    [],
  );

  async function loadSound(soundPath: string) {
    console.log('Loading Sound : ', soundPath);
    const {sound} = await Audio.Sound.createAsync({uri: soundPath});
    setSound(sound);
    sound.getStatusAsync().then(res => {
      setDuration(Math.floor(res.durationMillis));
    });
  }

  async function playSound() {
    //await sound.setPositionAsync(position);
    console.log('Playing Sound');
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

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const goBack = () => {
    if (visibleModal) {
      setVisibleModal(false);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', goBack);
    };
  }, [visibleModal, goBack]);

  const handleOpenDocumentPicker = async () => {
    try {
      if (Platform.OS === 'android') await requestDocumentPermission();

      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (result.type !== 'cancel') {
        // const data = ;

        console.log(result);

        if (soundList) {
          console.log(soundList);
          await AsyncStorage.setItem(
            'sounds',
            JSON.stringify([
              {
                mimeType: result.mimeType,
                name: result.name,
                uri: result.uri,
                isRecording: false,
                type: 'uncategorized',
              },
              ...soundList,
            ]),
          );
        } else {
          await AsyncStorage.setItem(
            'sounds',
            JSON.stringify([
              {
                mimeType: result.mimeType,
                name: result.name,
                uri: result.uri,
                isRecording: false,
                type: 'uncategorized',
              },
            ]),
          );
        }
        getSoundList('handle open');
      } else if (result?.type === 'cancel') {
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onCloseModal = () => {
    setVisibleModal(false);
    setIsPlaying(false);
    setPosition(0);
    sound?.setPositionAsync(0);
    sound?.pauseAsync();
  };

  const getSoundList = React.useCallback(async clg => {
    //AsyncStorage.removeItem('sounds');
    console.log(clg);
    const d = await AsyncStorage.getItem('sounds');
    if (d) {
      setSoundList(JSON.parse(d));
    }
    //console.log('getSOUND : ', d);
  }, []);

  const onPressAddMusic = React.useCallback(
    name => {
      dispatch(createMusic({userId: ui.id, name: name, soundInfo: soundInfo}));
      //setPromptVisible(true);
    },
    [soundInfo],
  );

  const onLoadAllMusic = React.useCallback(() => {
    dispatch(getAllMusic(ui.id));
  }, []);

  const onLoadOneMusic = React.useCallback(() => {
    dispatch(getOneMusic(ui.id));
  }, []);

  // const fetchGetSoundList = navigation.addListener('focus', () => {
  //   getSoundList('포커스할때,,,');
  // });

  React.useEffect(() => {
    // return () => fetchGetSoundList();
    navigation.addListener('focus', async () =>
      getSoundList('アラームスクリーンコピー'),
    );
  }, []);

  const deleteSound = index => {
    Alert.alert('削除', 'ファイルを削除しますか？', [
      {text: 'キャンセル'},
      {
        text: '確認',
        onPress: async () => {
          const newSoundList = [...soundList];
          newSoundList.splice(index, 1);
          setSoundList(newSoundList);
          await AsyncStorage.setItem('sounds', JSON.stringify(newSoundList));
          getSoundList('削除用');
          setVisibleModal(false);

          if (soundList[index].type === 'record') {
            await FileSystem.deleteAsync(soundList[index].uri);
            console.log(soundList[index]);
          }
        },
      },
    ]);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  //state to manage whether track player is initialized or not

  const SearchComponent = () => {
    return (
      <View>
        {search ? (
          <FlatList
            contentContainerStyle={{paddingBottom: '40%'}}
            data={searchList}
            renderItem={({item, index}) => (
              <List.Item
                onPress={() => {
                  setVisibleModal(true);
                  setSoundInfo(item);
                  setCurrIdx(index);
                }}
                extra={
                  <View
                    style={{
                      borderRadius: 30,
                      backgroundColor: 'gray',
                      width: 10,
                      height: 10,
                    }}></View>
                }>
                <Text style={{fontFamily: 'TheJamsilOTF_Light'}}>
                  {item.name}
                </Text>
              </List.Item>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            onEndReached={() => {
              if (page <= totalPage) {
                setPage(page + 1);
                setListPerPage(
                  listPerPage.concat(
                    searchList.slice(10 * page, 10 * (page + 1)),
                  ),
                );
              }
            }}></FlatList>
        ) : (
          <View style={{height: '100%'}}>
            <FlatList
              contentContainerStyle={{paddingBottom: '40%'}}
              // style={{minHeight: '70%'}}
              data={soundList}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews={true}
              onEndReached={() => {
                if (page <= totalPage) {
                  setPage(page + 1);
                  setListPerPage(
                    listPerPage.concat(
                      searchList.slice(10 * page, 10 * (page + 1)),
                    ),
                  );
                }
              }}
              renderItem={({item, index}) => {
                const color = item?.type === 'record' ? 'skyblue' : 'lightpink';
                return (
                  <List.Item
                    onPress={() => {
                      setVisibleModal(true);
                      setSoundInfo(item);
                      setCurrIdx(index);

                      //loadSound();
                    }}
                    extra={
                      <View
                        style={{
                          borderRadius: 30,
                          backgroundColor: color,
                          width: 10,
                          height: 10,
                        }}></View>
                    }>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'TheJamsilOTF_Regular',
                      }}>
                      {item.name}
                    </Text>
                  </List.Item>
                );
              }}></FlatList>
          </View>
        )}
      </View>
    );
  };

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          backgroundColor: 'white',
        }}>
        <Title title="Sounds"></Title>
        <SearchBar
          style={{fontFamily: 'TheJamsilOTF_Light'}}
          placeholder="オーディオのタイトルを入力してください。"
          onChange={updateSearch}
          value={search}
          onSubmit={v => {
            console.log(v);
          }}
          onClear={v => {}}
        />

        <WingBlank>
          {!(Array.isArray(soundList) && soundList.length === 0) ? (
            <SearchComponent></SearchComponent>
          ) : (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 50,
                  fontSize: 21,
                  color: '#777',
                }}>
                音楽、童話をアップロードしてください。
              </Text>
            </View>
          )}
        </WingBlank>
        <FloatingButton onPress={handleOpenDocumentPicker}></FloatingButton>
        <Modal
          transparent={false}
          visible={visibleModal}
          animationType="slide-up"
          onClose={() => {
            onCloseModal();
          }}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            {/* <WingBlank size="md"></WingBlank> */}
            <Flex direction="row">
              <WingBlank size="md"></WingBlank>
              <Ionicons
                name="md-caret-back-outline"
                size={30}
                color={'#ff6e6e'}
                onPress={onCloseModal}></Ionicons>
            </Flex>
            <WingBlank size="lg">
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  // alignContent: 'center',
                  // alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 32,
                    marginBottom: height * 30,
                    color: '#111',
                    fontFamily: 'TheJamsilOTF_Light',
                  }}>
                  {soundInfo?.name}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  onSlidingComplete={async value =>
                    await sound.getStatusAsync().then(res => {
                      setPosition(value);
                      setPosition(value);
                      sound.setPositionAsync(value);
                    })
                  }
                  onValueChange={value => setPosition(value)}
                  minimumTrackTintColor="#000"
                  maximumTrackTintColor="#ccc"
                  thumbTintColor="#000"
                />
                <Flex justify="between">
                  <Text>{formatTime(Math.floor(position / 1000))}</Text>
                  <View>
                    {!isPlaying ? (
                      <Ionicons
                        name="ios-play-circle"
                        size={48}
                        color="#111"
                        onPress={playSound}
                      />
                    ) : (
                      <Ionicons
                        name="ios-pause"
                        size={48}
                        color="#111"
                        onPress={pauseSound}
                      />
                    )}
                  </View>
                  <Text>{formatTime(Math.floor(duration / 1000))}</Text>
                </Flex>

                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
                <DefaultButton
                  onPress={() => {
                    setPromptVisible(true);
                  }}
                  type="register"
                  title="アラーム用に登録"></DefaultButton>
                <DeleteButton
                  onPress={() => {
                    deleteSound(currIdx);
                  }}></DeleteButton>
              </View>
              {/* <WhiteSpace></WhiteSpace> */}
            </WingBlank>
            <Prompt
              visible={promptVisible}
              title="音楽の用途を入力してください"
              message={`'アラーム設定 > ミュージック」で確認できます`}
              onCancel={() => {
                setPromptVisible(false);
              }}
              onSubmit={text => {
                if (text.length == 0) {
                  setSnackbarVisible(true);
                  setSnackbarContent('名前を入力してください');
                  return;
                } else {
                  //setName(text);
                  onPressAddMusic(text);
                  setPromptVisible(false);
                  setSnackbarVisible(true);
                  setSnackbarContent('アラーム用の音楽が登録されました');
                }
              }}
            />
          </SafeAreaView>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => {
              setSnackbarVisible(false);
              setSnackbarContent('');
            }}
            duration={2500}>
            {snackbarContent}
          </Snackbar>
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};

export default ListenScreen;
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
    width: '80%',
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
});
