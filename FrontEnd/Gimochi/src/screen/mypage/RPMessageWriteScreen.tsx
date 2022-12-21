/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, View, Text, Alert } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import screenSlice from '../../slices/screen';
import reloadSlice from '../../slices/reload';
import styled from 'styled-components/native';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import SelectDropdown from 'react-native-select-dropdown';
import { chiunGifticonCount } from '../../api/API';

function RPMessageWriteScreen({ route, navigation }) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const userNickname = useSelector((state: RootState) => state.user.userNickname);
  const [loading, setLoading] = useState(true);
  const [gifticonList, setGifticonList] = useState([]);
  const [dropdownData, setDropdownData] = useState([]);
  const [nickname, setNickname] = useState<string>(userNickname);
  const [text, setText] = useState<string>('');
  const [type, setType] = useState<number>(1);
  const [gifticonId, setGifticonId] = useState<string>('');
  const sessionId: number = route.params.RPId;
  const sessionType: number = route.params.type;
  const friendId = route.params.FId;
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

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/gifticon/uid/${userId}`)
      .then(function (response) {
        console.log(response);
        const gifticonData = [];
        response.data.data.forEach((gifticon) => {
          if (!gifticon.gifticonUsed) {
            gifticonData.push(gifticon);
          }
        });
        setGifticonList(gifticonData);
        const data = gifticonData.map((gifticon: { gifticonStore: any }, index: any, array: any) => {
          return gifticon.gifticonStore;
        });
        setDropdownData(data);
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async () => {
    await axios
      .post(`${Config.API_URL}/session/message`, {
        field: text,
        gifticonId: gifticonId,
        nickname: nickname,
        sessionId: sessionId,
        messageType: type,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    if (gifticonId) {
      await axios
        .put(`${Config.API_URL}/gifticon/present/${gifticonId}/${userId}/${friendId}`)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      chiunGifticonCount(userId);
    }
    dispatch(
      reloadSlice.actions.setReload({
        reload: String(new Date()),
      }),
    );
    navigation.goBack();
  };

  const submitButton = () => {
    Alert.alert('메시지를 작성하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => onSubmit() },
    ]);
  };

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <>
      <DismissKeyboardView style={{ flex: 2, backgroundColor: '#ffffff' }}>
        <TitleContainer>
          <TitleText>닉네임 입력</TitleText>
        </TitleContainer>
        <FormContainer>
          <Form placeholder='닉네임을 입력해주세요' value={nickname} onChangeText={setNickname}></Form>
        </FormContainer>
        <TitleContainer>
          <TitleText>선물하기</TitleText>
        </TitleContainer>
        <FormContainer>
          <SelectDropdown
            data={dropdownData}
            defaultButtonText='기프티콘을 선택해주세요'
            buttonTextStyle={{ fontFamily: 'Regular' }}
            rowTextStyle={{ fontFamily: 'Regular' }}
            onSelect={(item, index) => {
              setGifticonId(gifticonList[index].gifticonId);
              // console.log(index);
              // console.log(gifticonList[index]);
            }}
            buttonStyle={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 10,
            }}
            rowStyle={{
              backgroundColor: '#ffffff',
            }}
          />
        </FormContainer>
        <TitleContainer>
          <TitleText>편지쓰기</TitleText>
        </TitleContainer>
        <FormContainer>
          <Form
            placeholder='추카포카에 담아 보낼 말을 입력해주세요'
            value={text}
            onChangeText={setText}
            multiline={true}
          ></Form>
        </FormContainer>
        <TitleContainer>
          <TitleText>메시지 장식하기</TitleText>
        </TitleContainer>
        <ImageContainer>
          <TouchableOpacity onPress={() => setType(1)}>
            {sessionType === 3 ? (
              <Image
                source={require('../../assets/images/christmasItem1.png')}
                resizeMode='contain'
                style={type === 1 ? { height: 65 } : { height: 65, opacity: 0.3 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/homeMochi.png')}
                resizeMode='contain'
                style={type === 1 ? { height: 70 } : { height: 70, opacity: 0.3 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType(2)}>
            {sessionType === 3 ? (
              <Image
                source={require('../../assets/images/christmasItem2.png')}
                resizeMode='contain'
                style={type === 2 ? { height: 65 } : { height: 65, opacity: 0.3 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/attendMochi.png')}
                resizeMode='contain'
                style={type === 2 ? { height: 70 } : { height: 70, opacity: 0.3 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType(3)}>
            {sessionType === 3 ? (
              <Image
                source={require('../../assets/images/christmasItem3.png')}
                resizeMode='contain'
                style={type === 3 ? { height: 65 } : { height: 65, opacity: 0.3 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/challengeMochi.png')}
                resizeMode='contain'
                style={type === 3 ? { height: 70 } : { height: 70, opacity: 0.3 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType(4)}>
            {sessionType === 3 ? (
              <Image
                source={require('../../assets/images/christmasItem4.png')}
                resizeMode='contain'
                style={type === 4 ? { height: 65 } : { height: 65, opacity: 0.3 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/playMochi.png')}
                resizeMode='contain'
                style={type === 4 ? { height: 70 } : { height: 70, opacity: 0.3 }}
              />
            )}
          </TouchableOpacity>
        </ImageContainer>
      </DismissKeyboardView>
      <SubmitButton onPress={submitButton}>
        <SubmitText>제출</SubmitText>
      </SubmitButton>
    </>
  );
}

const EntireContainer = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;

const TitleContainer = styled.View`
  margin: 3% 10%;
`;

const TitleText = styled.Text`
  font-size: 25px;
  font-family: 'Regular';
  color: #000000;
`;

const DropdownContents = styled.Text`
  font-size: 15px;
  font-family: 'Regular';
  color: #000000;
`;

const FormContainer = styled.View`
  margin: 0% 10%;
  border: 1px;
  border-radius: 10px;
`;

const Form = styled.TextInput`
  color: #000000;
`;

const ImageContainer = styled.View`
  width: 80%;
  height: 80px;
  margin: 3% 10%;
  flex-direction: row;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 20%;
  border-radius: 10px;
  background-color: #ffa401;
  align-items: center;
  position: absolute;
  left: 300px;
  top: 480px;
`;

const SubmitText = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  color: #ffffff;
  margin: 5%;
`;

export default RPMessageWriteScreen;
