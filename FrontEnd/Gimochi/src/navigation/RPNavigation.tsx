/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import RPMainScreen from '../screen/rollingpaper/RPMainScreen';
import RPBirthdayScreen from '../screen/rollingpaper/RPBirthdayScreen';
import RPChristmasScreen from '../screen/rollingpaper/RPChristmasScreen';
import RPGraduateScreen from '../screen/rollingpaper/RPGraduateScreen';
import RPEtcScreen from '../screen/rollingpaper/RPEtcScreen';
import RPWriteScreen from '../screen/rollingpaper/RPWriteScreen';

export type RPStackParamList = {
  RPMainScreen: undefined;
  RPWriteScreen: undefined;
  RPBirthdayScreen: undefined;
  RPChristmasScreen: undefined;
  RPGraduateScreen: undefined;
  RPEtcScreen: undefined;
  RPId: number;
};

export type RPNavigationProps = NativeStackScreenProps<RPStackParamList>;
const RP = createNativeStackNavigator<RPStackParamList>();
function RPNavigation() {
  return (
    <RP.Navigator
      initialRouteName='RPMainScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <RP.Screen name='RPMainScreen' component={RPMainScreen} options={{ title: '추카포카' }}></RP.Screen>
      <RP.Screen
        name='RPBirthdayScreen'
        component={RPBirthdayScreen}
        options={{ title: '생일 추카포카' }}
      ></RP.Screen>
      <RP.Screen
        name='RPChristmasScreen'
        component={RPChristmasScreen}
        options={{ title: '크리스마스 추카포카' }}
      ></RP.Screen>
      <RP.Screen
        name='RPGraduateScreen'
        component={RPGraduateScreen}
        options={{ title: '졸업 추카포카' }}
      ></RP.Screen>
      <RP.Screen name='RPEtcScreen' component={RPEtcScreen}></RP.Screen>
      <RP.Screen
        name='RPWriteScreen'
        component={RPWriteScreen}
        options={{ title: '추카포카 작성' }}
      ></RP.Screen>
    </RP.Navigator>
  );
}

export default RPNavigation;
