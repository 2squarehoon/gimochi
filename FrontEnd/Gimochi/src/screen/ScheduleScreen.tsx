/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch } from '../store';
import screenSlice from '../slices/screen';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

function ScheduleScreen({ navigation }) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const [scheduleList, setScheduleList] = useState([]);
  const [date, setDate] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    dispatch(
      screenSlice.actions.addScreen({
        screen: 'ScheduleScreen',
      }),
    );
    return () => {
      console.log('unmount');
      dispatch(screenSlice.actions.deleteScreen());
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/session/session/friends/${userId}`)
      .then(function (response) {
        console.log(response);
        const friends = response.data.data;
        const lst: object[] = [];
        const markedDates = {};
        friends.forEach((friend) => {
          friend.list.forEach((session: object) => {
            lst.push(session);
          });
        });
        lst.forEach((session: object) => {
          const period = session.anniversary;
          if (!markedDates.hasOwnProperty(period)) {
            markedDates[period] = { dots: [selected], sessions: [session], clickable: true };
          } else {
            markedDates[period].dots.push(selected);
            markedDates[period].sessions.push(session);
          }
        });
        setScheduleList(markedDates);
        console.log(markedDates);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        console.log('1', scheduleList);
        setLoading(false);
      });
  }, [reload]);

  const goDetailSession = (
    id: number,
    sessionTypeId: number,
    friendId: number,
    friendName: string,
    name: string,
  ) => {
    setModal(false);
    if (sessionTypeId === 1) {
      navigation.navigate('RPBirthdayScreen2', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        userId: friendId,
        userName: friendName,
        fromSchedule: true,
      });
    } else if (sessionTypeId === 2) {
      navigation.navigate('RPGraduateScreen2', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        userId: friendId,
        userName: friendName,
        fromSchedule: true,
      });
    } else if (sessionTypeId === 3) {
      navigation.navigate('RPChristmasScreen2', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        userId: friendId,
        userName: friendName,
        fromSchedule: true,
      });
    } else {
      navigation.navigate('RPEtcScreen2', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        name: name,
        userId: friendId,
        userName: friendName,
        fromSchedule: true,
      });
    }
  };

  const selected = { color: '#00bbf2', selectedDotColor: 'blue' };

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  return (
    <RPContainer>
      <RPTitleContainer>
        <RPTitle>일정관리</RPTitle>
      </RPTitleContainer>
      <Calendar
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          if (scheduleList.hasOwnProperty(day.dateString)) {
            console.log(day.dateString);
            setDate(day.dateString);
            setModal(true);
            console.log(scheduleList[day.dateString].gifticons);
          }
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {
          console.log('selected day', day);
        }}
        markingType='multi-dot'
        markedDates={scheduleList}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy년 MM월'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {
          console.log('month changed', month);
        }}
        // Hide month navigation arrows. Default = false
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={(addMonth) => addMonth()}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={true}
        // Replace default month and year title with custom one. the function receive a date as parameter
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
        style={{ width: '90%', margin: '5%', borderRadius: 10, borderWidth: 1 }}
        theme={{
          textDayFontFamily: 'Regular',
          textMonthFontFamily: 'Regular',
          textDayHeaderFontFamily: 'Regular',
        }}
      />
      <Modal
        animationType='fade'
        transparent={true}
        visible={modal}
        // presentationStyle={'pageSheet'}
        onRequestClose={() => {
          // setModalVisible(!modalVisible);
          setModal(false);
        }}
        onBackdropPress={() => setModal(false)}
      >
        {date && (
          <ModalContainer>
            <ModalTitleText>{date}</ModalTitleText>
            <ModalTitle1Text>친구들의 일정 목록</ModalTitle1Text>
            {scheduleList[date].sessions.map((session, index) =>
              session.sessionTypeId === 1 ? (
                <ModalContentsContainer key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      goDetailSession(
                        session.sessionId,
                        session.sessionTypeId,
                        session.userId,
                        session.userName,
                        session.name,
                      )
                    }
                  >
                    <ModalContentsText>{session.userName} 님의 생일 추카포카</ModalContentsText>
                  </TouchableOpacity>
                </ModalContentsContainer>
              ) : session.sessionTypeId === 2 ? (
                <ModalContentsContainer key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      goDetailSession(
                        session.sessionId,
                        session.sessionTypeId,
                        session.userId,
                        session.userName,
                        session.name,
                      )
                    }
                  >
                    <ModalContentsText>{session.userName} 님의 졸업 추카포카</ModalContentsText>
                  </TouchableOpacity>
                </ModalContentsContainer>
              ) : session.sessionTypeId === 3 ? (
                <ModalContentsContainer key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      goDetailSession(
                        session.sessionId,
                        session.sessionTypeId,
                        session.userId,
                        session.userName,
                        session.name,
                      )
                    }
                  >
                    <ModalContentsText>{session.userName} 님의 크리스마스 추카포카</ModalContentsText>
                  </TouchableOpacity>
                </ModalContentsContainer>
              ) : (
                <ModalContentsContainer key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      goDetailSession(
                        session.sessionId,
                        session.sessionTypeId,
                        session.userId,
                        session.userName,
                        session.name,
                      )
                    }
                  >
                    <ModalContentsText>
                      {session.userName} 님의 {session.name} 추카포카
                    </ModalContentsText>
                  </TouchableOpacity>
                </ModalContentsContainer>
              ),
            )}
          </ModalContainer>
        )}
      </Modal>
    </RPContainer>
  );
}

const RPContainer = styled.View`
  background-color: #ffffff;
  flex: 1;
`;

const RPTitle = styled.Text`
  font-family: 'Regular';
  font-size: 30px;
  color: #000000;
  margin-bottom: 2%;
`;

const RPTitleContainer = styled.View`
  margin: 5% 5% 0;
  border-bottom-width: 1px;
  border-bottom-color: #ffa401;
`;

const ModalContainer = styled.View`
  margin: 15%;
  width: 70%;
  height: 40%;
  background-color: #ffe7bc;
  border-radius: 15px;
  border: 1px solid #000;
  align-items: center;
`;

const ModalTitleText = styled.Text`
  margin-top: 5%;
  font-family: 'Regular';
  font-size: 20px;
  color: #000000;
`;

const ModalTitle1Text = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  margin-bottom: 5%;
  color: #000000;
`;

const ModalContentsContainer = styled.View`
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
`;

const ModalContentsText = styled.Text`
  font-family: 'Regular';
  font-size: 15px;
  color: #000000;
  margin: 2%;
`;

export default ScheduleScreen;
