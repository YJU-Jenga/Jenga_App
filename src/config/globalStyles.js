import {Dimensions} from 'react-native';

export const basicDimensions = {
  height: 740,
  width: 360,
};

export const height = // 높이 변환 작업
  +(Dimensions.get('screen').height * (1 / basicDimensions.height)).toFixed(2);

export const width = // 가로 변환 작업
  +(Dimensions.get('screen').width * (1 / basicDimensions.width)).toFixed(2);
