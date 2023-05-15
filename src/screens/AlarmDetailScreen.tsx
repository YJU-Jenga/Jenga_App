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
  createScheduleActionInfo,
  createScheduleRepeatInfo,
  selectAlarmMusicName,
  selectRepeatInfo,
  selectSoundInfo,
} from '../utils/redux/alarmSlice';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deleteMusic,
  getAllMusic,
  selectMusicData,
} from '../utils/redux/musicSlice';
import {selectUserData} from '../utils/redux/userSlice';
import {back_address as SERVER_URL} from '../config/address';
import {width} from '../config/globalStyles';

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
  isRecording?: boolean;
}

export const ActionComponent = () => {
  const [soundList, setSoundList] = React.useState([]);

  const [sound, setSound] = React.useState();
  const [selectedMusic, setSelectedMusic] = useState<string>();

  const dispatch = useDispatch();
  const _ui = useSelector(selectUserData);
  const _musicData = useSelector(selectMusicData);
  const _musicName = useSelector(selectAlarmMusicName);

  const getSoundList = async () => {
    dispatch(getAllMusic(_ui.id));
  };

  const deleteSound = soundId => {
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

  async function playSound(sound) {
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
    sound.unloadAsync();
  };

  const onSelectCurrentMusic = (name, file) => {
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
              const soundPath = SERVER_URL + '/' + item.file;
              onSelectCurrentMusic(item.name, item.file);
              loadSound(soundPath);
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
  ({selectedMusic, onDeselect}): JSX.Element => {
    return (
      // <WingBlank>
      <View>
        <List renderHeader={'선택된 파일'}>
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
        <List renderHeader={'목록'}></List>
      </View>
      // </WingBlank>
    );
  },
);
