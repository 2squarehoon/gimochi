import React, { useState, useEffect, useRef } from 'react';
import { Text, ScrollView, Image, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  BottomSheet,
  Button,
  ListItem,
  Input,
  Tab,
  TabView,
  ThemeProvider,
  createTheme,
  Slider,
  SpeedDial,
  Dialog,
  Icon,
} from '@rneui/themed';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import { FlatGrid } from 'react-native-super-grid';
import FastImage from 'react-native-fast-image';

function ChallengeDetailScreen0({ route, navigation }) {
  const [time, setTime] = useState(new Date());
  const [caltime, setCalTime] = useState();
  const [visibleDialogF, setVisibleDialogF] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myChallenge, setMyChallenge] = useState([]); // 챌린지 정보
  const [usersInfo, setUsersInfo] = useState([]); // 챌린지 참여 목록
  const [usersInfoL, setUsersInfoL] = useState([]); // 챌린지 참여 종합목록
  const [inviteUsers, setInviteUsers] = useState([]); // 챌린지 초대장 보낸 유저목록
  // const [loadingF, setLoadingF] = useState(true);
  const [visibleDialogG, setVisibleDialogG] = useState(false);
  const [visibleAddG, setVisibleAddG] = useState(false);
  const [visibleListG, setVisibleListG] = useState(false);
  const [visibleDialogQ, setVisibleDialogQ] = useState(false);
  const [gifticons, setGifticons] = useState([]);
  const [chGifticons, setChGifticons] = useState([]);
  const [giftId, setGiftId] = useState('');
  const [giftPeriod, setGiftPeriod] = useState(new Date());
  const [myfollower, setMyfollower] = useState([]); // 친구목록
  const userId = useSelector((state: RootState) => state.user.userId);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const dispatch = useAppDispatch();
  const challengeId = route.params.challengeId;
  const toggleDialogQ = () => {
    setVisibleDialogQ(!visibleDialogQ);
  };
  const toggleDialogF = () => {
    setVisibleDialogF(!visibleDialogF);
  };

  const interval = useRef(null);
  useEffect(() => {
    console.log('1초');
    interval.current = setInterval(() => {
      // console.log(new Date());
      // console.log(SSTT - new Date() - 32400000);
      setTime(new Date());
      setCalTime(SSTT - new Date() - 32400000);
    }, 100000);
    // 타이머 컴포넌트가 언마운트 될 때 실행
    return () => clearInterval(interval.current);
  });
  // Start End Time 테스트용  !! 한국 표준시 9시간 빼줘야함 -32400000
  // 86400000 24시간 3600000 1시간  60000 1분  1000 1초
  const SSTT = new Date(); //useState로 만들기 .challengeStartDate
  // const EETT = new Date('2022-11-09');

  const dd = parseInt(caltime / 86400000);
  const d = parseInt(caltime / 86400000) + 1;
  var tt = caltime - dd * 86400000;
  const h = parseInt(tt / 3600000);
  var tt = caltime - dd * 86400000 - h * 3600000;
  const m = parseInt(tt / 60000);
  var tt = caltime - dd * 86400000 - h * 3600000 - m * 60000;
  const t = parseInt(tt / 1000);
  console.log(dd, h, m, t);

  const toggleDialogG = () => {
    setVisibleDialogG(!visibleDialogG);
  };
  const toggleAddG = () => {
    setVisibleAddG(!visibleAddG);
  };
  const toggleListG = () => {
    setVisibleListG(!visibleListG);
  };

  const goMain = () => {
    navigation.navigate('ChallengeMainScreen');
  };

  const godelete = () => {
    Alert.alert('진행중인 챌린지를 삭제하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => godelete2() },
    ]);
  };

  const godelete2 = async () => {
    await axios
      .delete(`${Config.API_URL}/challenge/${challengeId}`)
      .then(function (response) {
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        Alert.alert('챌린지 목록 화면으로 이동합니다.', '', [{ text: '확인', onPress: () => goMain() }]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const registerGift = (index) => {
    Alert.alert('기프티콘을 등록하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '네', onPress: () => registerGift2(index) },
    ]);
  };

  const registerGift2 = async (index) => {
    // setGiftPeriod(gifticons[index].gifticonPeriod);
    // setGiftId(gifticons[index].gifticonId);
    // console.log(gifticons[index].gifticonId);
    await axios
      .post(`${Config.API_URL}/challenge/rewardInfo`, {
        challengeId: challengeId,
        gifticonId: gifticons[index].gifticonId,
      })
      .then(function (response) {
        console.log('등록하기');
        console.log(response);
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const myFollow = async () => {
    await axios
      .get(`${Config.API_URL}/user/follower/` + userId)
      .then(function (response) {
        console.log(response.data.data);
        setMyfollower(response.data.data);
      })

      .catch(function (error) {
        console.log(error);
      })
      .finally(() => toggleDialogF());
  };

  const doInvite = async (id) => {
    const jsonData = {
      challengeId: challengeId,
      userId: id,
    };
    console.log(jsonData);
    await axios
      .post(`${Config.API_URL}/challenge/challengeInvite`, jsonData)
      .then(function (response) {
        console.log(response);
        // 실시간 상태관리용, 무지성 복붙할것
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/challenge/rewardInfo/${challengeId}}`)
      .then(function (response) {
        console.log('ttt1', response.data.data.gifticonList);
        setChGifticons(response.data.data.gifticonList);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${Config.API_URL}/gifticon/uid/${userId}`)
      .then(function (response) {
        console.log('ttt2', response.data.data);
        let temp = [];
        for (var i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].challengeRewardList.length === 0) {
            temp.push(response.data.data[i]);
          }
        }
        setGifticons(temp);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${Config.API_URL}/challenge/challengeInvite/userList/` + challengeId)
      .then(function (response) {
        // console.log('ttt3', response.data.data);
        setInviteUsers(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    async function myF() {
      await axios
        .all([
          axios.get(`${Config.API_URL}/challenge/` + challengeId),
          axios.get(`${Config.API_URL}/challenge/userList/` + challengeId),
        ])
        .then(
          axios.spread(async (response1, response2) => {
            console.log(response1.data.data);
            setMyChallenge(response1.data.data);
            console.log(response2.data.data);
            setUsersInfo(response2.data.data);
            let test = [];
            for (var i = 0; i < response2.data.data.length; i++) {
              await axios
                .get(`${Config.API_URL}/user/info/` + response2.data.data[i].userId)
                .then(function (response) {
                  console.log(response.data.data);
                  const temp = { ...response.data.data, ...response2.data.data[i] };
                  console.log(temp);
                  test.push(temp);
                  // console.log(usersInfoL);
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
            setUsersInfoL(test);
          }),
        )
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => setLoading(false));
    }
    myF();
  }, [reload]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              height: 80,
              paddingHorizontal: 20,
              marginTop: 10,
            }}
          >
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
              제목{'  '}:{'  '}
              {myChallenge.challengeTitle}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              height: 90,
              paddingHorizontal: 20,
              marginTop: -20,
            }}
          >
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
              기간{'  '}:{'  '}
              {myChallenge.challengeStartDate}
              {'  '}부터
            </Text>
            <Text style={{ marginLeft: 75, color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
              {myChallenge.challengeEndDate}
              {'  '}까지 매일
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 80,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
              설명{'  '}:{'  '}
              {myChallenge.challengeDescription}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 80,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }} onPress={() => myFollow()}>
              참가 인원 {usersInfo.length}명 {'  '}+친구초대하기+
            </Text>
            <Dialog
              overlayStyle={{ flex: 0.5, backgroundColor: '#FFE7BC', borderRadius: 20 }}
              isVisible={visibleDialogF}
              onBackdropPress={toggleDialogF}
            >
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
                  title='참가 현황'
                  containerStyle={{
                    borderRadius: 30,
                    backgroundColor: index == 0 ? 'white' : '#F6F6F6',
                    margin: 2,
                    height: 48,
                    padding: 0,
                  }}
                  titleStyle={{
                    fontSize: 24,
                    color: index == 0 ? '#FFA401' : '#686868',
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    fontWeight: '900',
                  }}
                />
                <Tab.Item
                  title='친구 목록'
                  containerStyle={{
                    borderRadius: 30,
                    backgroundColor: index == 1 ? 'white' : '#F6F6F6',
                    margin: 2,
                    height: 48,
                    padding: 0,
                  }}
                  titleStyle={{
                    fontSize: 24,
                    color: index == 1 ? '#FFA401' : '#686868',
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    fontWeight: '900',
                  }}
                />
              </Tab>

              <TabView value={index} onChange={setIndex} animationType='spring'>
                {index == 0 ? (
                  <TabView.Item style={{ width: '100%', height: 250, marginTop: 20 }}>
                    <ScrollView
                      style={{
                        paddingVertical: 10,
                        backgroundColor: '#efefef',
                        // marginHorizontal: 10,
                        borderRadius: 10,
                      }}
                    >
                      {usersInfoL.map((user, index) => (
                        <>
                          <ListItem containerStyle={{ backgroundColor: '#efefef' }}>
                            <Image
                              source={
                                user.userProfile
                                  ? {
                                      uri: user.userProfile,
                                    }
                                  : require('../../assets/images/homeMochi.png')
                              }
                              resizeMode='contain'
                              style={{ width: 40, height: 40, borderRadius: 100 }}
                            />

                            <ListItem.Content style={{ flex: 1, flexDirection: 'row' }}>
                              <ListItem.Title
                                style={{
                                  flex: 1,
                                  color: 'black',
                                  fontWeight: '900',
                                  fontSize: 18,
                                  fontFamily: 'Regular',
                                }}
                              >
                                {user.userNickname}
                              </ListItem.Title>

                              <ListItem.Title
                                style={{
                                  flex: 1,
                                  textAlign: 'right',
                                  color: 'green',
                                  fontWeight: '900',
                                  fontSize: 18,
                                  fontFamily: 'Regular',
                                }}
                              >
                                참가 완료
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        </>
                      ))}
                    </ScrollView>
                  </TabView.Item>
                ) : (
                  <TabView.Item></TabView.Item>
                )}
                {index == 1 ? (
                  <TabView.Item style={{ width: '100%', height: 250, marginTop: 20 }}>
                    <ScrollView
                      style={{
                        paddingVertical: 10,
                        backgroundColor: '#efefef',
                        // marginHorizontal: 10,
                        borderRadius: 10,
                      }}
                    >
                      {myfollower.map((myF, index) => (
                        <>
                          <ListItem containerStyle={{ backgroundColor: '#efefef' }}>
                            <Image
                              source={
                                myF.userProfile
                                  ? {
                                      uri: myF.userProfile,
                                    }
                                  : require('../../assets/images/homeMochi.png')
                              }
                              resizeMode='contain'
                              style={{ width: 40, height: 40, borderRadius: 100 }}
                            />

                            <ListItem.Content style={{ flex: 1, flexDirection: 'row' }}>
                              <ListItem.Title
                                style={{
                                  flex: 1,
                                  color: 'black',
                                  fontWeight: '900',
                                  fontSize: 18,
                                  fontFamily: 'Regular',
                                }}
                              >
                                {myF.userName}
                              </ListItem.Title>
                              <ListItem.Title
                                style={{
                                  flex: 1,
                                  textAlign: 'right',
                                  color: 'green',
                                  fontWeight: '900',
                                  fontSize: 18,
                                  fontFamily: 'Regular',
                                }}
                              >
                                {inviteUsers.findIndex((e) => e.userId === myF.userId) === -1 ? (
                                  <Text onPress={() => doInvite(myF.userId)}>초대하기</Text>
                                ) : (
                                  <Text style={{ color: 'red' }}>취소하기</Text>
                                )}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        </>
                      ))}
                    </ScrollView>
                  </TabView.Item>
                ) : (
                  <TabView.Item></TabView.Item>
                )}
              </TabView>
            </Dialog>
          </View>

          {myChallenge.challengeRewardType === 1 ? (
            <View
              style={{
                flexDirection: 'row',
                height: 80,
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
                누적 상금확인{'  '}:{'  '}
                {myChallenge.challengeRewardPoint}P
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                height: 100,
                paddingHorizontal: 20,
              }}
            >
              <Text
                onPress={() => toggleListG()}
                style={{ color: 'black', fontSize: 25, fontFamily: 'Regular' }}
              >
                기프티콘 목록
              </Text>

              <Dialog
                overlayStyle={{ backgroundColor: '#FFE7BC', borderRadius: 20 }}
                isVisible={visibleListG}
                onBackdropPress={toggleListG}
              >
                <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Regular', textAlign: 'center' }}>
                  등록된 기프티콘 목록
                </Text>
                <Icon
                  onPress={() => toggleAddG()}
                  name='add'
                  type='material'
                  color='#FFA401'
                  size={25}
                  iconStyle={{ fontSize: 43 }}
                />

                <FlatGrid
                  itemDimension={95}
                  data={chGifticons.filter((gifticon) => !gifticon.gifticonUsed)}
                  style={{}}
                  spacing={5}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      {/* <FastImage source={{ uri: item.gifticonPath }} style={{ width: 80, height: 80 }} /> */}
                      <Text style={{ color: 'black', fontFamily: 'Regular' }}>{item.gifticonPeriod}</Text>
                      <Text style={{ color: 'black', fontFamily: 'Regular' }}>{item.gifticonStore}</Text>
                    </TouchableOpacity>
                  )}
                />
              </Dialog>

              <Dialog
                overlayStyle={{ backgroundColor: '#FFE7BC', borderRadius: 20 }}
                isVisible={visibleAddG}
                onBackdropPress={toggleAddG}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    color: 'black',
                    fontSize: 25,
                    fontFamily: 'Regular',
                    textAlign: 'center',
                  }}
                >
                  나의 기프티콘 목록
                </Text>

                <FlatGrid
                  itemDimension={95}
                  data={gifticons.filter((gifticon) => !gifticon.gifticonUsed)}
                  style={{}}
                  spacing={5}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => registerGift(index)}>
                      <FastImage source={{ uri: item.gifticonPath }} style={{ width: 80, height: 80 }} />
                      <Text style={{ color: 'black', fontFamily: 'Regular' }}>{item.gifticonPeriod}</Text>
                      <Text style={{ color: 'black', fontFamily: 'Regular' }}>{item.gifticonStore}</Text>
                    </TouchableOpacity>
                  )}
                />
              </Dialog>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              height: 80,
              marginTop: 0,
              paddingHorizontal: 20,
            }}
          >
            <Text
              onPress={() => toggleDialogQ()}
              style={{ fontSize: 25, color: 'black', fontFamily: 'Regular' }}
            >
              인증 방법
            </Text>
          </View>
          <Dialog
            isVisible={visibleDialogQ}
            onBackdropPress={toggleDialogQ}
            overlayStyle={{ height: 400, backgroundColor: '#FFE7BC', flex: 0.4, borderRadius: 20 }}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 25,
                fontFamily: 'Regular',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              인증 방법
            </Text>
            <View
              style={{
                padding: 20,
                backgroundColor: '#efefef',
                marginBottom: 10,
                marginHorizontal: 10,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                  marginBottom: 5,
                }}
              >
                0. 매일 하루 한번씩 인증하기
              </Text>

              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                1. 인증샷은 챌린지 참여자들의
              </Text>

              <Text
                style={{
                  marginBottom: 5,
                  paddingLeft: 15,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                과반수 투표로 인증 됩니다.
              </Text>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                2. 도용을 금지 합니다.
              </Text>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                3. 다른 사람 것 만 투표합니다.
              </Text>

              <Text
                style={{
                  marginBottom: 5,

                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                4. 투표는 취소가 안됩니다.
              </Text>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                5. 사진은 식별 가능하게
              </Text>
            </View>
          </Dialog>
          <View
            style={{
              flexDirection: 'row',
              height: 80,
              paddingHorizontal: 20,
              marginBottom: 0,
              marginTop: -10,
            }}
          >
            <Text
              style={{ fontSize: 25, color: 'black', fontFamily: 'Regular', textAlign: 'right', flex: 1 }}
            >
              {/* {d} {h} {m} {t} @@@ */}
              {d > 0 ? (
                <Text>{d ? d : ''}일 후 자동시작</Text>
              ) : h > 0 ? (
                <Text>{h ? h : ''}시간 후 자동시작</Text>
              ) : m > 0 ? (
                <Text>{m ? m : ''}분 후 자동시작</Text>
              ) : t > 0 ? (
                <Text>{t ? t : ''}초 후 자동시작</Text>
              ) : (
                <Text onPress={goMain}>메인으로 가기</Text>
              )}
            </Text>
          </View>
        </ScrollView>
        <Icon
          name='delete'
          type='material'
          color='#FFE7BC'
          size={25}
          reverse
          reverseColor='#FFA401'
          onPress={() => godelete()}
          iconStyle={{ fontSize: 33 }}
          containerStyle={{ position: 'absolute', top: '85%', left: '5%' }}
        />
      </View>
    );
  }
}

export default ChallengeDetailScreen0;
