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
  createScheduleActionInfo,
  createScheduleRepeatInfo,
  selectRepeatInfo,
  selectSoundInfo,
} from '../utils/redux/scheduleSlice';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
  isRecording?: boolean;
}

export const RepeatComponent = ({index}: {index: any}) => {
  //const [day, setDay] = useState<string>();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const dispatch = useDispatch();
  const _currRepeat = useSelector(selectRepeatInfo);
  const day = _currRepeat[index].day;
  // const _isChecked = _currRepeat[index].isChecked;

  useEffect(() => {
    setIsChecked(_currRepeat[index].isChecked);
  }, []);

  //console.log(data);
  return (
    <List>
      {/* <Text>{_currRepeat}</Text> */}
      {_currRepeat && (
        <List.Item
          thumb={
            <Checkbox
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
                dispatch(createScheduleRepeatInfo({day, isChecked}));
              }}></Checkbox>
          }>
          <Text style={{fontFamily: 'TheJamsilOTF_Light', color: 'black'}}>
            {day}마다 반복
          </Text>
        </List.Item>
      )}
    </List>
  );
};

export const ActionComponent = () => {
  const [soundInfo, setSoundInfo] = React.useState<ISound>();
  const [soundList, setSoundList] = React.useState([]);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [sound, setSound] = React.useState();
  const [isChecked, setIsChecked] = useState<boolean>();
  const [position, setPosition] = React.useState();

  const dispatch = useDispatch();

  const getSoundList = async () => {
    //AsyncStorage.removeItem('sounds');
    const d = await AsyncStorage.getItem('sounds');
    setSoundList(JSON.parse(d));
    //console.log('getSOUND : ', d);
  };

  async function loadSound(soundPath: string) {
    pauseSound();
    console.log('Loading Sound : ', soundPath);
    const {sound} = await Audio.Sound.createAsync({uri: soundPath});
    setSound(sound);
    await playSound(sound);
  }

  async function playSound(sound) {
    //await sound.setPositionAsync(position);
    console.log('Playing Sound');
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function pauseSound() {
    setIsPlaying(false);
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

  return (
    <FlatList
      contentContainerStyle={{paddingBottom: '30%'}}
      data={soundList}
      ListHeaderComponent={SelectedSoundItem()}
      renderItem={({item, index}) => {
        return (
          //<SoundListItem
          // loadSound={loadSound}
          // playSound={playSound}
          // pauseSound={pauseSound}
          //key={index}
          //data={item}
          //onPress={() => {
          //  console.log('안녕');
          //}}></SoundListItem>
          <List.Item
            style={{marginStart: 10, width: '100%'}}
            onPress={() => {
              loadSound(item?.uri);
              dispatch(createScheduleActionInfo(item));
            }}
            // thumb={
            //   <Checkbox
            //     checked={isChecked}
            //     onChange={() => {
            //       setIsChecked(!isChecked);
            //     }}></Checkbox>
            // }
            key={item?.name}>
            <Text style={{fontFamily: 'TheJamsilOTF_Light'}}>{item?.name}</Text>
          </List.Item>
        );
      }}></FlatList>
  );
};

const SelectedSoundItem = (): JSX.Element => {
  const _currSound = useSelector(selectSoundInfo);

  // console.log(selectSoundInfo())

  // console.log(selectSoundInfo(sound));

  return (
    // <WingBlank>
    <View>
      <List renderHeader={'선택된 파일'}>
        <Flex style={{paddingVertical: 15, marginStart: 15}}>
          <Icon name="playlist-music" size={25} color="#aaa" />
          <Text style={{marginStart: 15, fontFamily: 'TheJamsilOTF_Light'}}>
            {_currSound?.name}
          </Text>
        </Flex>
      </List>
      <List renderHeader={'목록'}></List>
    </View>
    // </WingBlank>
  );
};

// export const SoundListItem = ({data}: {data: string[]}): JSX.Element => {

//   async function loadSound(soundPath: string) {
//     console.log('Loading Sound : ', soundPath);
//     const {sound} = await Audio.Sound.createAsync({uri: soundPath});
//     setSound(sound);
//     await playSound(sound);
//   }
//   async function playSound(sound) {
//     //await sound.setPositionAsync(position);
//     console.log('Playing Sound');
//     await sound.playAsync();
//     setIsPlaying(true);
//   }

//   async function pauseSound() {
//     sound.getStatusAsync().then(res => {
//       setPosition(res.positionMillis);
//     });
//     await sound.pauseAsync();
//     sound.setPositionAsync(position);
//     setIsPlaying(false);
//     //clearInterval;
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log('Unloading Sound');
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     data && (
//       <List.Item
//         thumb={
//           <Checkbox
//             checked={isChecked}
//             onChange={() => {
//               setIsChecked(!isChecked);
//             }}></Checkbox>
//         }
//         key={data?.name}>
//         <Pressable
//           onPress={() => {
//             if (sound) {
//               console.log('사운드 객ㅔ 있ㅏ');
//               pauseSound();
//             } else {
//               console.log('없다');
//               setSound(null);
//               loadSound(data?.uri);
//             }
//           }}>
//           <Text>{data?.name}</Text>
//         </Pressable>
//       </List.Item>
//     )
//   );
// };

// const ScheduleDetailScreen = ({route, navigation}) => {
//   return (
//     <Pressable style={{flex: 1, backgroundColor: 'mistyrose'}}>
//       <WingBlank>
//         <Flex justify="between">
//           <Text style={{fontSize: 24, color: '#444'}}>
//             {route?.params?.type}
//           </Text>
//           <Button title="Save" onPress={() => navigation.goBack()}></Button>
//         </Flex>
//         {route?.params?.type === 'repeat' ? (
//           <RepeatComponent></RepeatComponent>
//         ) : (
//           <ActionComponent></ActionComponent>
//         )}
//       </WingBlank>
//     </Pressable>
//   );
// };

//export default ScheduleDetailScreen;
