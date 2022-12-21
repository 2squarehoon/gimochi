/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { Text, Pressable, StyleSheet, Dimensions, Alert } from 'react-native';
import BarcodeCreatorViewManager, { BarcodeFormat } from 'react-native-barcode-creator';
import axios from 'axios';
import Config from 'react-native-config';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import { chiunGifticonCount } from '../../api/API';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';

function GifticonBarcodeScreen({ route, navigation }) {
  const code = route.params.code;
  const id = route.params.gifticonId;
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useAppDispatch();

  const checkUseGifticon = (id: string) => {
    Alert.alert('기프티콘을 사용하시겠습니까?', '', [
      { text: '아니오', style: 'cancel', onPress: () => navigation.goBack() },
      { text: '네', onPress: () => useGifticon(id) },
    ]);
  };

  const useGifticon = async (id: string) => {
    await axios
      .put(`${Config.API_URL}/gifticon/used/${userId}/${id}`)
      .then(function (response) {
        console.log(response);
        chiunGifticonCount(userId);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
      })
      .catch(function (error) {
        console.log(error);
      });
    navigation.goBack();
  };

  return (
    <>
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}
        onPress={() => checkUseGifticon(id)}
      />
      <BarcodeCreatorViewManager
        value={code}
        background={'#ffffff'}
        foregroundColor={'#000000'}
        format={BarcodeFormat.CODE128}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.2,
          position: 'absolute',
          bottom: '40%',
          backgroundColor: 'white',
        }}
      />
    </>
  );
}

export default GifticonBarcodeScreen;
