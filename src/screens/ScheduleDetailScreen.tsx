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

interface ISound {
  mimeType: string;
  name: string;
  uri: string;
  isRecording?: boolean;
}

export const RepeatComponent = ({data}: {data: any}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <List>
      {data && (
        <List.Item
          thumb={
            <Checkbox
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
              }}></Checkbox>
          }>
          <Text>{data}마다 반복</Text>
        </List.Item>
      )}
    </List>
  );
};

export const ActionComponent = () => {
  const [soundInfo, setSoundInfo] = React.useState<ISound>();
  const [soundList, setSoundList] = React.useState([]);

  const [isPlaying, setIsPlaying] = React.useState(false);

  const getSoundList = async () => {
    //AsyncStorage.removeItem('sounds');
    const d = await AsyncStorage.getItem('sounds');
    setSoundList(JSON.parse(d));
    //console.log('getSOUND : ', d);
  };

  useEffect(() => {
    getSoundList();
  }, []);

  return (
    <FlatList
      data={soundList}
      renderItem={({item}) => {
        return <SoundListItem data={item}></SoundListItem>;
      }}></FlatList>
  );
};

export const SoundListItem = ({data}: {data: string[]}) => {
  const [sound, setSound] = React.useState();
  const [isPlaying, setIsPlaying] = useState();
  const [position, setPosition] = React.useState();

  async function loadSound(soundPath: string) {
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

  return (
    //  {soundList &&
    //     <List>
    //       <List.Item onPress={loadSound(v.uri)}>
    //         {soundList}
    //       </List.Item>
    //     </List>
    //  }

    data && (
      <List.Item>
        <Pressable onPress={() => loadSound(data?.uri)}>
          <Text>{data?.name}</Text>
        </Pressable>
      </List.Item>
    )
  );
};

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
