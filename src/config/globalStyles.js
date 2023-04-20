import {Dimensions} from 'react-native';

export const basicDimensions = {
  height: 740,
  width: 360,
};

export const colors = {
  babyPink: '#ffe7e6',
  iconPink: '#ff6e6e',
  primary: '#EC8B57',
  black: '#191919',
  red: '#ef5350',
  lightBlue: '#36D2FF',
  green: '#8FEF73',
  grey: '#767676',
  borderGrey: '#C9C9C9',
  statusGrey: '#666666',
  textGrey: '#A2A2A2',
  darkBlue: '#83abeb',
};

export const height = // 높이 변환 작업
  +(Dimensions.get('screen').height * (1 / basicDimensions.height)).toFixed(2);

export const width = // 가로 변환 작업
  +(Dimensions.get('screen').width * (1 / basicDimensions.width)).toFixed(2);
