/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from '../../slices/user';
import screenSlice from '../../slices/screen';
import reloadSlice from '../../slices/reload';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import axios from 'axios';
import Config from 'react-native-config';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// import Modal from 'react-native-modal';

function MypageScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const [friendList, setFriendList] = useState([]);
  const [menuDisplay, setMenuDisplay] = useState(false);

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/user/follower/${userId}`, {
        headers: {
          token: accessToken,
        },
      })
      .then(function (response) {
        console.log(response);
        setFriendList(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

  const signOutWithKakao = async (): Promise<void> => {
    // 2. AsyncStorage 'Login'값 변경, UserId 삭제
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userNickname');
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('accessTokenExpiresAt');
    console.log(accessToken);
    // 3. back에 로그아웃 axios 요청
    axios
      .get(`${Config.API_URL}/kakao/oauth/logout`, {
        headers: {
          token: accessToken,
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    // 4. redux 변경
    dispatch(userSlice.actions.setLogout());
    // 5. redux screenName 홈으로 변경
    dispatch(screenSlice.actions.resetScreen());
    dispatch(
      reloadSlice.actions.setReload({
        reload: String(new Date()),
      }),
    );
  };

  const goFriendRecom = () => {
    navigation.navigate('FriendRecomScreen');
  };

  const goMyPoint = () => {
    navigation.navigate('MyPointScreen');
  };

  return (
    <EntireContainer>
      <MypageTitleContainer>
        <MypageTitle>친구 목록</MypageTitle>
        <FriendRecomButton onPress={goFriendRecom}>
          <FontAwesomeIcon icon={faUserPlus} size={30} style={{ marginLeft: '3%', color: '#000000' }} />
        </FriendRecomButton>
        <MypageMenuButton onPress={() => setMenuDisplay(true)}>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            size={30}
            style={{ marginLeft: '3%', color: '#4e4b4b' }}
          />
        </MypageMenuButton>
      </MypageTitleContainer>
      <FriendListContainer>
        {friendList.map((friend, index) => (
          <FriendItemContainer key={index}>
            <FriendItemText>{friend.userName}</FriendItemText>
          </FriendItemContainer>
        ))}
      </FriendListContainer>
      <Modal
        animationType='slide'
        transparent={true}
        visible={menuDisplay}
        onRequestClose={() => {
          setMenuDisplay(false);
        }}
        onBackdropPress={() => setMenuDisplay(false)}
      >
        <MenuOverLay onPress={() => setMenuDisplay(false)}>
          <SettingMenuContainer>
            <MenuSelectContainer onPress={goMyPoint}>
              <MenuText>포인트 내역</MenuText>
            </MenuSelectContainer>
            <MenuSelectContainer onPress={signOutWithKakao}>
              <MenuText>로그아웃</MenuText>
            </MenuSelectContainer>
            <MenuSelectContainer onPress={signOutWithKakao}>
              <MenuText>회원탈퇴</MenuText>
            </MenuSelectContainer>
          </SettingMenuContainer>
          <CancelContainer>
            <MenuSelectContainer onPress={() => setMenuDisplay(false)}>
              <MenuText>취소</MenuText>
            </MenuSelectContainer>
          </CancelContainer>
        </MenuOverLay>
      </Modal>
    </EntireContainer>
  );
}

const EntireContainer = styled.ScrollView`
  background-color: #ffffff;
  flex: 1;
`;

const MypageTitle = styled.Text`
  font-family: 'Regular';
  font-size: 30px;
  color: #000000;
  margin-bottom: 2%;
`;

const FriendRecomButton = styled.TouchableOpacity`
  margin: 2% 5% 0 45%;
`;

const MypageMenuButton = styled.TouchableOpacity`
  margin: 2% 0 0 0;
`;

const MypageTitleContainer = styled.View`
  margin: 5% 5% 0;
  border-bottom-width: 1px;
  border-bottom-color: #ffa401;
  flex-direction: row;
`;

const FriendListContainer = styled.View`
  margin: 3%;
`;

const FriendItemContainer = styled.View`
  align-items: center;
  flex-direction: row;
  border-radius: 10px;
  background-color: #ffe7bc;
  margin: 2%;
  height: 50px;
  elevation: 10;
`;

const FriendItemText = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  margin-left: 5%;
  color: #000000;
`;

const SettingMenuContainer = styled.View`
  margin-top: 400px;
  width: 80%;
  background-color: #fcf9f0;
  border-radius: 15px;
  border: 1px solid #000;
  align-items: center;
  margin-bottom: 2%;
`;

const CancelContainer = styled.View`
  width: 80%;
  background-color: #fcf9f0;
  border-radius: 15px;
  border: 1px solid #000;
  align-items: center;
`;

const MenuSelectContainer = styled.TouchableOpacity`
  width: 100%;
  background-color: #fcf9f0;
  align-items: center;
  margin: 5%;
`;

const MenuText = styled.Text`
  font-family: 'Regular';
  font-size: 18px;
  color: #000000;
`;

const MenuOverLay = styled.TouchableOpacity`
  position: relative;
  width: 100%;
  height: 100%;
  // background-color: rgba(102, 100, 100, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default MypageScreen;
