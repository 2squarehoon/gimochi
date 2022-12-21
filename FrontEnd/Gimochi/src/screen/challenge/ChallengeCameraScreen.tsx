import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
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
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';

function ChallengeCameraScreen({ navigation, route }) {
  const [image, setImage] = useState<{ uri: string; name: string; type: string }>();
  const [preview, setPreview] = useState<{ uri: string }>();

  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const userId = useSelector((state: RootState) => state.user.userId);

  const chId = route.params.chId ? route.params.chId : '';
  const dispatch = useAppDispatch();

  console.log(chId);

  //..깊티만드는것처럼 임의로 userId : 1 사용해서 킾티 id가지고옴
  const onTempPath = async () => {
    const formData = new FormData();
    formData.append('file', image);
    const jsonData = {
      gifticonCode: 123456781234,
      gifticonPeriod: format(new Date(), 'yyyy-MM-dd'),

      gifticonStore: '인증샷',
      userId: 1,
    };
    // console.log(jsonData);
    await axios
      .post(`${Config.API_URL}/gifticon/info`, jsonData)
      .then(function (response) {
        console.log(111, response.data.data.gifticonId);
        onTempPath2(response.data.data.gifticonId, formData);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // 깊티아이디로 path 가지고옴 ...
  const onTempPath2 = async (id: number, formData: FormData) => {
    await axios
      .post(`${Config.API_URL}/gifticon/img/${id}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        console.log(112, response.data.data.gifticonPath);
        onComplete(response.data.data.gifticonPath);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onComplete = async (path) => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }

    const jsonData = {
      challengeDate: format(new Date(), 'yyyy-MM-dd'),
      challengeId: chId,
      challengePath: String(path),
      isConfirm: 0,
      userId: userId,
      voteCnt: 0,
    };
    // console.log(jsonData);
    await axios
      .post(`${Config.API_URL}/challenge/challengeAuth`, jsonData)
      .then(function (response) {
        console.log(response);
        // 실시간 상태관리용, 무지성 복붙할것
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        // 대기중
        // 올라갔습니다
        navigation.goBack();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // ImageCropPicker에서 crop된 사진을 resizing한 후 객체 형태(경로, 파일이름, 타입)로 이미지 파일 저장하는 메서드
  const onResponse = useCallback(async (response) => {
    console.log(response.width, response.height, response.exif);
    setPreview({ uri: `data:${response.mime};base64,${response.data}` });
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path, // 파일 경로
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
      // orientation === 3 ? -90 : 0, // 이미지 돌아가있을때
    ).then((r) => {
      console.log(r.uri, r.name);

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
        // type: 'image/jpeg',
      });
    });
  }, []);
  // 권한 설정 된 상태에서 카메라 촬영
  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      saveToPhotos: true,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);
  // 갤러리에서 사진 파일을 골라서 crop하는 메서드
  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <ScrollView>
        <View style={styles.orderId}>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              fontSize: 20,
              fontFamily: 'Regular',
            }}
          >
            {format(new Date(), 'yyyy-MM-dd')}
          </Text>
        </View>
        <View style={styles.preview}>
          {preview && <Image style={styles.previewImage} source={preview} />}
        </View>
        <View style={styles.buttonWrapper}>
          <Pressable style={styles.button} onPress={onTakePhoto}>
            <Text style={styles.buttonText}>이미지 촬영</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onChangeFile}>
            <Text style={styles.buttonText}>이미지 선택</Text>
          </Pressable>
          {/* 업로드시 버튼 광클 방지 로직 해보기   | 디스에이블, 로딩*/}
          <Pressable
            style={image ? styles.button : StyleSheet.compose(styles.button, styles.buttonDisabled)}
            onPress={onTempPath}
          >
            <Text style={styles.buttonText}>완료</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 2,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 2,
    resizeMode: 'contain',
    // resizeMode: 'cover','center',
  },
  buttonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: '#FFA401',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'Regular',
    fontSize: 15,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});

export default ChallengeCameraScreen;

// import {
//   NavigationProp,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import {LoggedInParamList} from '../../AppInner';
// import axios, {AxiosError} from 'axios';
// import Config from 'react-native-config';
// import {useSelector} from 'react-redux';
// import {RootState} from '../store/reducer';
// import orderSlice from '../slices/order';
// import {useAppDispatch} from '../store';

// function Complete() {

//   const route = useRoute<RouteProp<LoggedInParamList>>();
//   const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

//   const accessToken = useSelector((state: RootState) => state.user.accessToken);
