import React from 'react';
import {View, SafeAreaView, Text, Image} from 'react-native';
import Title from '../components/Title';

interface books {
  id: number;
  title: string;
  author: string;
  imgSrc: string;
}

const BookScreen = () => {
  const data: Array<books> = [
    {
      id: 1,
      title: '스웩 넘치는 일상',
      author: '김냥냥',
      imgSrc: './../scpark.jpeg',
    },
    {id: 2, title: '볼살 통통이', author: '하예진', imgSrc: './../scpark.jpeg'},
    {id: 3, title: '뭘봐 돼지야', author: '김돼지', imgSrc: './../scpark.jpeg'},
    {
      id: 4,
      title: '저 안봤는데용',
      author: '하예진',
      imgSrc: './../scpark.jpeg',
    },
  ];
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <Title title="Sounds"></Title>

      <View style={{alignItems: 'center', flex: 2}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 15,
            width: '90%',
            height: '40%',
            backgroundColor: 'gray',
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          }}>
          <Text style={{margin: 25, fontSize: 24, fontWeight: 'bold'}}>
            Sweet Potato
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: 'black',
              // borderRadius: 20,
              alignContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                marginStart: 25,
                paddingBottom: 5,
              }}>
              하바보
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '800',
          marginStart: 20,
          marginBottom: 10,
        }}>
        인기 있는 책
      </Text>

      <View style={{flex: 4}}>
        {data.map(v => {
          return (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginStart: 20,
                marginTop: 7,
              }}
              key={v.id}>
              <Image
                style={{width: 40, height: 40}}
                source={require('./../scpark.jpeg')}
              />
              {/* <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginStart: 20,
                  marginBottom: 10,
                  justifyContent: 'center',
                  width: '20%',
                  height: 32,
                  backgroundColor: 'black',
                  borderRadius: 20,
                }}
              /> */}
              <View style={{flexDirection: 'column', marginStart: 8}}>
                <Text style={{fontSize: 16}}>{v.title}</Text>
                <Text style={{fontSize: 12}}>{v.author}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default BookScreen;
