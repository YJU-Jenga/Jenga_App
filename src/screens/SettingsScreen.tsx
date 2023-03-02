import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Title from '../components/Title';
import {List, WingBlank} from '@ant-design/react-native';
const Item = List.Item;
const Brief = Item.Brief;
function SettingsScreen({navigation}) {
  const [activeSections, setActiveSections] = React.useState([2, 0]);
  const onChange = () => {
    setActiveSections(activeSections);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingVertical: 40,
        backgroundColor: 'white',
        paddingHorizontal: 20,
      }}>
      <Title title="Settings"></Title>
      <List renderHeader={'Me'}>
        <Item
          thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
          arrow="horizontal">
          thumb
        </Item>
      </List>
      <List renderHeader={'Doll'}>
        <Item
          thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
          arrow="horizontal">
          thumb
        </Item>
      </List>
      <List renderHeader={'Setting'}>
        <Item>재녹음</Item>
      </List>
    </SafeAreaView>
  );
}

export default SettingsScreen;
