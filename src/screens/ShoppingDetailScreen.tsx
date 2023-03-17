// import React from 'react';
// import {View, Text, SafeAreaView, FlatList, Image} from 'react-native';
// import Title from '../components/Title';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//   WhiteSpace,
//   WingBlank,
//   Card,
//   Flex,
//   PickerView,
//   Modal,
//   Provider,
//   Button,
// } from '@ant-design/react-native';
// import {useFocusEffect} from '@react-navigation/native';
// import {getUser, selectMsg, selectUserData} from '../utils/redux/userSlice';
// import {useDispatch, useSelector} from 'react-redux';
// import axios from 'axios';
// import {addProduct} from '../utils/redux/cartSlice';

// const ShoppingDetailScreen = ({route, navigation}) => {
//   const [product, setProduct] = React.useState();
//   const [stockList, setStockList] = React.useState();
//   const [currStock, setCurrStock] = React.useState();
//   const [productInfo, setProductInfo] = React.useState({});
//   const ref = React.useRef();

//   const [visibleModal, setVisibleModal] = React.useState(false);

//   const dispatch = useDispatch();

//   let list: any = [];
//   const setValue = (props: number) => {
//     for (let i = 1; i <= props; i++) {
//       list.push({label: i, value: i});
//     }
//     let wrapper = [list];
//     return wrapper;
//   };

//   React.useEffect(() => {
//     // setProduct(route.params);
//     setStockList(setValue(route.params.stock));
//   }, []);

//   const addToCart = React.useCallback(() => {
//     dispatch(
//       addProduct({
//         productId: route.params.id,
//         count: currStock[0],
//       }),
//     );
//   }, [currStock]);

//   React.useEffect(() => {
//     console.log(currStock);
//   }, [currStock]);

//   return (
//     <Provider>
//       <SafeAreaView
//         style={{
//           flex: 1,
//           paddingTop: 12,
//           paddingHorizontal: 10,
//           backgroundColor: 'white',
//         }}>
//         <WingBlank size="lg">
//           <Flex direction="column">
//             <Image
//               source={{uri: route.params.image}}
//               style={{width: '100%', height: 150}}></Image>
//             <View style={{width: '100%'}}>
//               <Text style={{fontSize: 18}}>{route.params.name}</Text>
//               <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}>
//                 {route.params.price}
//               </Text>
//               <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}>
//                 {route.params.description}
//               </Text>

//               <Button onPress={() => setVisibleModal(true)}>
//                 장바구니에 담기
//               </Button>

//               <Modal
//                 popup
//                 transparent={true}
//                 animationType="slide"
//                 visible={visibleModal}
//                 maskClosable
//                 onClose={() => setVisibleModal(false)}>
//                 <SafeAreaView>
//                   <WhiteSpace></WhiteSpace>
//                   <WingBlank>
//                     <Text style={{fontSize: 18, fontWeight: '600'}}>
//                       장바구니에 담기
//                     </Text>

//                     {stockList && (
//                       <PickerView
//                         onChange={e => {
//                           setCurrStock(e);
//                           console.log(e);
//                         }}
//                         value={currStock}
//                         data={stockList}
//                         cascade={false}
//                       />
//                     )}
//                     <Flex
//                       direction="row"
//                       justify="between"
//                       style={{gap: 10, marginTop: 10}}>
//                       <Button
//                         style={{flex: 1}}
//                         type="warning"
//                         onPress={() => setVisibleModal(false)}>
//                         취소
//                       </Button>
//                       <Button
//                         style={{flex: 1}}
//                         type="primary"
//                         onPress={() => {
//                           setVisibleModal(false);
//                           addToCart();
//                         }}>
//                         담기
//                       </Button>
//                     </Flex>
//                   </WingBlank>
//                 </SafeAreaView>
//               </Modal>
//             </View>
//           </Flex>
//         </WingBlank>
//       </SafeAreaView>
//     </Provider>
//   );
// };

// export default ShoppingDetailScreen;

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {Audio} from 'expo-av';
import Slider from '@react-native-community/slider';

function useInterval(callback, delay) {
  const savedCallback = React.useRef(); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.

  useEffect(() => {
    savedCallback.current = callback; // callback이 바뀔 때마다 ref를 업데이트 해준다.
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
    }
    if (delay !== null) {
      // 만약 delay가 null이 아니라면
      let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
      return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
    }
  }, [delay]); // delay가 바뀔 때마다 새로 실행된다.
}

export default function ShoppingDetailScreen() {
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [displayPosition, setDisplayPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [percent, setPercent] = useState(0);

  useInterval(
    () => {
      //onSliderValueChange(position);
      sound.getStatusAsync().then(res => {
        setDisplayPosition(res.positionMillis);

        if (res.positionMillis == res.durationMillis) {
          setIsPlaying(false);
          console.log('object');
        }
      });
    },
    isPlaying ? 1000 : null,
  );

  useEffect(() => {
    async function loadSound() {
      const {sound} = await Audio.Sound.createAsync({
        uri: 'file:///Users/aedin/Library/Developer/CoreSimulator/Devices/B1ED6C42-7B2E-49CD-A57B-E88CD794E68D/data/Containers/Data/Application/D5A15A74-F871-4016-84E5-B8C41663F6F6/Library/Caches/DocumentPicker/4C95CFD9-F56F-4F09-9AA1-67575F4978E6.mp3',
      });
      setSound(sound);

      sound.getStatusAsync().then(res => {
        console.log(res);
        // setDuration(Math.floor(res.durationMillis / 1000));
        setDuration(Math.floor(res.durationMillis));
        // setPercent(res.durationMillis / 1000 / 100);
      });
    }
    loadSound();
  }, []);

  async function playSound() {
    await sound.setPositionAsync(position);
    await sound.playAsync();
    setIsPlaying(true);

    // onSliderValueChange(0.1);
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

  async function slidSound() {}

  async function onSliderValueChange(value) {
    //console.log(value);
    // await sound.getStatusAsync().then(res => {
    //   console.log(res);
    //   setPosition(res.positionMillis);
    //   setDisplayPosition(res.positionMillis);
    //   //sound.setPositionAsync(res.positionMillis);
    //   console.log('포지션 듀레이션 : ', res.positionMillis, duration);
    // });
    // setPercent();
    //setPosition(value + percent);
    //setDisplayPosition(value + percent);
    // if (position >= duration) {
    //   setIsPlaying(false);
    // }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>음악 재생기</Text>
      <View style={styles.sliderContainer}>
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
        <View>
          <Text>{formatTime(Math.floor(displayPosition / 1000))}</Text>
          <Text>{formatTime(Math.floor(duration / 1000))}</Text>
        </View>
      </View>
      <View>
        {isPlaying ? (
          <Button title="일시정지" onPress={pauseSound} />
        ) : (
          <Button title="재생" onPress={playSound} />
        )}
      </View>
    </View>
  );
}

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
    width: '80%',
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
