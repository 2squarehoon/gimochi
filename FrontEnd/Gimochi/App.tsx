/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './src/store';
import TabNavigation from './src/navigation/TabNavigation';
import LoginScreen from './src/screen/LoginScreen';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from './src/store';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import userSlice from './src/slices/user';
import { format } from 'date-fns';

const Stack = createNativeStackNavigator();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLogin);
  const date = new Date();
  const now = format(date, 'yyyy-MM-dd HH:mm:ss');
  const loginCheck = async (): Promise<void> => {
    const login = await AsyncStorage.getItem('Login');
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const accessTokenExpiresAt = await EncryptedStorage.getItem('accessTokenExpiresAt');
    if (String(now) > String(accessTokenExpiresAt)) {
      // 토큰 갱신하는 axios요청
    }
    dispatch(
      userSlice.actions.setLogin({
        accessToken: accessToken,
        accessTokenExpiresAt: accessTokenExpiresAt,
        isLogin: login,
      }),
    );
    console.log(login);
  };

  useEffect(() => {
    void loginCheck();
    SplashScreen.hide();
    // console.log(isLoggedIn);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn === 'true' ? (
          <Stack.Screen name='Home' component={TabNavigation} options={{ headerShown: false }}></Stack.Screen>
        ) : (
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
        )}
        {/* <Stack.Screen name='Home' component={TabNavigation} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name='Login' component={LoginScreen} options={{ title: '로그인' }}></Stack.Screen> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;