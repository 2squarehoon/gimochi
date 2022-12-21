/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import styled from 'styled-components/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MypageScreen from '../screen/mypage/MypageScreen';
import FriendRecomScreen from '../screen/mypage/FriendRecomScreen';
import MyPointScreen from '../screen/mypage/MyPointScreen';
import NotificationScreen from '../screen/NotificationScreen';
import FriendRPScreen from '../screen/mypage/FriendRPScreen';
import RPBirthdayScreen from '../screen/rollingpaper/RPBirthdayScreen';
import RPChristmasScreen from '../screen/rollingpaper/RPChristmasScreen';
import RPGraduateScreen from '../screen/rollingpaper/RPGraduateScreen';
import RPEtcScreen from '../screen/rollingpaper/RPEtcScreen';
import RPMessageWriteScreen from '../screen/mypage/RPMessageWriteScreen';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';

export type MypageStackParamList = {
  MypageScreen: undefined;
  FriendRecomScreen: undefined;
  MyPointScreen: undefined;
  NotificationScreen: undefined;
  FriendRPScreen: undefined;
  RPBirthdayScreen1: undefined;
  RPChristmasScreen1: undefined;
  RPGraduateScreen1: undefined;
  RPEtcScreen1: undefined;
  RPMessageWriteScreen: undefined;
};

const Mypage = createNativeStackNavigator<MypageStackParamList>();

function MypageNavigation({ navigation }) {
  const notifications = useSelector((state: RootState) => state.notification.notification);
  return (
    <Mypage.Navigator
      initialRouteName='MypageScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <Mypage.Screen
        name='MypageScreen'
        component={MypageScreen}
        options={{
          title: '마이페이지',
          headerRight: () => (
            <>
              <Icon
                name='bell'
                type='simple-line-icon'
                onPress={() => navigation.navigate('NotificationScreen')}
                size={30}
              />
              <NotiCountContainer>
                <NotiCountText>{notifications}</NotiCountText>
              </NotiCountContainer>
            </>
          ),
        }}
      ></Mypage.Screen>
      <Mypage.Screen
        name='FriendRecomScreen'
        component={FriendRecomScreen}
        options={{ title: '알 수도 있는 친구들' }}
      ></Mypage.Screen>
      <Mypage.Screen
        name='MyPointScreen'
        component={MyPointScreen}
        options={{ title: '내 포인트 내역' }}
      ></Mypage.Screen>
      <Mypage.Screen
        name='NotificationScreen'
        component={NotificationScreen}
        options={{ title: '알림' }}
      ></Mypage.Screen>
      <Mypage.Screen name='FriendRPScreen' component={FriendRPScreen}></Mypage.Screen>
      <Mypage.Screen name='RPBirthdayScreen1' component={RPBirthdayScreen}></Mypage.Screen>
      <Mypage.Screen name='RPChristmasScreen1' component={RPChristmasScreen}></Mypage.Screen>
      <Mypage.Screen name='RPGraduateScreen1' component={RPGraduateScreen}></Mypage.Screen>
      <Mypage.Screen name='RPEtcScreen1' component={RPEtcScreen}></Mypage.Screen>
      <Mypage.Screen
        name='RPMessageWriteScreen'
        component={RPMessageWriteScreen}
        options={{ title: '추카포카 메시지 작성' }}
      ></Mypage.Screen>
    </Mypage.Navigator>
  );
}

const NotiCountContainer = styled.View`
  position: absolute;
  width: 65%;
  height: 65%;
  right: 1%;
  bottom: 65%;
  background-color: #ffa401;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const NotiCountText = styled.Text`
  font-family: 'Regular';
  font-size: 15px;
  color: #ffffff;
`;

export default MypageNavigation;
