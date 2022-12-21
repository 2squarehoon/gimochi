/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import styled from 'styled-components/native';
import { singleNotification } from '../../api/API';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function FriendRecomScreen() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const userId = Number(useSelector((state: RootState) => state.user.userId));
  const reload = useSelector((state: RootState) => state.reload.reload);
  const [friends, setFriends] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/kakao/friends`, {
        headers: {
          token: accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setFriends(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

  const requestFriend = async (id: number) => {
    await axios
      .post(`${Config.API_URL}/user/follow-request`, { followerUserId: userId, followingUserId: id })
      .then(function (response) {
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        // singleNotification(id, userId, 2);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const requestButton = (id: any) => {
    Alert.alert('친구 신청하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => requestFriend(id) },
    ]);
  };

  return (
    <EntireContainer>
      <FriendRecomTitleContainer>
        <FriendRecomTitle>알 수도 있는 친구들</FriendRecomTitle>
      </FriendRecomTitleContainer>
      <FriendListContainer>
        {friends.map(
          (friend, index) =>
            !friend.friend && (
              <FriendItemContainer key={index}>
                <FriendItemText>{friend.userName}</FriendItemText>
                {!friend.friend && (
                  <FriendItemButton onPress={() => requestButton(friend.userId)}>
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      size={30}
                      style={{ marginLeft: '3%', color: '#5de11f' }}
                    />
                  </FriendItemButton>
                )}
              </FriendItemContainer>
            ),
        )}
      </FriendListContainer>
    </EntireContainer>
  );
}

const EntireContainer = styled.ScrollView`
  background-color: #ffffff;
  flex: 1;
`;

const FriendRecomTitle = styled.Text`
  font-family: 'Regular';
  font-size: 30px;
  color: #000000;
  margin-bottom: 2%;
`;

const FriendRecomTitleContainer = styled.View`
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

const FriendItemButton = styled.TouchableOpacity`
  margin-left: auto;
`;

export default FriendRecomScreen;
