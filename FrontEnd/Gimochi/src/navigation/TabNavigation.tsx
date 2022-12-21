/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { getFocusedRouteNameFromRoute, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigation from './HomeNavigation';
import MypageNavigation, { MypageStackParamList } from './MypageNavigation';
import GifticonNavigation, { GifticonStackParamList } from './GifticonNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBarcode, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';
import { HomeStackParamList } from './HomeNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';

type TabParamList = {
  Gifticon: NavigatorScreenParams<GifticonStackParamList>;
  Mypage: NavigatorScreenParams<MypageStackParamList>;
  Main: NavigatorScreenParams<HomeStackParamList>;
};

const Tab = createBottomTabNavigator<TabParamList>();
type HomeStackScreenProps = NativeStackScreenProps<HomeStackParamList>;
// type MypageStackScreenProps = NativeStackScreenProps<MypageStackParamList>;

function TabNavigation({ navigation, route }: HomeStackScreenProps) {
  // 화면에 보여주는 화면의 name값 받아오기
  const currentScreenArray = useSelector((state: RootState) => state.screen.screenArray);
  const currentScreen = currentScreenArray[currentScreenArray.length - 1];
  console.log(currentScreen);
  const routeName = getFocusedRouteNameFromRoute(route);
  const homeModal = () => {
    navigation.navigate('HomeModal');
  };
  return (
    <Tab.Navigator
      initialRouteName='Main'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name='Gifticon'
        component={GifticonNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesomeIcon icon={faBarcode} size={30} color={focused ? '#ffa401' : '#686868'} />
            </View>
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name='Main'
        component={HomeNavigation}
        // 현재 위치가 홈화면이면 중앙버튼 클릭했을때 모달뜨게
        listeners={({ navigation }: HomeStackScreenProps) => ({
          tabPress: (e) => {
            if (routeName === 'Main') {
              e.preventDefault();
              navigation.navigate('HomeModal');
            }
          },
        })}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <TouchableOpacity style={{ position: 'absolute', bottom: 1 }} onPress={() => homeModal()}>
                {currentScreen === 'HomeScreen' && (
                  <Image
                    source={require('../assets/images/homeMochi.png')}
                    // source={require('../../android/app/src/main/assets/images/homeMochi.png')}
                    resizeMode='contain'
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {currentScreen === 'AttendanceScreen' && (
                  <Image
                    source={require('../assets/images/attendMochi.png')}
                    // source={require('../../android/app/src/main/assets/images/attendMochi.png')}
                    resizeMode='contain'
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {currentScreen === 'PlayScreen' && (
                  <Image
                    source={require('../assets/images/playMochi.png')}
                    // source={require('../../android/app/src/main/assets/images/playMochi.png')}
                    resizeMode='contain'
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {currentScreen === 'RollingpaperScreen' && (
                  <Image
                    source={require('../assets/images/chukapokaMochi.png')}
                    // source={require('../../android/app/src/main/assets/images/chukapokaMochi.png')}
                    resizeMode='contain'
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {currentScreen === 'ScheduleScreen' && (
                  <Image
                    source={require('../assets/images/scheduleMochi.png')}
                    // source={require('../../android/app/src/main/assets/images/scheduleMochi.png')}
                    resizeMode='contain'
                    style={{ width: 80, height: 80 }}
                  />
                )}
                {currentScreen === 'ChallengeScreen' && (
                  <Image
                    source={require('../assets/images/challengeMochi.png')}
                    // source={require('../../android/app/src/main/assets/images/challengeMochi.png')}
                    resizeMode='contain'
                    style={{ width: 80, height: 80 }}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <View>
                <FontAwesomeIcon icon={faHouse} size={30} color={'#686868'} />
              </View>
            ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name='Mypage'
        component={MypageNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesomeIcon icon={faUser} size={30} color={focused ? '#ffa401' : '#686868'} />
            </View>
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TabNavigation;
