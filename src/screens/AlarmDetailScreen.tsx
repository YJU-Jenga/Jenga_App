import {Checkbox, Flex, List, WingBlank} from '@ant-design/react-native';
import React, {useState, useEffect} from 'react';
import {
  Button,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';
import {
  changeMusicFile,
  changeMusicName,
  selectAlarmMusicName,
} from '../utils/redux/alarmSlice';
import {useAppDispatch, useAppSelector} from '../../hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deleteMusic,
  getAllMusic,
  selectMusicData,
} from '../utils/redux/musicSlice';
import {selectUserData} from '../utils/redux/userSlice';
import {back_file_address as SERVER_URL} from '../config/address';
import {width} from '../config/globalStyles';
import {IUser} from '../interfaces/user';

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
  isRecording?: boolean;
}

export const ActionComponent = () => {
  const [soundList, setSoundList] = React.useState([]);

  const [sound, setSound] = React.useState<any>();
  const [selectedMusic, setSelectedMusic] = useState<string>();

  const dispatch = useAppDispatch();
  const _ui = useAppSelector(selectUserData) as IUser;
  const _musicData = useAppSelector(selectMusicData);
  const _musicName = useAppSelector(selectAlarmMusicName);

  const getSoundList = async () => {
    dispatch(getAllMusic(_ui.id));
  };

  const deleteSound = (soundId: any) => {
    // dispatch(changeMusicFile(''));
    // dispatch(changeMusicName(''));
    dispatch(deleteMusic(soundId))
      .unwrap()
      .then(() => {
        dispatch(getAllMusic(_ui.id));
        if (sound) sound?.unloadAsync();
      });
  };

  async function loadSound(soundPath: string) {
    pauseSound();
    console.log('Loading Sound : ', soundPath);
    const {sound} = await Audio.Sound.createAsync({uri: soundPath});
    setSound(sound);
    await playSound(sound);
  }

  async function playSound(sound: Audio.Sound) {
    await sound.playAsync();
  }

  async function pauseSound() {
    sound?.unloadAsync();
  }

  useEffect(() => {
    getSoundList();
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const onDeselectCurrentMusic = () => {
    setSelectedMusic('');
    dispatch(changeMusicFile(''));
    dispatch(changeMusicName(''));
    if (sound) sound.unloadAsync();
  };

  const onSelectCurrentMusic = (
    name: React.SetStateAction<string | undefined>,
    file: any,
  ) => {
    setSelectedMusic(name);
    dispatch(changeMusicFile(file));
    dispatch(changeMusicName(name));
  };

  return (
    <FlatList
      contentContainerStyle={{paddingBottom: '30%'}}
      data={_musicData}
      ListHeaderComponent={() => (
        <SelectedSoundItem
          selectedMusic={_musicName}
          onDeselect={onDeselectCurrentMusic}
        />
      )}
      renderItem={({item, index}) => {
        return (
          <List.Item
            style={{
              width: '100%',
              display: 'flex',
            }}
            onPress={() => {
              //const soundPath = SERVER_URL + '/' + item.file;
              onSelectCurrentMusic(item.name, item.file);
              loadSound(SERVER_URL + item.file);
            }}
            key={item?.name}>
            <Flex style={{marginStart: width * 10}} justify="between">
              <Text style={{fontFamily: 'TheJamsilOTF_Light'}}>
                {item?.name}
              </Text>
              <Icon
                onPress={() => {
                  deleteSound(item.id);
                }}
                name="delete-outline"
                size={25}
                color="#888"
              />
            </Flex>
          </List.Item>
        );
      }}></FlatList>
  );
};

const SelectedSoundItem = React.memo(
  ({
    selectedMusic,
    onDeselect,
  }: {
    selectedMusic: string;
    onDeselect: () => void;
  }): JSX.Element => {
    return (
      // <WingBlank>
      <View>
        <List renderHeader={'選択したサウンド'}>
          <Flex
            justify="between"
            style={{paddingVertical: 15, marginHorizontal: width * 15}}>
            <Flex>
              <Icon name="playlist-music" size={25} color="#aaa" />
              <Text style={{marginStart: 15, fontFamily: 'TheJamsilOTF_Light'}}>
                {selectedMusic}
              </Text>
            </Flex>

            <Icon onPress={onDeselect} name="delete" size={25} color="#aaa" />
          </Flex>
        </List>
        <List renderHeader={'リスト'}></List>
      </View>
      // </WingBlank>
    );
  },
);
