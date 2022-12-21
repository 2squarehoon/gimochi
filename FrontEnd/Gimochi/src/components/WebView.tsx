import React from 'react';
import { WebView } from 'react-native-webview';

const WebviewContainer = ({ handleSetRef, handleEndLoading }) => {
  const uri =
    'https://kauth.kakao.com/oauth/authorize?client_id=0e3c9cecfd800e2aae8228d69a635959&redirect_uri=https://k7a205.p.ssafy.io/kakao/oauth&response_type=code&scope=friends';

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = ({ nativeEvent: { data } }) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(data);
  };

  return (
    <WebView onLoadEnd={handleEndLoading} onMessage={handleOnMessage} ref={handleSetRef} source={{ uri }} />
  );
};

export default WebviewContainer;
