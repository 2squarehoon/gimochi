import React, { useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import HomeScreen from '../screen/HomeScreen';
import AttendanceScreen from '../screen/AttendanceScreen';
import ChallengeScreen from './ChallengeNavigation';
import PlayScreen from '../screen/PlayScreen';
import RPNavigation from './RPNavigation';
import ScheduleNavigation from './ScheduleNavigation';
import HomeModal from '../components/HomeModal';
import NotificationScreen from '../screen/NotificationScreen';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';

export type HomeStackParamList = {
  HomeScreen: undefined;
  AttendanceScreen: undefined;
  ChallengeScreen: undefined;
  PlayScreen: undefined;
  RollingpaperScreen: undefined;
  ScheduleScreen: undefined;
  HomeModal: undefined;
  NotificationScreen1: undefined;
};
export type HomeModalProps = NativeStackScreenProps<HomeStackParamList, 'HomeModal'>;

const Home = createNativeStackNavigator<HomeStackParamList>();
function HomeNavigation({ route, navigation }: HomeModalProps) {
  const notifications = useSelector((state: RootState) => state.notification.notification);
  const routeName = getFocusedRouteNameFromRoute(route);
  useLayoutEffect(() => {
    if (routeName === 'HomeModal') {
      //MyPage이외의 화면에 대해 tabBar none을 설정한다.
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: undefined } });
    }
    // console.log(routeName);
  }, [navigation, route]);

  return (
    <Home.Navigator
      // initialRouteName='HomeScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <Home.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{
          title: '기모치',
          headerRight: () => (
            <>
              <Icon
                name='bell'
                type='simple-line-icon'
                onPress={() => navigation.navigate('NotificationScreen1')}
                size={30}
              />
              <NotiCountContainer>
                <NotiCountText>{notifications}</NotiCountText>
              </NotiCountContainer>
            </>
          ),
        }}
      ></Home.Screen>
      <Home.Screen
        name='AttendanceScreen'
        component={AttendanceScreen}
        options={{
          title: '출석 체크',
          headerRight: () => (
            <>
              <Icon
                name='bell'
                type='simple-line-icon'
                onPress={() => navigation.navigate('NotificationScreen1')}
                size={30}
              />
              <NotiCountContainer>
                <NotiCountText>{notifications}</NotiCountText>
              </NotiCountContainer>
            </>
          ),
        }}
      ></Home.Screen>
      <Home.Screen
        name='ChallengeScreen'
        component={ChallengeScreen}
        options={{ headerShown: false }}
      ></Home.Screen>
      <Home.Screen name='PlayScreen' component={PlayScreen} options={{ title: '놀이터' }}></Home.Screen>
      <Home.Screen
        name='RollingpaperScreen'
        component={RPNavigation}
        options={{ headerShown: false }}
      ></Home.Screen>
      <Home.Screen
        name='ScheduleScreen'
        component={ScheduleNavigation}
        options={{ headerShown: false }}
      ></Home.Screen>
      <Home.Screen
        name='HomeModal'
        component={HomeModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          gestureEnabled: true,
        }}
      ></Home.Screen>
      <Home.Screen
        name='NotificationScreen1'
        component={NotificationScreen}
        options={{ title: '알림' }}
      ></Home.Screen>
    </Home.Navigator>
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

export default HomeNavigation;
