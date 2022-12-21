/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import Calendars from '../components/Calendar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store';
import screenSlice from '../slices/screen';
import notificationSlice from '../slices/notification';
import axios from 'axios';
import Config from 'react-native-config';

function HomeScreen() {
  const userId = useSelector((state: RootState) => state.user.userId);
  const userNickname = useSelector((state: RootState) => state.user.userNickname);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const dispatch = useAppDispatch();
  const [data, setData] = useState({});
  const [chiunCount, setChiunCount] = useState(0);
  const [moinCount, setMoinCount] = useState(0);
  const notifications = useSelector((state: RootState) => state.notification.notification);

  useEffect(() => {
    dispatch(
      screenSlice.actions.addScreen({
        screen: 'HomeScreen',
      }),
    );
    return () => {
      dispatch(screenSlice.actions.deleteScreen());
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/gifticon/uid/${userId}`)
      .then(function (response) {
        const lst = response.data.data;
        var markedDates = {};
        lst.forEach((gifticon: object) => {
          if (!gifticon.gifticonUsed) {
            var period = gifticon.gifticonPeriod;
            // console.log(period);
            if (!markedDates.hasOwnProperty(period)) {
              markedDates[period] = { dots: [selected], gifticons: [gifticon], clickable: true };
            } else {
              markedDates[period].dots.push(selected);
              markedDates[period].gifticons.push(gifticon);
            }
          }
        });
        setData(markedDates);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

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
      .get(`${Config.API_URL}/user/usage/${userId}`)
      .then(function (response) {
        console.log(response);
        setChiunCount(response.data.data.usedCount);
        setMoinCount(response.data.data.registCount);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

  const selected = { color: '#00bbf2', selectedDotColor: 'blue' };

  return (
    <EntireContainer>
      <TitleContainer>
        <TitleText1>
          모인 기프티콘
          <TitleText3> {moinCount} </TitleText3>개
        </TitleText1>
        <TitleText2>
          치운 기프티콘 <TitleText3> {chiunCount} </TitleText3>개
        </TitleText2>
      </TitleContainer>
      <Calendars type='multi-dot' data={data} />
    </EntireContainer>
  );
}
const EntireContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  width: 80%;
  margin: 5% 10% 2%;
`;

const TitleText1 = styled.Text`
  color: #000000;
  font-size: 15px;
  font-family: 'Regular';
  margin-right: auto;
`;

const TitleText2 = styled.Text`
  color: #000000;
  font-size: 15px;
  font-family: 'Regular';
  margin-left: auto;
`;

const TitleText3 = styled.Text`
  color: #ffa401;
  font-size: 30px;
  font-family: 'Regular';
`;

export default HomeScreen;
