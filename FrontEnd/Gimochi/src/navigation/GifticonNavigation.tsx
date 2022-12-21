/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import styled from 'styled-components/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GifticonMainScreen from '../screen/gifticon/GifticonMainScreen';
import GifticonUploadScreen from '../screen/gifticon/GifticonUploadScreen';
import GifticonBarcodeScreen from '../screen/gifticon/GifticonBarcodeScreen';
import NotificationScreen from '../screen/NotificationScreen';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';

export type GifticonStackParamList = {
  GifticonMainScreen: undefined;
  GifticonUploadScreen: undefined;
  GifticonBarcodeScreen: undefined;
  NotificationScreen2: undefined;
};

const Gifticon = createNativeStackNavigator<GifticonStackParamList>();

function GifticonNavigation({ navigation }) {
  const notifications = useSelector((state: RootState) => state.notification.notification);
  return (
    <Gifticon.Navigator
      initialRouteName='GifticonMainScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <Gifticon.Screen
        name='GifticonMainScreen'
        component={GifticonMainScreen}
        options={{
          title: '티콘모아',
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
      ></Gifticon.Screen>
      <Gifticon.Screen
        name='GifticonUploadScreen'
        component={GifticonUploadScreen}
        options={{ title: '기프티콘 등록' }}
      ></Gifticon.Screen>
      <Gifticon.Screen
        name='GifticonBarcodeScreen'
        component={GifticonBarcodeScreen}
        options={{ presentation: 'transparentModal', headerShown: false, gestureEnabled: true }}
      ></Gifticon.Screen>
      <Gifticon.Screen
        name='NotificationScreen2'
        component={NotificationScreen}
        options={{ title: '알림' }}
      ></Gifticon.Screen>
    </Gifticon.Navigator>
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

export default GifticonNavigation;
