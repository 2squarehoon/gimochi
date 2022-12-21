/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import KakaoLogo from 'react-native-kakao-logo';

function LoginScreen({ navigation }) {
  const goWebView = () => {
    navigation.navigate('LoginWebViewScreen');
  };

  return (
    <LoginScreenContainer>
      <Image
        source={require('../../assets/images/login.png')}
        // source={require('../../../android/app/src/main/assets/images/login.png')}
        style={{ width: '70%', height: '70%' }}
      />
      <LoginButtonContainer onPress={goWebView}>
        <KakaoLogo color={'black'} />
        <LoginButtonText>카카오로 로그인</LoginButtonText>
      </LoginButtonContainer>
    </LoginScreenContainer>
  );
}

const LoginScreenContainer = styled.View`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
`;

const LoginButtonContainer = styled.TouchableOpacity`
  background-color: #fee500;
  border-radius: 18px;
  width: 60%;
  padding: 15px;
  margin: 10px 0px;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
  flex-direction: row;
`;

const LoginButtonText = styled.Text`
  color: #000000;
  font-family: 'Regular';
  font-size: 20px;
  margin-left: 10%;
`;

export default LoginScreen;
