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
        title: '파일 접근 권한',
        message: '파일 접근 권한을 허가하세요.',
        buttonNeutral: '나중에',
        buttonNegative: '취소',
        buttonPositive: '허가',
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

const ListenScreen = ({navigation}) => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [soundInfo, setSoundInfo] = React.useState<ISound>();
  const [soundList, setSoundList] = React.useState([]);
  const [sound, setSound] = React.useState();

  const [currIdx, setCurrIdx] = React.useState<number>();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [listPerPage, setListPerPage] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();

  const [pickerValue, setPickerValue] = useState('1');

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
      console.log('야호');
      sound.getStatusAsync().then(res => {
        console.log(res.positionMillis);
        setPosition(res.positionMillis);

        if (res.positionMillis == res.durationMillis) {
          setIsPlaying(false);
          console.log('object');
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
        console.log('초기화');
        setIsPlaying(false);
        //setSoundPath(null);
        // setRecordingInfo(null);
        // setRecordingUri(null);
        setPosition(0);
        setDuration(null);
        setSound(null);
        //setSoundPath(null);
        //setRecording(null);
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
      console.log('응애ㅠ');
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
      console.log('죽어라 안드로이드');

      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      console.log('ㅏ아아아아ㅏㅇ');
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
        getSoundList();
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
    console.log('object');
    setPosition(0);
    sound?.setPositionAsync(0);
    sound?.pauseAsync();
  };

  const getSoundList = async () => {
    //AsyncStorage.removeItem('sounds');
    const d = await AsyncStorage.getItem('sounds');
    if (d) {
      setSoundList(JSON.parse(d));
    }
    //console.log('getSOUND : ', d);
  };

  const fetchGetSoundList = navigation.addListener('focus', () => {
    getSoundList();
  });

  React.useEffect(() => {
    return () => fetchGetSoundList();
  }, []);

  const deleteSound = index => {
    Alert.alert('삭제', '파일을 삭제하시겠습니까?', [
      {text: '취소'},
      {
        text: '확인',
        onPress: async () => {
          const newSoundList = [...soundList];
          newSoundList.splice(index, 1);
          setSoundList(newSoundList);
          await AsyncStorage.setItem('sounds', JSON.stringify(newSoundList));
          getSoundList();
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
          placeholder="오디오의 제목을 입력하세요"
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
                음악, 동화를 업로드해주세요
              </Text>
            </View>
          )}
        </WingBlank>
        <FloatingButton onPress={handleOpenDocumentPicker}></FloatingButton>
        {/* <TouchableOpacity
          activeOpacity={0.5}
          // onPress={this.SampleFunction}
          style={styles.TouchableOpacityStyle}>
          <Image
            source={{
              uri: 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png',
            }}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity> */}
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

              {/* <Button title="Back" onPress={onCloseModal}></Button> */}
              {/* <DefaultButton
                onPress={onCloseModal}
                title="취소"
                type="default"></DefaultButton> */}

              {/* <Text style={{fontSize: 24}}>책</Text> */}
            </Flex>
            {/* <Picker selectedValue={pickerValue}>
              <Picker.Item label="라벨" value="1"></Picker.Item>
              <Picker.Item label="라벨" value="2"></Picker.Item>
              <Picker.Item label="라벨" value="3"></Picker.Item>
            </Picker> */}
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
                {/* <Button
                  title="DELETE"
                  color="red"
                  onPress={() => {
                    setVisibleModal(false);
                    deleteSound(currIdx);
                  }}></Button> */}
                <DeleteButton
                  onPress={() => {
                    deleteSound(currIdx);
                  }}></DeleteButton>
              </View>
              {/* <WhiteSpace></WhiteSpace> */}
            </WingBlank>
          </SafeAreaView>
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
