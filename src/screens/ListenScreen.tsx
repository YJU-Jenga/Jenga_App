import React, {Dispatch} from 'react';
import {View, SafeAreaView, Text, Button, Image, Platform} from 'react-native';
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
import Icon from 'react-native-vector-icons/Entypo';
import * as DocumentPicker from 'expo-document-picker';
import {Audio} from 'expo-av';

import {useAppSelector, useAppDispatch} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListenScreen = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [sound, setSound] = React.useState();

  async function playSound() {
    const sound = new Audio.Sound();

    // console.log('Loading Sound: ', sound);
    await sound.loadAsync({
      //require('./assets/Hello.mp3'),
      uri: 'file:///Users/aedin/Library/Developer/CoreSimulator/Devices/B1ED6C42-7B2E-49CD-A57B-E88CD794E68D/data/Containers/Data/Application/9BC0EC54-603E-4D79-917C-3AC9891A2608/Library/Caches/DocumentPicker/ADEF9697-5873-4B8D-86AC-877C9DF818B7.mp3',
    });
    //setSound(s);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          //sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({type: 'audio/*'});
    console.log(result.uri);
    setSound(result.uri);

    const obj = {
      mimeType: 'audio/wav',
      name: 'sweetvoice.mp3',
      size: 75308,
      uri: 'file://~~~',
    };
    // file:///Users/aedin/Library/Developer/CoreSimulator/Devices/B1ED6C42-7B2E-49CD-A57B-E88CD794E68D/data/Containers/Data/Application/9BC0EC54-603E-4D79-917C-3AC9891A2608/Library/Caches/DocumentPicker/ADEF9697-5873-4B8D-86AC-877C9DF818B7.mp3
    // {"mimeType": "audio/mpeg", "name": "sweetvoice.mp3", "size": 75308, "type": "success", "uri": "file:///Users/aedin/Library/Developer/CoreSimulator/Devices/B1ED6C42-7B2E-49CD-A57B-E88CD794E68D/data/Containers/Data/Application/9BC0EC54-603E-4D79-917C-3AC9891A2608/Library/Caches/DocumentPicker/ADEF9697-5873-4B8D-86AC-877C9DF818B7.mp3"}
    //console.log(result);
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

          <List>
            <List.Item
              onPress={() => setVisibleModal(true)}
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
              샘플책1
            </List.Item>
            <List.Item
              thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
              extra={
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'lightblue',
                    width: 10,
                    height: 10,
                  }}></View>
              }>
              샘플영상2
            </List.Item>
            <List.Item
              thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
              extra={
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'lightsalmon',
                    width: 10,
                    height: 10,
                  }}></View>
              }>
              샘플책3
            </List.Item>
          </List>
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
            <Flex justify="around">
              <Button
                title="Back"
                onPress={() => setVisibleModal(false)}></Button>
              <Text style={{fontSize: 24}}>예약 편집</Text>
              <Button
                title="Save"
                onPress={() => setVisibleModal(false)}></Button>
            </Flex>
            {/* <Button
                type="primary"
                onPress={() => Toast.info('Hello Toast in Modal now works')}>
                Hello Toast in Modal now works
              </Button> */}
            <WingBlank size="lg">
              <Button title="Play Sound" onPress={playSound} />
              <List>
                <List.Item arrow="horizontal">반복</List.Item>
                <List.Item arrow="horizontal">액션</List.Item>
                <List.Item>명령어</List.Item>
              </List>
              <WhiteSpace size="xl" />
              <Button
                title="DELETE"
                color="red"
                onPress={() => setVisibleModal(false)}></Button>
              <WhiteSpace></WhiteSpace>
            </WingBlank>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};

export default ListenScreen;
