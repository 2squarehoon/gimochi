import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/login/LoginScreen';
import LoginWebViewScreen from '../screen/login/LoginWebViewScreen';
import FriendWebViewScreen from '../screen/login/FriendWebViewScreen';

export type LoginStackParamList = {
  LoginScreen: undefined;
  LoginWebViewScreen: undefined;
  FriendWebViewScreen: undefined;
};

const Login = createNativeStackNavigator<LoginStackParamList>();

function LoginNavigation() {
  return (
    <Login.Navigator
      initialRouteName='LoginScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <Login.Screen
        name='LoginScreen'
        component={LoginScreen}
        options={{ headerShown: false }}
      ></Login.Screen>
      <Login.Screen
        name='LoginWebViewScreen'
        component={LoginWebViewScreen}
        options={{ title: '카카오로 시작하기' }}
      ></Login.Screen>
      <Login.Screen
        name='FriendWebViewScreen'
        component={FriendWebViewScreen}
        options={{ title: '친구목록 허용' }}
      ></Login.Screen>
    </Login.Navigator>
  );
}

export default LoginNavigation;
