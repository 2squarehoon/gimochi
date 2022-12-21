/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import React from 'react';
import { View, LogBox, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store';
import userSlice from '../../slices/user';
import Config from 'react-native-config';

LogBox.ignoreLogs(['Remote debugger']);

const runFirst = 'window.ReactNativeWebView.postMessage("this is message from web");';

function FriendWebViewScreen() {
  const dispatch = useAppDispatch();
  const parseAuthCode = async (url: string) => {
    const exp = 'code='; //url에 붙어 날라오는 인가코드는 code=뒤부터 parse하여 get
    const startIndex = url.indexOf(exp); //url에서 "code="으로 시작하는 index를 찾지 못하면 -1반환
    if (startIndex !== -1) {
      const authCode = url.substring(startIndex + exp.length);
      console.log('access code :: ' + authCode);

      await axios
        .get(`${Config.API_URL}/kakao/oauth/token`, {
          headers: {
            code: authCode,
          },
        })
        .then(function (response) {
          console.log(response);
          after(
            response.data.data.userSocialToken,
            response.data.data.userNickname,
            response.data.data.expiresIn,
            String(response.data.data.userId),
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const after = async (aToken: string, nickname: string, time: string, id: string) => {
    await AsyncStorage.setItem('userId', id);
    await AsyncStorage.setItem('userNickname', nickname);
    await EncryptedStorage.setItem('accessTokenExpiresAt', time);
    await EncryptedStorage.setItem('accessToken', aToken);
    dispatch(
      userSlice.actions.setLogin({
        accessToken: aToken,
        accessTokenExpiresAt: time,
        userId: id,
        userNickname: nickname,
      }),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <WebView
        originWhitelist={['*']}
        scalesPageToFit={false}
        style={{ marginTop: 30 }}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?client_id=${Config.KAKAO_REST_API_KEY}&redirect_uri=${Config.API_URL}/kakao/oauth&response_type=code&scope=friends`,
        }}
        injectedJavaScript={runFirst}
        javaScriptEnabled={true}
        onMessage={(event) => {
          parseAuthCode(event.nativeEvent['url']);
        }}

        // onMessage ... :: webview에서 온 데이터를 event handler로 잡아서 logInProgress로 전달
      />
    </View>
  );
}

export default FriendWebViewScreen;
