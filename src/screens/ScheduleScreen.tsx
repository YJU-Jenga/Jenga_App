import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card} from 'react-native-paper';
import React from 'react';
import Title from '../components/Title';

interface itemsArray {
  [index: string]: {day: string; height: number; name: string};
}

const timeToString = (time: string | number | Date) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const HomeScreen = () => {
  const date = new Date();
  console.log(date);
  const [items, setItems] = React.useState<itemsArray>({});

  const loadItems = (day: {timestamp: number}) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(10, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }
      const newItems: {[index: string]: object} = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item: {name: string}) => {
    return (
      <TouchableOpacity style={styles.item}>
        <View>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Title title="Schedule"></Title>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2023-02-07'}
        //refreshControl={null}
        showClosingKnob={false}
        refreshing={false}
        renderItem={renderItem}
        theme={{backgroundColor: 'white', calendarBackground: 'white'}}
      />
      <StatusBar />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default HomeScreen;
