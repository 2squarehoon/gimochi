/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { RPNavigationProps } from '../../navigation/RPNavigation';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePlus, faCalendar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import screenSlice from '../../slices/screen';

function RPMainScreen({ navigation }: RPNavigationProps) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const userNickname = useSelector((state: RootState) => state.user.userNickname);
  const [myRPList, setMyRPList] = useState([]);
  // useEffect쓸때 [reload] 무지성 복붙할것
  const reload = useSelector((state: RootState) => state.reload.reload);
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
      .get(`${Config.API_URL}/session/user/${userId}`)
      .then(function (response) {
        console.log(response.data.data.sessionDetailResDtoList);
        setMyRPList(response.data.data.sessionDetailResDtoList);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [reload]);

  const goDetail = (id: number, sessionTypeId: number, name: string) => {
    if (sessionTypeId === 1) {
      navigation.navigate('RPBirthdayScreen', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        userId: userId,
        userName: userNickname,
      });
    } else if (sessionTypeId === 2) {
      navigation.navigate('RPGraduateScreen', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        userId: userId,
        userName: userNickname,
      });
    } else if (sessionTypeId === 3) {
      navigation.navigate('RPChristmasScreen', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        userId: userId,
        userName: userNickname,
      });
    } else {
      navigation.navigate('RPEtcScreen', {
        RPId: id,
        sessionTypeId: sessionTypeId,
        name: name,
        userId: userId,
        userName: userNickname,
      });
    }
  };

  const goWrite = () => {
    navigation.navigate('RPWriteScreen');
  };

  return (
    <RPContainer>
      <ScrollView>
        <RPTitleContainer>
          <RPTitle>{userNickname}님의 추카포카</RPTitle>
        </RPTitleContainer>
        <RPListContainer>
          {myRPList.map((RP, index) => (
            <RPItemButton key={index} onPress={() => goDetail(RP.sessionId, RP.sessionTypeId, RP.name)}>
              <RPItemContainer>
                <FontAwesomeIcon icon={faCalendar} size={20} style={{ marginLeft: '3%' }} />
                <RPListText>{RP.anniversary}</RPListText>
                {RP.sessionTypeId === 1 && <RPListText>생일</RPListText>}
                {RP.sessionTypeId === 2 && <RPListText>졸업</RPListText>}
                {RP.sessionTypeId === 3 && <RPListText>크리스마스</RPListText>}
                {RP.sessionTypeId === 4 && <RPListText>설날</RPListText>}
                {RP.sessionTypeId === 5 && <RPListText>{RP.name}</RPListText>}
              </RPItemContainer>
            </RPItemButton>
          ))}
        </RPListContainer>
      </ScrollView>
      <CreateButton onPress={goWrite}>
        <FontAwesomeIcon icon={faCirclePlus} size={50} color={'#ffa401'} />
      </CreateButton>
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

const RPListContainer = styled.View`
  margin: 3%;
`;

const RPItemButton = styled.TouchableOpacity``;

const RPItemContainer = styled.View`
  align-items: center;
  flex-direction: row;
  border-radius: 10px;
  background-color: #ffe7bc;
  margin: 2%;
  height: 50px;
  elevation: 10;
`;

const RPListText = styled.Text`
  font-family: 'Regular';
  font-size: 20px;
  margin-left: 5%;
  color: #000000;
`;

const CreateButton = styled.TouchableOpacity`
  position: absolute;
  left: 80%;
  top: 85%;
`;

export default RPMainScreen;
