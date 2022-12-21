import React from 'react';
import styled from 'styled-components/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import ScheduleScreen from '../screen/ScheduleScreen';
import RPBirthdayScreen from '../screen/rollingpaper/RPBirthdayScreen';
import RPChristmasScreen from '../screen/rollingpaper/RPChristmasScreen';
import RPGraduateScreen from '../screen/rollingpaper/RPGraduateScreen';
import RPEtcScreen from '../screen/rollingpaper/RPEtcScreen';
import RPMessageWriteScreen from '../screen/mypage/RPMessageWriteScreen';

export type ScheduleStackParamList = {
  ScheduleMainScreen: undefined;
  RPBirthdayScreen2: undefined;
  RPChristmasScreen2: undefined;
  RPGraduateScreen2: undefined;
  RPEtcScreen2: undefined;
  RPMessageWriteScreen1: undefined;
  NotificationScreen2: undefined;
};

const Schedule = createNativeStackNavigator<ScheduleStackParamList>();

function ScheduleNavigation({ navigation }) {
  const notifications = useSelector((state: RootState) => state.notification.notification);
  return (
    <Schedule.Navigator
      initialRouteName='ScheduleMainScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <Schedule.Screen
        name='ScheduleMainScreen'
        component={ScheduleScreen}
        options={{
          title: '일정 관리',
          headerRight: () => (
            <>
              <Icon
                name='bell'
                type='simple-line-icon'
                onPress={() => navigation.navigate('NotificationScreen2')}
                size={30}
              />
              <NotiCountContainer>
                <NotiCountText>{notifications}</NotiCountText>
              </NotiCountContainer>
            </>
          ),
        }}
      ></Schedule.Screen>
      <Schedule.Screen name='RPBirthdayScreen2' component={RPBirthdayScreen}></Schedule.Screen>
      <Schedule.Screen name='RPChristmasScreen2' component={RPChristmasScreen}></Schedule.Screen>
      <Schedule.Screen name='RPGraduateScreen2' component={RPGraduateScreen}></Schedule.Screen>
      <Schedule.Screen name='RPEtcScreen2' component={RPEtcScreen}></Schedule.Screen>
      <Schedule.Screen
        name='RPMessageWriteScreen1'
        component={RPMessageWriteScreen}
        options={{ title: '추카포카 메시지 작성' }}
      ></Schedule.Screen>
    </Schedule.Navigator>
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

export default ScheduleNavigation;
