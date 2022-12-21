/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigation from './src/navigation/TabNavigation';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from './src/store';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import userSlice from './src/slices/user';
import { format } from 'date-fns';
import axios from 'axios';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import LoginNavigation from './src/navigation/LoginNavigation';

const Stack = createNativeStackNavigator();

function AppInner() {
  const dispatch = useAppDispatch();
  const isUserId = useSelector((state: RootState) => !!state.user.userId);
  const date = new Date();
  const [aToken, setAToken] = useState('');
  const loginCheck = async (): Promise<void> => {
    // const login = await AsyncStorage.getItem('login');
    const userId = await AsyncStorage.getItem('userId');
    const userNickname = await AsyncStorage.getItem('userNickname');
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const accessTokenExpiresAt = await EncryptedStorage.getItem('accessTokenExpiresAt');
    // console.log(accessToken);
    // console.log(accessTokenExpiresAt);
    const tokenTime = new Date(accessTokenExpiresAt);
    // EncryptedStorage에 토큰이 있고(로그인된 상태) 토큰만료시간-현재시간이 2시간 이하라면 새 토큰을 발급받음
    if (accessToken && format(tokenTime - date, 'HH') <= 2) {
      axios
        .get(`${Config.API_URL}/kakao/oauth/refreshToken`, {
          headers: {
            token: accessToken,
          },
        })
        .then(async function (response) {
          // console.log(response);
          await EncryptedStorage.setItem('accessToken', response.data.data.accessToken);
          await EncryptedStorage.setItem('accessTokenExpiresAt', response.data.data.expiresIn);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    dispatch(
      userSlice.actions.setLogin({
        accessToken: accessToken,
        accessTokenExpiresAt: accessTokenExpiresAt,
        userId: Number(userId),
        userNickname: userNickname,
      }),
    );
    setAToken(accessToken);
  };

  useEffect(() => {
    void loginCheck();
    setTimeout(function () {
      SplashScreen.hide();
    }, 1000);
  }, [isUserId]);

  // // 푸시알림 토큰 설정
  useEffect(() => {
    async function getToken() {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      const token = await messaging().getToken();
      // 서버에 폰 토큰 보내야
      axios
        .get(`${Config.API_URL}/notification/token`, {
          headers: {
            AccessToken: aToken,
            FirebaseToken: token,
          },
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(`푸시알림토큰 ${token}`);
    }
    if (aToken) {
      getToken();
    }
  }, [dispatch, aToken]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isUserId ? (
          <Stack.Screen
            name='Login'
            component={LoginNavigation}
            options={{ headerShown: false }}
          ></Stack.Screen>
        ) : (
          <Stack.Screen name='Home' component={TabNavigation} options={{ headerShown: false }}></Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppInner;
