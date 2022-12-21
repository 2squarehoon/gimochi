/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, Image, Dimensions, TextInput } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import Config from 'react-native-config';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import { format } from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

function GifticonUploadScreen({ navigation }) {
  const [image, setImage] = useState<{ uri: string; name: string; type: string }>();
  const [preview, setPreview] = useState<{ uri: string }>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const userId = useSelector((state: RootState) => state.user.userId);
  const [store, setStore] = useState('');
  const [period, setPeriod] = useState('');
  const [code, setCode] = useState(0);
  const [isOCR, setIsOCR] = useState(false);
  const dispatch = useAppDispatch();

  // ImageCropPicker에서 crop된 사진을 resizing한 후 객체 형태(경로, 파일이름, 타입)로 이미지 파일 저장하는 메서드
  const onResponse = useCallback(async (response) => {
    console.log(response.width, response.height, response.exif);
    setPreview({ uri: `data:${response.mime};base64,${response.data}` });
    const orientation = response.exif?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then((r) => {
      console.log(r);
      console.log(r.uri);
      console.log(r.name);
      setImage({
        uri: r.uri,
        name: r.name,
        type: 'image/jpeg',
      });
    });
  }, []);

  // 갤러리에서 사진 파일을 골라서 crop하는 메서드
  const onChangeFile = useCallback(() => {
    return ImageCropPicker.openPicker({
      includeExif: true,
      includeBase64: true,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  // 백으로 사진파일 보내서 OCR 처리 후 얻은 텍스트값 받음
  const postOCR = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }
    console.log(preview);
    const formData = new FormData();
    formData.append('file', image);
    console.log(formData);
    await axios
      .post(`${Config.API_URL}/gifticon/ocr/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setPeriod(response.data.data.gifticonPeriod);
        setStore(response.data.data.gifticonStore);
        setCode(response.data.data.gifticonCode);
        if (!response.data.data.gifticonPeriod && !response.data.data.gifticonCode) {
          Alert.alert('유효한 기프티콘 사진 파일을 업로드해주세요.');
        } else {
          setIsOCR(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert('유효한 기프티콘 사진 파일을 업로드해주세요.');
      });
  }, [image, accessToken, userId]);

  // OCR 처리 후 텍스트 전처리된 값 받아와서 필요시 수정
  const postInfo = async () => {
    const formData = new FormData();
    formData.append('file', image);
    if (period && store && code) {
      await axios
        .post(`${Config.API_URL}/gifticon/info`, {
          gifticonPeriod: period,
          gifticonStore: store,
          gifticonCode: code,
          userId: userId,
        })
        .then(function (response) {
          console.log(response);
          postImage(response.data.data.gifticonId, formData);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Alert.alert('유효한 기프티콘 정보를 입력해주세요.');
    }
  };

  // 이미지 서버에 post
  const postImage = async (id: number, formData: FormData) => {
    await axios
      .post(`${Config.API_URL}/gifticon/img/${id}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        navigation.goBack();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <DismissKeyboardView style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <UploadContainer>
        <UploadTitle>기프티콘 등록</UploadTitle>
      </UploadContainer>
      <SubmitButton onPress={onChangeFile}>
        <SubmitText>갤러리</SubmitText>
      </SubmitButton>
      {preview && (
        <>
          <UploadContainer>
            <UploadTitle>미리보기</UploadTitle>
          </UploadContainer>
          <Image
            style={{ height: Dimensions.get('window').height / 3, resizeMode: 'contain' }}
            source={preview}
          />
        </>
      )}
      {preview && (
        <SubmitButton onPress={postOCR}>
          <SubmitText>업로드</SubmitText>
        </SubmitButton>
      )}
      {isOCR && (
        <>
          <UploadContainer>
            <UploadTitle>기프티콘 정보 등록</UploadTitle>
          </UploadContainer>
          <DateButtonContainer>
            <DateText>사용처 : </DateText>
            <TextInput
              placeholder='대충 사용처'
              value={store}
              onChangeText={setStore}
              style={{ fontSize: 20, color: '#000000' }}
            ></TextInput>
          </DateButtonContainer>
          <DateButtonContainer>
            <DateText>만료일 : {period}</DateText>
          </DateButtonContainer>
          <SubmitButton onPress={postInfo}>
            <SubmitText>등록</SubmitText>
          </SubmitButton>
        </>
      )}
    </DismissKeyboardView>
  );
}

const FormContainer = styled.View``;

const UploadTitle = styled.Text`
  font-family: 'Regular';
  font-size: 30px;
  color: #000000;
  margin-bottom: 2%;
`;

const UploadContainer = styled.View`
  margin: 5% 5% 3%;
  border-bottom-width: 1px;
  border-bottom-color: #ffa401;
`;

const DateButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const DateText = styled.Text`
  font-size: 20px;
  font-family: 'Regular';
  color: #000000;
  margin-left: 5%;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 20%;
  border-radius: 10px;
  background-color: #ffa401;
  align-items: center;
  margin: 2% 10% 0 auto;
`;

const SubmitText = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  color: #ffffff;
  margin: 5%;
`;

export default GifticonUploadScreen;
