import React, {Dispatch} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Button,
  Image,
  Platform,
  FlatList,
  Alert,
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

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
}

const ListenScreen = () => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [soundInfo, setSoundInfo] = React.useState<ISound>();
  const [soundList, setSoundList] = React.useState([]);
  const [isPlaySound, setIsPlaySound] = React.useState<boolean>(false);
  const [sound, setSound] = React.useState();
  const [currIdx, setCurrIdx] = React.useState<number>();

  async function playSound() {
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync({uri: soundInfo.uri});
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
    setIsPlaySound(!playSound);
  }

  async function stopSound() {
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync({uri: soundInfo.uri});
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    console.log(soundInfo);
    if (visibleModal === true) {
      console.log('응애이');
      playSound();
    }
  }, [soundInfo]);

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

  const getSounds = async () => {
    //AsyncStorage.removeItem('sounds');
    const d = await AsyncStorage.getItem('sounds');
    setSoundList(JSON.parse(d));
    console.log('getSOUND : ', d);
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
                data={soundList}
                renderItem={({item, index}) => {
                  return (
                    <List.Item
                      onPress={() => {
                        setVisibleModal(true);
                        setSoundInfo(item);
                        setCurrIdx(index);
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
          onClose={() => setVisibleModal(false)}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <WhiteSpace size="lg" />
            <Flex>
              <WingBlank size="md"></WingBlank>
              <Button
                title="Back"
                onPress={() => {
                  setVisibleModal(false);
                  sound.unloadAsync();
                }}></Button>
              {/* <Text style={{fontSize: 24}}>책</Text> */}
            </Flex>
            <WingBlank size="lg">
              <Flex justify="center">
                {!isPlaySound ? (
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
                    onPress={stopSound}
                  />
                )}
              </Flex>

              {/* <Button title="Play Sound" /> */}
              <List>
                <List.Item arrow="horizontal">반복</List.Item>
                <List.Item arrow="horizontal">액션</List.Item>
                <List.Item>명령어</List.Item>
              </List>
              <WhiteSpace size="xl" />
              <Button
                title="DELETE"
                color="red"
                onPress={() => {
                  setVisibleModal(false);
                  deleteSound(currIdx);
                }}></Button>
              <WhiteSpace></WhiteSpace>
            </WingBlank>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};

export default ListenScreen;
