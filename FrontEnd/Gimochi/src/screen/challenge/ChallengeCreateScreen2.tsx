import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  BottomSheet,
  Button,
  ListItem,
  Input,
  Tab,
  TabView,
  ThemeProvider,
  createTheme,
  SpeedDial,
  Dialog,
  Icon,
} from '@rneui/themed';
import { format } from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';

function ChallengeCreateScreen2({ route, navigation }) {
  const [chTitle, setChTitle] = useState('');
  const [chDescription, setChDescription] = useState('');
  const [chPoint, setChPoint] = useState('');
  const [dateS, setDateS] = useState<Date>(new Date());
  const [dateE, setDateE] = useState<Date>(new Date());
  const [visibleS, setVisibleS] = useState<boolean>(false); // 달력 모달 노출 여부
  const [visibleE, setVisibleE] = useState<boolean>(false); // 달력 모달 노출 여부
  const [visibleDialogP, setVisibleDialogP] = useState(false);
  const [visibleDialogG, setVisibleDialogG] = useState(false);

  const [visibleListG, setVisibleListG] = useState(false);

  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  const userNickname = useSelector((state: RootState) => state.user.userNickname);
  const indexOfGP = route.params.indexOfGP;
  // indexOfGP 1 :포인트  2 :기프티콘
  // console.log(indexOfGP);

  const goMain = () => {
    navigation.navigate('ChallengeMainScreen');
  };

  const onSubmit = async () => {
    const finalP = chPoint ? Number(chPoint) : 0;
    const jsonData = {
      challengeActive: 0,
      challengeDescription: chDescription,
      challengeEndDate: format(dateE, 'yyyy-MM-dd'),
      challengeLeaderId: userId,
      challengeLeaderName: userNickname,
      challengeParticipantPoint: finalP,
      challengeRewardPoint: 0,
      challengeRewardType: indexOfGP,
      challengeStartDate: format(dateS, 'yyyy-MM-dd'),
      challengeTitle: chTitle,
    };
    // console.log(jsonData);
    await axios
      .post(`${Config.API_URL}/challenge`, jsonData)
      .then(function (response) {
        console.log(response);
        // 실시간 상태관리용, 무지성 복붙할것
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        Alert.alert('챌린지 목록 화면으로 이동합니다.', '', [{ text: '확인', onPress: () => goMain() }]);
      })
      .catch(function (error) {
        Alert.alert('모든 항목을 작성해 주세요');
        console.log(error);
      });
  };
  // 숫자만 입력해라
  const onChanged = (chPoint) => {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < chPoint.length; i++) {
      if (numbers.indexOf(chPoint[i]) > -1) {
        newText = newText + chPoint[i];
      } else {
        // 숫자아니면 call back function
        console.log('please enter numbers only');
        Alert.alert('숫자만 입력 할 수 있습니다.');
      }
    }
    setChPoint(chPoint);
    console.log(chPoint);
  };
  const onPressDateS = () => {
    // 날짜 클릭 시
    setVisibleS(true); // 모달 open
  };
  const onPressDateE = () => {
    // 날짜 클릭 시
    setVisibleE(true); // 모달 open
  };
  const onChangeS = (event: void, selectedDate: Date) => {
    const currentDate: Date = selectedDate || dateS;
    // console.log(currentDate.setDate(currentDate.getDate() - 1));// 하루전 계산
    // new Date 함수 실행한 시간 | currentDate 스크린 랜더링 한 시간
    const isBefore24H = currentDate - new Date(); // 86400000 24시간
    if (isBefore24H >= 86400000) {
      setDateS(currentDate);
      console.log(currentDate);
      setVisibleS(false);
    } else {
      console.log('24시간 이전에만 생성가능 합니다');
      Alert.alert('24시간 이전에만 생성가능 합니다');
      setVisibleS(false);
    }
  };
  const onChangeE = (event: void, selectedDate: Date) => {
    const currentDate: Date = selectedDate || dateE;

    const isBefore96H = currentDate - new Date(); // 345600000 96시간
    if (isBefore96H >= 345600000) {
      // 챌린지 시작후3일 이후
      setDateE(currentDate);
      console.log(currentDate);
      setVisibleE(false);
    } else {
      console.log('챌린지는 최소 3일 이상 해야합니다');
      Alert.alert('챌린지는 최소 3일 이상 해야합니다');
      setVisibleE(false);
    }

    setDateE(currentDate);
    console.log(currentDate);
    setVisibleE(false);
  };
  const onConfirmS = (selectedDate: Date) => {
    // 날짜 또는 시간 선택 시
    setVisibleS(false); // 모달 close
    setDateS(selectedDate); // 선택한 날짜 변경
  };
  const onConfirmE = (selectedDate: Date) => {
    // 날짜 또는 시간 선택 시
    setVisibleE(false); // 모달 close
    setDateE(selectedDate); // 선택한 날짜 변경
  };
  const onCancelS = () => {
    // 취소 시
    setVisibleS(false); // 모달 close
  };
  const onCancelE = () => {
    // 취소 시
    setVisibleE(false); // 모달 close
  };
  const toggleDialogP = () => {
    setVisibleDialogP(!visibleDialogP);
  };
  const toggleDialogG = () => {
    setVisibleDialogG(!visibleDialogG);
  };

  const toggleListG = () => {
    setVisibleListG(!visibleListG);
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            height: 80,
            padding: 20,
            marginRight: 60,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'black', fontSize: 25, marginTop: 5, fontFamily: 'Regular' }}>
            제목{'  '}:
          </Text>
          <Input
            style={{ color: 'black' }}
            placeholder='ex> 1일 1커밋'
            value={chTitle}
            onChangeText={setChTitle}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            height: 80,
            padding: 20,
            marginRight: 60,
          }}
        >
          <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>시작일(매일){'  '}:</Text>

          <View>
            <TouchableOpacity onPress={onPressDateS}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                {/* <FontAwesomeIcon icon={faCalendar} size={20} /> */}
                <Text
                  style={{ color: 'black', padding: 3, paddingLeft: 25, fontSize: 20, fontFamily: 'Regular' }}
                >
                  {format(new Date(dateS), 'PPP', { locale: ko })}
                </Text>
              </View>
            </TouchableOpacity>
            {visibleS && (
              <DateTimePicker
                mode={'date'}
                display='spinner'
                onConfirm={onConfirmS}
                onCancel={onCancelS}
                onChange={onChangeS}
                value={dateS}
                locale='ko'
              />
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            height: 80,
            padding: 20,
            marginRight: 60,
          }}
        >
          <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>종료일{'  '}:</Text>
          <View>
            <TouchableOpacity onPress={onPressDateE}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                {/* <FontAwesomeIcon icon={faCalendar} size={20} /> */}
                <Text
                  style={{
                    color: 'black',
                    padding: 3,
                    paddingLeft: 100,
                    fontSize: 20,
                    fontFamily: 'Regular',
                  }}
                >
                  {format(new Date(dateE), 'PPP', { locale: ko })}
                </Text>
              </View>
            </TouchableOpacity>
            {visibleE && (
              <DateTimePicker
                mode={'date'}
                display='spinner'
                onConfirm={onConfirmE}
                onCancel={onCancelE}
                onChange={onChangeE}
                value={dateS}
                locale='ko'
              />
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            height: 110,
            padding: 20,
            marginRight: 60,
          }}
        >
          <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>설명{'  '}:</Text>

          <Input
            style={{ color: 'black' }}
            multiline
            numberOfLines={3}
            editable
            maxLength={300}
            inputContainerStyle={{ backgroundColor: '#efefef', height: 90 }}
            placeholder='챌린지 내용을 입력하세요'
            onChangeText={setChDescription}
            value={chDescription}
            errorStyle={{ color: 'black' }}
            errorMessage='Tip. 챌린지 추가설명을 300자 안으로 작성하세요!'
          />
        </View>

        {indexOfGP === 1 ? (
          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              height: 100,
              padding: 20,
              marginRight: 85,
            }}
          >
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular', paddingTop: 10 }}>
              참가비{'  '}:
            </Text>

            <Input
              style={{ color: 'black' }}
              placeholder='참가비를 입력하세요'
              onChangeText={onChanged}
              value={chPoint}
              keyboardType='numeric'
              maxLength={4}
              errorStyle={{ color: 'black' }}
              errorMessage='Tip. 챌린지는 달성률에 비례해 환급됩니다!'
              rightIcon={
                <Icon
                  name='question'
                  type='octicon'
                  size={35}
                  color='black'
                  onPress={() => toggleDialogP()}
                />
              }
              rightIconContainerStyle={{ padding: 1 }}
            />
            <Dialog
              overlayStyle={{ backgroundColor: '#FFE7BC', borderRadius: 20 }}
              isVisible={visibleDialogP}
              onBackdropPress={toggleDialogP}
            >
              <Text style={{ color: 'black', fontSize: 19, fontFamily: 'Regular', textAlign: 'center' }}>
                숫자만 입력하세요. 최대 9999P
              </Text>
            </Dialog>
          </View>
        ) : (
          <View style={{ marginTop: 10, flexDirection: 'row', height: 100, padding: 20, marginRight: 60 }}>
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
              기프티콘 등록은 대기화면에서!
            </Text>
          </View>
        )}
      </ScrollView>
      <Icon
        name='check'
        type='font-awesome-5'
        color='#FFE7BC'
        size={25}
        reverse
        reverseColor='#FFA401'
        onPress={() => onSubmit()}
        iconStyle={{ fontSize: 33 }}
        containerStyle={{ position: 'absolute', top: '85%', left: '80%' }}
      />
    </View>
  );
}

export default ChallengeCreateScreen2;
