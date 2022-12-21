/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store';
import reloadSlice from '../slices/reload';
import notificationSlice from '../slices/notification';
import styled from 'styled-components/native';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

function NotificationScreen() {
  const userId = useSelector((state: RootState) => state.user.userId);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let notiCount = 0;
    axios
      .all([
        axios.get(`${Config.API_URL}/user/following-request/${userId}`),
        axios.get(`${Config.API_URL}/challenge/challengeInvite/challengeList/${userId}`),
      ])
      .then(
        axios.spread((response1, response2) => {
          const followList = response1.data.data;
          notiCount = notiCount + followList.length;
          const inviteList = response2.data.data;
          notiCount = notiCount + inviteList.length;
        }),
      )
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        dispatch(notificationSlice.actions.setNotification({ notification: Number(notiCount) }));
      });
  }, [reload]);

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/user/following-request/${userId}`)
      .then(function (response) {
        console.log(response);
        setFriends(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/challenge/challengeInvite/challengeList/${userId}`)
      .then(function (response) {
        console.log(response.data);
        setInvitations(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

  const acceptFriend = async (id: number) => {
    await axios
      .post(`${Config.API_URL}/user/follow-accept`, { followerUserId: id, followingUserId: userId })
      .then(function (response) {
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        dispatch(notificationSlice.actions.deleteNotification());
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const rejectFriend = async (id: number) => {
    await axios
      .post(`${Config.API_URL}/user/follow-reject`, { followerUserId: id, followingUserId: userId })
      .then(function (response) {
        console.log(response);
        dispatch(notificationSlice.actions.deleteNotification());
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
      });
  };

  const rejectFriendButton = (id: any) => {
    Alert.alert('친구 신청을 거절하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => rejectFriend(id) },
    ]);
  };

  const acceptChallenge = async (id: number) => {
    await axios
      .post(`${Config.API_URL}/challenge/challengeInvite/accept/${id}`)
      .then(function (response) {
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        dispatch(notificationSlice.actions.deleteNotification());
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const rejectChallenge = async (id: number) => {
    await axios
      .delete(`${Config.API_URL}/challenge/challengeInvite/${id}`)
      .then(function (response) {
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        dispatch(notificationSlice.actions.deleteNotification());
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const rejectChallengeButton = (id: any) => {
    Alert.alert('챌린지 신청을 거절하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => rejectChallenge(id) },
    ]);
  };

  return (
    <NotiContainer>
      <NotiTitleContainer>
        <NotiTitle>친구 신청</NotiTitle>
      </NotiTitleContainer>
      <NotiListContainer>
        {friends.map((friend, index) => (
          <NotiItemContainer key={index}>
            <NotiListText>{friend.userName}</NotiListText>
            <NotiItemButton1 onPress={() => acceptFriend(friend.userId)}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={30}
                style={{ marginLeft: '3%', color: '#5de11f' }}
              />
            </NotiItemButton1>
            <NotiItemButton2 onPress={() => rejectFriendButton(friend.userId)}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                size={30}
                style={{ marginLeft: '3%', color: '#f02626' }}
              />
            </NotiItemButton2>
          </NotiItemContainer>
        ))}
      </NotiListContainer>
      <NotiTitleContainer>
        <NotiTitle>초대장</NotiTitle>
      </NotiTitleContainer>
      <NotiListContainer>
        {invitations.map((invitation, index) => (
          <NotiItemContainer key={index}>
            <NotiListText>{invitation.challengeTitle}</NotiListText>
            <NotiItemButton1 onPress={() => acceptChallenge(invitation.challengeInviteId)}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={30}
                style={{ marginLeft: '3%', color: '#5de11f' }}
              />
            </NotiItemButton1>
            <NotiItemButton2 onPress={() => rejectChallengeButton(invitation.challengeInviteId)}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                size={30}
                style={{ marginLeft: '3%', color: '#f02626' }}
              />
            </NotiItemButton2>
          </NotiItemContainer>
        ))}
      </NotiListContainer>
    </NotiContainer>
  );
}

const NotiContainer = styled.View`
  background-color: #ffffff;
  flex: 1;
`;
const NotiTitle = styled.Text`
  font-family: 'Regular';
  font-size: 30px;
  color: #000000;
  margin-bottom: 2%;
`;

const NotiTitleContainer = styled.View`
  margin: 5% 5% 0;
  border-bottom-width: 1px;
  border-bottom-color: #ffa401;
`;

const NotiListContainer = styled.View`
  margin: 3%;
`;

const NotiItemButton1 = styled.TouchableOpacity`
  margin-left: auto;
`;

const NotiItemButton2 = styled.TouchableOpacity``;

const NotiItemContainer = styled.View`
  align-items: center;
  flex-direction: row;
  border-radius: 10px;
  background-color: #ffe7bc;
  margin: 2%;
  height: 50px;
  elevation: 10;
`;

const NotiListText = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  margin-left: 5%;
  color: #000000;
`;

export default NotificationScreen;
