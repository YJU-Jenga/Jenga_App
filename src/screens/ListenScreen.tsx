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
} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import {Audio} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';

import {useAppSelector, useAppDispatch} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useInterval} from '../utils/useInterval';

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
}

const ListenScreen = () => {
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

  const updateSearch = search => {
    setSearch(search);
    const filtered = soundList.filter(itemList => {
      return itemList.name.toUpperCase().includes(search.toUpperCase());
    });
    setSearchList(filtered);
    setTotalPage(Math.ceil(filtered.length / 10));
    setListPerPage(filtered.slice(0, 10));
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
      loadSound();
    }
  }, [soundInfo]);

  async function loadSound() {
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync({uri: soundInfo.uri});
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

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({type: 'audio/*'});

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
            },
          ]),
        );
      }
      getSounds();
    }
  };

  const onCloseModal = () => {
    setVisibleModal(false);
    setIsPlaying(false);
    console.log('object');
    setPosition(0);
    sound.setPositionAsync(0);
    sound.pauseAsync();
  };

  const getSounds = async () => {
    //AsyncStorage.removeItem('sounds');
    const d = await AsyncStorage.getItem('sounds');
    setSoundList(JSON.parse(d));
    //console.log('getSOUND : ', d);
  };

  React.useEffect(() => {
    getSounds();
  }, []);

  const deleteSound = index => {
    Alert.alert('삭제', '파일을 삭제하시겠습니까?', [
      {text: 'Cancel'},
      {
        text: "I'm Sure",
        onPress: async () => {
          const newSoundList = [...soundList];
          newSoundList.splice(index, 1);
          setSoundList(newSoundList);
          await AsyncStorage.setItem('sounds', JSON.stringify(newSoundList));
          getSounds();
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

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}>
        <Title title="Sounds"></Title>
        <SearchBar
          placeholder="오디오의 제목을 입력하세요"
          onChange={updateSearch}
          value={search}
          onSubmit={v => {
            console.log(v);
          }}
          onClear={v => {}}
        />

        <WingBlank>
          <Button title="+" onPress={pickDocument} />
          {soundList ? (
            <List>
              <FlatList
                data={searchList}
                renderItem={({item, index}) => (
                  <List.Item
                    onPress={() => {
                      setVisibleModal(true);
                      setSoundInfo(item);
                      setCurrIdx(index);

                      //loadSound();
                    }}
                    thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
                    extra={
                      <View
                        style={{
                          borderRadius: 30,
                          backgroundColor: 'gray',
                          width: 10,
                          height: 10,
                        }}></View>
                    }>
                    {item.name}
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
              <FlatList
                data={soundList}
                renderItem={({item, index}) => {
                  return (
                    <List.Item
                      onPress={() => {
                        setVisibleModal(true);
                        setSoundInfo(item);
                        setCurrIdx(index);

                        //loadSound();
                      }}
                      thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
                      extra={
                        <View
                          style={{
                            borderRadius: 30,
                            backgroundColor: 'lightpink',
                            width: 10,
                            height: 10,
                          }}></View>
                      }>
                      {item.name}
                    </List.Item>
                  );
                }}></FlatList>
            </List>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 50,
                fontSize: 21,
                color: '#999',
              }}>
              음악, 동화를 업로드해주세요
            </Text>
          )}
        </WingBlank>

        <Modal
          transparent={false}
          visible={visibleModal}
          animationType="slide-up"
          onClose={onCloseModal}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <WhiteSpace size="lg" />
            <Flex>
              <WingBlank size="md"></WingBlank>
              <Button title="Back" onPress={onCloseModal}></Button>
              {/* <Text style={{fontSize: 24}}>책</Text> */}
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
                  style={{textAlign: 'center', fontSize: 32, marginBottom: 32}}>
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
                  </View>
                  <Text>{formatTime(Math.floor(duration / 1000))}</Text>
                </Flex>

                {/* <Button title="Play Sound" /> */}

                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
                <Button
                  title="DELETE"
                  color="red"
                  onPress={() => {
                    setVisibleModal(false);
                    deleteSound(currIdx);
                  }}></Button>
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
});
