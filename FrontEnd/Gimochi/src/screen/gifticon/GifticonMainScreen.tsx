/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FlatGrid } from 'react-native-super-grid';
import FastImage from 'react-native-fast-image';
import { Tab, Icon, TabView, ThemeProvider, createTheme } from '@rneui/themed';
import Modal from 'react-native-modal';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import { chiunGifticonCount, chiunGifticonMinus } from '../../api/API';

function GifticonMainScreen({ navigation }) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const [usedGifticons, setUsedGifticons] = useState([]);
  const [newGifticons, setNewGifticons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState(false);
  const [period, setPeriod] = useState(new Date());
  const [store, setStore] = useState('');
  const [id, setId] = useState('');
  const [path, setPath] = useState('');
  const [code, setCode] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/gifticon/uid/${userId}`)
      .then(function (response) {
        console.log(response);
        const newData = [];
        const usedData = [];
        response.data.data.forEach((gifticon, i) => {
          if (gifticon.gifticonUsed) {
            usedData.push(gifticon);
          } else if (response.data.data[i].challengeRewardList.length === 0) {
            newData.push(gifticon);
          }
        });
        setNewGifticons(newData);
        setUsedGifticons(usedData);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, [reload]);

  const goUpload = () => {
    navigation.navigate('GifticonUploadScreen');
  };

  const goNewGifticonDetail = (index) => {
    setPeriod(newGifticons[index].gifticonPeriod);
    setStore(newGifticons[index].gifticonStore);
    setId(newGifticons[index].gifticonId);
    setPath(newGifticons[index].gifticonPath);
    setCode(newGifticons[index].gifticonCode);
    setModal(true);
    console.log(newGifticons[index].gifticonPath);
  };

  const goUsedGifticonDetail = (index) => {
    setPeriod(usedGifticons[index].gifticonPeriod);
    setStore(usedGifticons[index].gifticonStore);
    setId(usedGifticons[index].gifticonId);
    setPath(usedGifticons[index].gifticonPath);
    setModal(true);
    console.log(usedGifticons[index].gifticonPath);
  };

  const useGifticon = async (id: string, index: number) => {
    await axios
      .put(`${Config.API_URL}/gifticon/used/${userId}/${id}`)
      .then(function (response) {
        console.log(response);
        if (index === 0) {
          chiunGifticonCount(userId);
        } else {
          chiunGifticonMinus(userId);
        }
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        setModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const goBarcode = () => {
    setModal(false);
    navigation.navigate('GifticonBarcodeScreen', { code: code, gifticonId: id });
  };

  const deleteGifticon = async (id) => {
    await axios
      .delete(`${Config.API_URL}/gifticon/${userId}/${id}`)
      .then(function (response) {
        console.log(response);
        chiunGifticonCount(userId);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        setModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteButton = (id: string) => {
    Alert.alert('기프티콘을 삭제하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => deleteGifticon(id) },
    ]);
  };

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  return (
    <EntireContainer>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          height: 0,
        }}
        style={{
          borderRadius: 31,
          backgroundColor: '#F6F6F6',
          marginTop: 21,
          marginHorizontal: 10,
          height: 52,
        }}
        variant='primary'
      >
        <Tab.Item
          title='미사용'
          containerStyle={{
            borderRadius: 30,
            backgroundColor: index == 0 ? 'white' : '#F6F6F6',
            margin: 2,
            height: 48,
            padding: 0,
            justifyContent: 'center',
          }}
          titleStyle={{
            fontSize: 24,
            color: index == 0 ? '#FFA401' : '#686868',
            paddingHorizontal: 0,
            paddingVertical: 0,
            fontFamily: 'Regular',
          }}
        />
        <Tab.Item
          title='사용 완료'
          containerStyle={{
            borderRadius: 30,
            backgroundColor: index == 1 ? 'white' : '#F6F6F6',
            margin: 2,
            height: 48,
            padding: 0,
            justifyContent: 'center',
          }}
          titleStyle={{
            fontSize: 24,
            color: index == 1 ? '#FFA401' : '#686868',
            paddingHorizontal: 0,
            paddingVertical: 0,
            fontFamily: 'Regular',
          }}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType='spring'>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <FlatGrid
            itemDimension={140}
            data={newGifticons}
            style={{}}
            spacing={10}
            renderItem={({ item, index }) => (
              <GifticonItemContainer onPress={() => goNewGifticonDetail(index)}>
                <FastImage source={{ uri: item.gifticonPath }} style={{ width: 80, height: 80 }} />
                <GifticonItemText>{item.gifticonPeriod}</GifticonItemText>
                <GifticonItemText>{item.gifticonStore}</GifticonItemText>
              </GifticonItemContainer>
            )}
          />
        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <FlatGrid
            itemDimension={130}
            data={usedGifticons}
            style={{}}
            spacing={10}
            renderItem={({ item, index }) => (
              <GifticonItemContainer onPress={() => goUsedGifticonDetail(index)}>
                <FastImage
                  source={{ uri: item.gifticonPath }}
                  style={{ width: 80, height: 80 }}
                  resizeMode='contain'
                />
                <GifticonItemText>{item.gifticonPeriod}</GifticonItemText>
                <GifticonItemText>{item.gifticonStore}</GifticonItemText>
              </GifticonItemContainer>
            )}
          />
        </TabView.Item>
      </TabView>
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
        <ModalContainer>
          {index === 0 ? (
            <TouchableOpacity onPress={() => goBarcode()}>
              <FastImage
                source={{ uri: path }}
                style={{ width: 150, height: 200, marginBottom: '3%', marginTop: '5%' }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          ) : (
            <FastImage
              source={{ uri: path }}
              style={{ width: 150, height: 200, marginBottom: '3%', marginTop: '5%' }}
              resizeMode='contain'
            />
          )}
          <ModalText>{period}</ModalText>
          <ModalText>{store}</ModalText>
          <ModalButtonContainer>
            <ModalButton onPress={() => useGifticon(id, index)}>
              {index === 0 ? (
                <ModalButtonText>사용완료</ModalButtonText>
              ) : (
                <ModalButtonText>사용취소</ModalButtonText>
              )}
            </ModalButton>
            <ModalButton onPress={() => deleteButton(id)}>
              <ModalButtonText>삭제하기</ModalButtonText>
            </ModalButton>
          </ModalButtonContainer>
        </ModalContainer>
      </Modal>

      <CreateButton onPress={goUpload}>
        <FontAwesomeIcon icon={faCirclePlus} size={50} color={'#ffa401'} />
      </CreateButton>
    </EntireContainer>
  );
}

const EntireContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const CreateButton = styled.TouchableOpacity`
  position: absolute;
  left: 80%;
  top: 85%;
`;

const GifticonItemContainer = styled.TouchableOpacity`
  align-items: center;
`;

const GifticonItemText = styled.Text`
  font-family: 'Regular';
  color: #000000;
`;

const ModalContainer = styled.View`
  margin: 15%;
  width: 70%;
  height: 55%;
  background-color: #ffe7bc;
  border-radius: 15px;
  border: 1px solid #000;
  align-items: center;
`;

const ModalText = styled.Text`
  font-family: 'Regular';
  font-size: 15px;
  margin: 2%;
  color: #000000;
`;

const ModalButtonContainer = styled.View`
  flex-direction: row;
  height: 15%;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: #ffa401;
  width: 30%;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 5%;
`;
const ModalButtonText = styled.Text`
  color: #ffffff;
  font-family: 'Regular';
`;

export default GifticonMainScreen;
