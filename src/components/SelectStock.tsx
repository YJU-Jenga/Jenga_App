import React from 'react';
import {
  Button,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Constants from 'expo-constants';

const SelectStock = ({props}) => {
  const [currentValue, setCurrentValue] = React.useState(0);
  const [stockList, setStockList] = React.useState([]);
  const refValue = React.useRef(null);

  const setValue = (props: number) => {
    let list: any = [];
    for (let i = 1; i <= props; i++) {
      list.push(i);
    }
    list.unshift(' ');
    list[list.length] = ' ';
    setStockList(list);
    return list;
  };

  const handleStockOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextCurrent: number = Math.round(e.nativeEvent.contentOffset.y / 50);
    if (nextCurrent < 0) return;
    setCurrentValue(nextCurrent);
    refValue.current.scrollTo({y: nextCurrent * 50, animated: true});
  };

  React.useState(() => {
    setStockList(setValue(props));
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
      }}>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          height: 150,
          borderWidth: 1,
          borderColor: 'yellow',
        }}>
        <ScrollView
          style={{borderWidth: 1, borderColor: 'green', width: 60}}
          ref={refValue}
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={handleStockOnScroll}
          scrollEventThrottle={0}
          decelerationRate={'fast'}>
          {props &&
            stockList.map(item => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    console.log(item);
                  }}>
                  <View
                    style={{
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'pink',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>{item}</Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};

export default SelectStock;
