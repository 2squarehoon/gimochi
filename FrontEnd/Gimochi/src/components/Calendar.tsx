/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

function Calendars(props) {
  const data = props.data;
  const [date, setDate] = useState('');
  const [modal, setModal] = useState(false);
  return (
    <>
      <Calendar
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          if (props.data.hasOwnProperty(day.dateString)) {
            console.log(day.dateString);
            setDate(day.dateString);
            setModal(true);
            console.log(data[day.dateString].gifticons);
          }
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {
          console.log('selected day', day);
        }}
        markingType={props.type}
        markedDates={data}
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
            <ModalTitle1Text>미사용 기프티콘 목록</ModalTitle1Text>
            {data[date].gifticons.map((gifticon, index) => (
              <ModalContentsText key={index}>{gifticon.gifticonStore}</ModalContentsText>
            ))}
          </ModalContainer>
        )}
      </Modal>
    </>
  );
}
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

const ModalContentsText = styled.Text`
  font-family: 'Regular';
  font-size: 15px;
  color: #000000;
`;

export default Calendars;
