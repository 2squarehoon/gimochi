/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import SelectDropdown from 'react-native-select-dropdown';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import { format } from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import screenSlice from '../../slices/screen';
import Config from 'react-native-config';
import { multiNotification } from '../../api/API';

function RPWriteScreen({ navigation }) {
  const [typeId, setTypeId] = useState<number>(0);
  const [sessionName, setSessionName] = useState<string>('');
  const [date, onChangeDate] = useState<Date>(new Date());
  const [visible, setVisible] = useState<boolean>(false); // 달력 모달 노출 여부
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      screenSlice.actions.addScreen({
        screen: 'RollingpaperScreen',
      }),
    );
    return () => {
      console.log('unmount');
      dispatch(screenSlice.actions.deleteScreen());
    };
  }, []);

  const onPressDate = () => {
    // 날짜 클릭 시
    setVisible(true); // 모달 open
  };

  const onChange = (event: void, selectedDate: Date) => {
    const currentDate: Date = selectedDate || date;
    onChangeDate(currentDate);
    console.log(currentDate);
    setVisible(false);
  };

  const onConfirm = (selectedDate: Date) => {
    // 날짜 또는 시간 선택 시
    setVisible(false); // 모달 close
    onChangeDate(selectedDate); // 선택한 날짜 변경
  };

  const onCancel = () => {
    // 취소 시
    setVisible(false); // 모달 close
  };

  const onSubmit = async () => {
    // 정보 제대로 입력하지 않았을 때 alert띄워야
    await axios
      .post(`${Config.API_URL}/session`, {
        anniversary: format(date, 'yyyy-MM-dd'),
        name: sessionName,
        sessionTypeId: typeId,
        userId: userId,
      })
      .then(function (response) {
        console.log(response);
        // 실시간 상태관리용, 무지성 복붙할것
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        multiNotification(userId, 1);
        navigation.goBack();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <EntireContainer>
      <DismissKeyboardView style={{ backgroundColor: '#ffffff' }}>
        <TitleContainer>
          <TitleText>테마를 선택해주세요</TitleText>
        </TitleContainer>
        <DropdownContainer>
          {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
          <SelectDropdown
            data={['생일', '졸업', '크리스마스', '사용자 정의']}
            defaultButtonText='테마를 선택해주세요'
            buttonTextStyle={{ fontFamily: 'Regular' }}
            rowTextStyle={{ fontFamily: 'Regular' }}
            onSelect={(selectedItem, index) => {
              if (selectedItem == '생일') {
                setTypeId(1);
              } else if (selectedItem == '졸업') {
                setTypeId(2);
              } else if (selectedItem == '크리스마스') {
                setTypeId(3);
                // } else if (selectedItem == '설날') {
                //   setTypeId(4);
              } else {
                setTypeId(5);
              }
            }}
            buttonStyle={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderBottomColor: '#000000',
              borderRadius: 10,
            }}
            rowStyle={{
              backgroundColor: '#ffffff',
            }}
          />
          {/* </TouchableWithoutFeedback> */}
        </DropdownContainer>
        {typeId === 5 && (
          <FormContainer>
            <TitleText>사용자 정의 테마 입력</TitleText>
            <TextInput
              value={sessionName}
              onChangeText={setSessionName}
              placeholder='사용자 정의 테마를 입력해주세요'
              returnKeyType='next'
              style={{
                borderBottomColor: '#000000',
                borderBottomWidth: 1,
                fontSize: 20,
                fontFamily: 'Regular',
              }}
            ></TextInput>
          </FormContainer>
        )}
        <TitleContainer>
          <TitleText>날짜를 선택해주세요</TitleText>
        </TitleContainer>
        <FormContainer>
          <DateButton onPress={onPressDate}>
            <DateButtonContainer>
              <FontAwesomeIcon icon={faCalendar} size={20} />
              <DateText>{format(new Date(date), 'PPP', { locale: ko })}</DateText>
            </DateButtonContainer>
          </DateButton>
          {visible && (
            <DateTimePicker
              mode={'date'}
              display='spinner'
              onConfirm={onConfirm}
              onCancel={onCancel}
              onChange={onChange}
              value={date}
              locale='ko'
            />
          )}
        </FormContainer>
        <SubmitButton onPress={onSubmit}>
          <SubmitText>제출</SubmitText>
        </SubmitButton>
      </DismissKeyboardView>
    </EntireContainer>
  );
}

const EntireContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const TitleContainer = styled.View`
  margin: 5% 10%;
`;

const TitleText = styled.Text`
  font-size: 30px;
  font-family: 'Regular';
  color: #000000;
`;
const DropdownContainer = styled.View`
  margin: 0% 10%;
`;

const FormContainer = styled.View`
  margin: 5% 10%;
`;

const DateButton = styled.TouchableOpacity`
  width: 60%;
`;

const DateButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const DateText = styled.Text`
  font-size: 20px;
  font-family: 'Regular';
  margin-left: 5%;
  color: #000000;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 20%;
  border-radius: 10px;
  background-color: #ffa401;
  align-items: center;
  margin-left: 70%;
`;

const SubmitText = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  color: #ffffff;
  margin: 5%;
`;

export default RPWriteScreen;
