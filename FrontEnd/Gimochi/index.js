/**
 * @format
 */

import { AppRegistry, Text, TextInput, TouchableOpacity } from 'react-native';
import { Input } from '@rneui/themed';
import App from './App';
import { name as appName } from './app.json';

// 안드로이드에서 텍스트 크기를 크게 설정해준 경우 너무 크게 나오는 문제가 있어서 수정.
// 참고) https://stackoverflow.com/questions/41807843/how-to-disable-font-scaling-in-react-native-for-ios-app/51414341#51414341
// 기본 폰트 Regular 설정   !!but  각 컴포넌트에서 style 변경하면 적용안됨
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.fontFamily = 'Regular';
Text.defaultProps.style = { fontFamily: 'Regular' };

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.fontFamily = 'Regular';
TextInput.defaultProps.style = { fontFamily: 'Regular' };

Input.defaultProps = Input.defaultProps || {};
Input.defaultProps.autoCorrect = false;
Input.defaultProps.allowFontScaling = false;
Input.defaultProps.fontFamily = 'Regular';
Input.defaultProps.style = { fontFamily: 'Regular' };

AppRegistry.registerComponent(appName, () => App);
