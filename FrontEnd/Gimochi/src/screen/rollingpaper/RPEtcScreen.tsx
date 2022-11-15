/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMessage, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../store';
import screenSlice from '../../slices/screen';

function RPEtcScreen({ navigation, route }) {
  const sessionId: number = route.params.RPId;
  const sessionTypeId: number = route.params.sessionTypeId;
  const reload = useSelector((state: RootState) => state.reload.reload);
  const [messageList, setMessageList] = useState([]);
  const [modal, setModal] = useState<boolean>(false);
  const [nickname, setNickname] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
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
  console.log(page);

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/session/${sessionId}`)
      .then(function (response) {
        console.log(response);
        const lst = response.data.data.sessionMessageResDtoList;
        if (lst.length <= 30) {
          setMessageList(lst);
        } else {
          // 30번째 인자까지만 리스트에 넣는 자바스크립트 문법이 뭐지
          setMessageList(lst);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, [reload]);

  const goMessageDetail = (index: number) => {
    // setIdx(index);
    setNickname(messageList[index].nickname);
    setText(messageList[index].field);
    setModal(true);
  };

  const onPress = () => {
    navigation.navigate('RPMessageWriteScreen', { RPId: sessionId, type: sessionTypeId });
  };

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <RPDetailContainer>
      <ImageBackground
        source={require('../../assets/images/christmas1.jpg')}
        style={{ width: '100%', height: '100%' }}
        imageStyle={{ opacity: 0.5 }}
      >
        <Text>{sessionId}번 추카포카</Text>
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
            <ModalTitleText>{nickname}님이 보낸 선물</ModalTitleText>
            <ModalGifticonContainer>
              <ModalText>대충 선물</ModalText>
            </ModalGifticonContainer>
            <ModalTitleText>{nickname}님이 보낸 메시지</ModalTitleText>
            <ModalTextContainer>
              <ModalText>{text}</ModalText>
            </ModalTextContainer>
          </ModalContainer>
        </Modal>
      </ImageBackground>
      <CreateButton onPress={onPress}>
        <FontAwesomeIcon icon={faMessage} size={50} color={'#ffa401'} />
      </CreateButton>
      {!(page === 0) && (
        <LeftButton onPress={() => setPage(page - 1)}>
          <FontAwesomeIcon icon={faChevronLeft} size={30} color={'#ffa401'} />
        </LeftButton>
      )}
      {!(page === 2) && (
        <RightButton onPress={() => setPage(page + 1)}>
          <FontAwesomeIcon icon={faChevronRight} size={30} color={'#ffa401'} />
        </RightButton>
      )}
      {messageList[0 + page * 10] && (
        <Image1Container onPress={() => goMessageDetail(0 + page * 10)}>
          <Image1
            source={
              messageList[0 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[0 + page * 10].messageType === 2
                ? require('../../assets/images/attendMochi.png')
                : messageList[0 + page * 10].messageType === 3
                ? require('../../assets/images/challengeMochi.png')
                : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image1Container>
      )}
      {messageList[1 + page * 10] && (
        <Image2Container onPress={() => goMessageDetail(1 + page * 10)}>
          <Image2
            source={
              messageList[1 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[1 + page * 10].messageType === 2
                ? require('../../assets/images/attendMochi.png')
                : messageList[1 + page * 10].messageType === 3
                ? require('../../assets/images/challengeMochi.png')
                : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image2Container>
      )}
      {messageList[2 + page * 10] && (
        <Image3Container onPress={() => goMessageDetail(2 + page * 10)}>
          <Image3
            source={
              messageList[2 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[2 + page * 10].messageType === 2
                ? require('../../assets/images/attendMochi.png')
                : messageList[3 + page * 10].messageType === 3
                ? require('../../assets/images/challengeMochi.png')
                : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image3Container>
      )}
      {messageList[3 + page * 10] && (
        <Image4Container onPress={() => goMessageDetail(3 + page * 10)}>
          <Image4
            source={
              messageList[3 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[3 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[3 + page * 10].messageType === 3
                    ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image4Container>
      )}
      {messageList[4 + page * 10] && (
        <Image5Container onPress={() => goMessageDetail(4 + page * 10)}>
          <Image5
            source={
              messageList[4 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[4 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[4 + page * 10].messageType === 3
                    ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image5Container>
      )}
      {messageList[5 + page * 10] && (
        <Image6Container onPress={() => goMessageDetail(5 + page * 10)}>
          <Image6
            source={
              messageList[5 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[5 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[5 + page * 10].messageType === 3
                    ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image6Container>
      )}
      {messageList[6 + page * 10] && (
        <Image7Container onPress={() => goMessageDetail(6 + page * 10)}>
          <Image7
            source={
              messageList[6 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[6 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[6 + page * 10].messageType === 3
                    ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image7Container>
      )}
      {messageList[7 + page * 10] && (
        <Image8Container onPress={() => goMessageDetail(7 + page * 10)}>
          <Image8
            source={
              messageList[7 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[7 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[7 + page * 10].messageType === 3
                ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image8Container>
      )}
      {messageList[8 + page * 10] && (
        <Image9Container onPress={() => goMessageDetail(8 + page * 10)}>
          <Image9
            source={
              messageList[8 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[8 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[8 + page * 10].messageType === 3
                    ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image9Container>
      )}
      {messageList[9 + page * 10] && (
        <Image10Container onPress={() => goMessageDetail(9 + page * 10)}>
          <Image10
            source={
              messageList[9 + page * 10].messageType === 1
                ? require('../../assets/images/homeMochi.png')
                : messageList[9 + page * 10].messageType === 2
                  ? require('../../assets/images/attendMochi.png')
                  : messageList[9 + page * 10].messageType === 3
                    ? require('../../assets/images/challengeMochi.png')
                    : require('../../assets/images/playMochi.png')
            }
            resizeMode='contain'
          />
        </Image10Container>
      )}
    </RPDetailContainer>
  );
}

const RPDetailContainer = styled.View`
  background-color: #ffffff;
  flex: 1;
`;

const CreateButton = styled.TouchableOpacity`
  position: absolute;
  left: 320px;
  top: 480px;
`;

const ModalContainer = styled.View`
  margin: 15%;
  width: 70%;
  height: 65%;
  background-color: #ffe7bc;
  border-radius: 15px;
  border: 1px solid #000;
  align-items: center;
`;

const ModalTitleText = styled.Text`
  margin: 5% auto 5% 10%;
  font-family: 'Regular';
  font-size: 15px;
`;

const ModalTextContainer = styled.View`
  background-color: #ffffff;
  width: 80%;
  height: 60%;
  border-radius: 10px;
`;

const ModalGifticonContainer = styled.View`
  background-color: #ffffff;
  width: 80%;
  border-radius: 10px;
  height: 10%;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-family: 'Regular';
  font-size: 12px;
  margin: 3%;
`;

const LeftButton = styled.TouchableOpacity`
  position: absolute;
  left: 5%;
  top: 40%;
`;

const RightButton = styled.TouchableOpacity`
  position: absolute;
  left: 90%;
  top: 40%;
`;

const Image1Container = styled.TouchableOpacity`
  position: absolute;
  left: 40%;
  bottom: 80%;
  width: 18%;
  height: 18%;
`;

const Image1 = styled.Image`
  width: 100%;
`;

const Image2Container = styled.TouchableOpacity`
  position: absolute;
  left: 28%;
  bottom: 62%;
  width: 18%;
  height: 18%;
`;

const Image2 = styled.Image`
  width: 100%;
`;

const Image3Container = styled.TouchableOpacity`
  position: absolute;
  left: 52%;
  bottom: 62%;
  width: 18%;
  height: 18%;
`;

const Image3 = styled.Image`
  width: 100%;
`;

const Image4Container = styled.TouchableOpacity`
  position: absolute;
  left: 17%;
  bottom: 44%;
  width: 18%;
  height: 18%;
`;

const Image4 = styled.Image`
  width: 100%;
`;

const Image5Container = styled.TouchableOpacity`
  position: absolute;
  left: 40%;
  bottom: 44%;
  width: 18%;
  height: 18%;
`;

const Image5 = styled.Image`
  width: 100%;
`;

const Image6Container = styled.TouchableOpacity`
  position: absolute;
  left: 65%;
  bottom: 44%;
  width: 18%;
  height: 18%;
`;

const Image6 = styled.Image`
  width: 100%;
`;

const Image7Container = styled.TouchableOpacity`
  position: absolute;
  left: 4%;
  bottom: 26%;
  width: 18%;
  height: 18%;
`;

const Image7 = styled.Image`
  width: 100%;
`;

const Image8Container = styled.TouchableOpacity`
  position: absolute;
  left: 28%;
  bottom: 26%;
  width: 18%;
  height: 18%;
`;

const Image8 = styled.Image`
  width: 100%;
`;

const Image9Container = styled.TouchableOpacity`
  position: absolute;
  left: 52%;
  bottom: 26%;
  width: 18%;
  height: 18%;
`;

const Image9 = styled.Image`
  width: 100%;
`;

const Image10Container = styled.TouchableOpacity`
  position: absolute;
  left: 76%;
  bottom: 26%;
  width: 18%;
  height: 18%;
`;

const Image10 = styled.Image`
  width: 100%;
`;

export default RPEtcScreen;
