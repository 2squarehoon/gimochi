import React, { useState, useEffect } from 'react';
import { Alert, Text, Image, ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BottomSheet,
  Divider,
  Button,
  ListItem,
  Slider,
  Input,
  Tab,
  TabView,
  ThemeProvider,
  createTheme,
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

function ChallengeDetailScreen1({ route, navigation }) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const [visibleDialogQ, setVisibleDialogQ] = useState(false);
  const [visibleDialogF, setVisibleDialogF] = useState(false);
  const [visibleDialogG, setVisibleDialogG] = useState(false);
  const [visibleListG, setVisibleListG] = useState(false);
  const [myAuthLists, setMyAuthLists] = useState(false);
  const [allAuthLists, setAllAuthLists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myChallenge, setMyChallenge] = useState([]); // 챌린지 정보
  const [totalDay, setTotalDay] = useState(0); // 챌린지 정보 날짜 총
  const [usersInfo, setUsersInfo] = useState([]); // 챌린지 참여 목록
  const [myInfo, setMyInfo] = useState([]); // 챌린지 내 순위 기록
  const [chGifticons, setChGifticons] = useState([]);
  const challengeId = route.params.challengeId;
  // const challengeId = 16;

  const toggleDialogQ = () => {
    setVisibleDialogQ(!visibleDialogQ);
  };
  const toggleDialogF = () => {
    setVisibleDialogF(!visibleDialogF);
  };
  const toggleDialogG = () => {
    setVisibleDialogG(!visibleDialogG);
  };
  const toggleListG = () => {
    setVisibleListG(!visibleListG);
  };

  const interpolate = (start: number, end: number) => {
    let k = (successRate(myInfo.successCnt) - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  const goCamera = (id) => {
    navigation.navigate('ChallengeCameraScreen', { chId: id }); //adasd[0].id
  };

  const successRate = (cnt) => {
    const temp = (100 * cnt) / totalDay;
    return Math.round(temp);
  };

  const onVote = (cAuthId, uId) => {
    const jsonData = {
      authUserId: uId,
      challengeAuthId: cAuthId,
      voteUserId: userId,
    };
    axios
      .put(`${Config.API_URL}/challenge/vote`, jsonData)
      .then(function (response) {
        console.log(response);
        // 실시간 상태관리용, 무지성 복붙할것
        dispatch(
          reloadSlice.actions.setReload({
            reload: String(new Date()),
          }),
        );
        //  큰화면 보여주고 하면 더좋음
        Alert.alert('인증 확인 되었습니다.');
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert('이미 인증했거나 본인에게 투표 할 수 없습니다.');
      });
  };

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/challenge/challengeAuth/${challengeId}`)
      .then(function (response) {
        setAllAuthLists(response.data.data);
        let temp = [];
        for (var i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].userId === userId) {
            temp.push(response.data.data[i]);
          }
        }
        setMyAuthLists(temp);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${Config.API_URL}/challenge/rewardInfo/${challengeId}}`)
      .then(function (response) {
        // console.log('ttt', response.data.data.gifticonList);
        setChGifticons(response.data.data.gifticonList);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${Config.API_URL}/challenge/challengeInfo/rank/${challengeId}/${userId}`)
      .then(function (response) {
        console.log(response.data.data);
        setMyInfo(response.data.data);
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
            // console.log(response1.data.data);
            setMyChallenge(response1.data.data);
            const temp =
              new Date(response1.data.data.challengeEndDate) -
              new Date(response1.data.data.challengeStartDate);
            const result = parseInt(temp / 86400000);
            setTotalDay(result + 1);
            //             var arr = [];
            // for(var i = 0; i < result + 1; i++) {
            // 		arr.push(i);
            // }
            let temp2 = response2.data.data.sort((a, b) => b.successCnt - a.successCnt);
            // console.log('ttt', response2.data.data);
            // console.log(temp2);
            setUsersInfo(temp2);
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
      <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
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
            marginBottom: 11,
            marginHorizontal: 10,
            height: 52,
          }}
          variant='primary'
        >
          <Tab.Item
            title='달성률'
            containerStyle={{
              borderRadius: 30,
              backgroundColor: index == 0 ? 'white' : '#F6F6F6',
              margin: 2,
              height: 48,
              padding: 0,
            }}
            // buttonStyle={{}}
            titleStyle={{
              fontSize: 24,
              color: index == 0 ? '#FFA401' : '#686868',
              paddingHorizontal: 0,
              paddingVertical: 0,
              fontWeight: '900',
            }}
          />
          <Tab.Item
            title='인증샷'
            containerStyle={{
              borderRadius: 30,
              backgroundColor: index == 1 ? 'white' : '#F6F6F6',
              margin: 2,
              height: 48,
              padding: 0,
            }}
            // buttonStyle={{}}
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
          <TabView.Item style={{ paddingHorizontal: 15, backgroundColor: 'white', width: '100%' }}>
            <ScrollView>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: '900',
                      fontSize: 20,
                      fontFamily: 'Regular',
                    }}
                  >
                    제목{'  '}:{'  '}
                    {myChallenge.challengeTitle}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: '#FFA401',
                      fontWeight: '900',
                      fontSize: 20,
                      fontFamily: 'Regular',
                      paddingRight: 10,
                    }}
                  >
                    달성률 {successRate(myInfo.successCnt)}%
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: '#686868',
                  fontWeight: '300',
                  fontSize: 14,
                  fontFamily: 'Regular',
                }}
              >
                설명{'  '}:{'  '}
                {myChallenge.challengeDescription}
              </Text>
              <Text
                style={{
                  color: '#686868',
                  fontWeight: '300',
                  fontSize: 14,
                  fontFamily: 'Regular',
                }}
              >
                {myChallenge.challengeStartDate} ~ {myChallenge.challengeEndDate}
              </Text>

              <Text
                style={{
                  color: '#686868',
                  fontWeight: '300',
                  fontSize: 14,
                  fontFamily: 'Regular',
                }}
              >
                최대 100%까지 달성 가능 | 1등으로 상품을 노려보세요!
              </Text>

              <Icon
                name='flag-checkered'
                type='font-awesome-5'
                size={40}
                color='black'
                containerStyle={{ bottom: 40, left: 160 }}
              />
              <View style={{ marginTop: -40, width: '95%', justifyContent: 'center', alignItems: 'stretch' }}>
                <Slider
                  value={successRate(myInfo.successCnt)}
                  // onValueChange={setValue}
                  maximumValue={100}
                  minimumValue={0}
                  // step={1}
                  // allowTouchTrack
                  trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                  thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                  thumbProps={{
                    children: (
                      <Icon
                        name='circle'
                        type='font-awesome'
                        size={20}
                        containerStyle={{ bottom: 0, right: 0 }}
                        color={color()}
                      />
                    ),
                  }}
                />
              </View>
              <Divider width={1} style={{ marginVertical: 10, height: 2, width: '98%' }} />

              <View style={{ marginVertical: 5, flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#686868',
                      fontWeight: '300',
                      fontSize: 14,
                      fontFamily: 'Regular',
                    }}
                  >
                    인증 성공
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#686868',
                      fontWeight: '300',
                      fontSize: 14,
                      fontFamily: 'Regular',
                      textAlign: 'center',
                    }}
                  >
                    인증 대기
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#686868',
                      fontWeight: '300',
                      fontSize: 14,
                      fontFamily: 'Regular',
                      textAlign: 'center',
                    }}
                  >
                    남은 인증
                  </Text>
                </View>
              </View>
              <View style={{ marginVertical: 5, marginBottom: 10, flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'black',
                      fontWeight: '300',
                      fontSize: 22,
                      fontFamily: 'Regular',
                    }}
                  >
                    {myInfo.successCnt} 개
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: '300',
                      fontSize: 22,
                      fontFamily: 'Regular',
                      textAlign: 'center',
                    }}
                  >
                    {myInfo.totalCnt - myInfo.successCnt} 개
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: '300',
                      fontSize: 22,
                      fontFamily: 'Regular',
                      textAlign: 'center',
                    }}
                  >
                    {totalDay - myInfo.totalCnt} 개
                  </Text>
                </View>
              </View>

              <View>
                <FlatGrid
                  itemDimension={80}
                  data={myAuthLists}
                  style={{}}
                  spacing={10}
                  renderItem={({ item, index }) => (
                    <View style={{ alignItems: 'center' }}>
                      <FastImage source={{ uri: item.challengePath }} style={{ width: 80, height: 80 }}>
                        {item.isConfirm === 1 && (
                          <Icon
                            name='done'
                            type='material'
                            color='green'
                            size={55}
                            iconStyle={{ fontSize: 55 }}
                            containerStyle={{
                              display: 'flex',
                              paddingTop: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              // position: 'absolute',
                              // top: '50%',
                              // left: '50%',
                            }}
                          />
                        )}
                      </FastImage>
                    </View>
                  )}
                />
              </View>

              <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                  {myChallenge.challengeRewardType === 1 ? (
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 22,
                        fontFamily: 'Regular',
                        marginVertical: 20,
                      }}
                    >
                      총상금 {myChallenge.challengeRewardPoint} P
                    </Text>
                  ) : (
                    <Text
                      onPress={() => toggleListG()}
                      style={{ color: 'black', fontSize: 22, fontFamily: 'Regular', marginVertical: 20 }}
                    >
                      기프티콘 목록
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      marginVertical: 20,
                      color: 'black',
                      fontSize: 22,
                      fontFamily: 'Regular',
                    }}
                    onPress={() => toggleDialogF()}
                  >
                    현재 순위 {myInfo.myRank} 위
                  </Text>
                </View>
              </View>

              <Dialog
                overlayStyle={{ backgroundColor: '#FFE7BC', borderRadius: 20 }}
                isVisible={visibleListG}
                onBackdropPress={toggleListG}
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
                  등록된 기프티콘 목록
                </Text>
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
                isVisible={visibleDialogF}
                onBackdropPress={toggleDialogF}
                overlayStyle={{ height: 500, backgroundColor: '#1C4DCD', flex: 0.8, borderRadius: 20 }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 25,
                    fontFamily: 'Regular',
                    textAlign: 'center',
                    marginBottom: 50,
                  }}
                >
                  현재 순위
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  {usersInfo.map((user, index) => (
                    <View style={{ flexDirection: 'column' }}>
                      {index <= 2 && (
                        <View
                          style={
                            index === 0
                              ? { position: 'absolute', top: -38, right: -160, zIndex: 9 }
                              : index === 1
                              ? { position: 'absolute', top: -22, right: -70, zIndex: 9 }
                              : { position: 'absolute', top: -10, right: -250, zIndex: 9 }
                          }
                        >
                          <Image
                            source={
                              user.userProfile
                                ? {
                                    uri: user.userProfile,
                                  }
                                : require('../../assets/images/homeMochi.png')
                            }
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 60,
                              overflow: 'hidden',
                              borderWidth: 3,
                              borderColor: index === 0 ? '#FEB800' : index === 1 ? '#0D91E6' : '#EC5E8C',
                            }}
                          />
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 14,
                              fontFamily: 'Regular',
                            }}
                          >
                            {user.userNickname}
                          </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#c8c8c8',
                              fontSize: 14,
                              fontFamily: 'Regular',
                            }}
                          >
                            {successRate(user.successCnt)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
                <Image
                  source={require('../../assets/images/leader.png')}
                  resizeMode='contain'
                  style={{ width: 270, height: 270, marginTop: -25 }}
                />
                <ScrollView style={{ backgroundColor: '#efefef', marginTop: -85, borderRadius: 20 }}>
                  {usersInfo.map((user, index) => (
                    <>
                      {index > 2 && (
                        <>
                          <ListItem containerStyle={{ backgroundColor: '#efefef', borderRadius: 10 }}>
                            <ListItem.Title
                              style={{
                                flex: 0.1,
                                color: 'black',
                                fontWeight: '900',
                                fontSize: 18,
                                fontFamily: 'Regular',
                              }}
                            >
                              {index + 1}
                            </ListItem.Title>

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
                                  color: 'black',
                                  fontWeight: '900',
                                  fontSize: 18,
                                  fontFamily: 'Regular',
                                  paddingRight: 10,
                                }}
                              >
                                <Text>{successRate(user.successCnt)}%</Text>
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                          <Divider width={2} style={{ marginLeft: '2%', width: '96%' }} />
                        </>
                      )}
                    </>
                  ))}
                </ScrollView>
              </Dialog>
            </ScrollView>
          </TabView.Item>

          <TabView.Item style={{ paddingHorizontal: 15, backgroundColor: 'white', width: '100%' }}>
            <ScrollView>
              <View
                style={{
                  marginVertical: 10,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name='camera'
                  type='font-awesome'
                  color='black'
                  size={25}
                  onPress={() => goCamera(challengeId)}
                  // containerStyle={{ bottom: 20, right: 20 }}
                />
                <Text
                  style={{
                    color: '#FFA401',
                    fontWeight: '900',
                    fontSize: 25,
                    fontFamily: 'Regular',
                    paddingHorizontal: 10,
                  }}
                  onPress={() => goCamera(challengeId)}
                >
                  인증하기
                </Text>
                <Icon
                  name='question'
                  type='octicon'
                  size={25}
                  color='black'
                  onPress={() => toggleDialogQ()}
                />
              </View>
              <Dialog
                isVisible={visibleDialogQ}
                onBackdropPress={toggleDialogQ}
                overlayStyle={{ height: 400, backgroundColor: '#FFE7BC', flex: 0.45, borderRadius: 20 }}
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

              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',

                  fontSize: 18,
                  fontFamily: 'Regular',
                  paddingVertical: 5,
                }}
              >
                전체 인증샷 목록 | 클릭시 인증 투표
              </Text>
              <View>
                <FlatGrid
                  itemDimension={170}
                  data={allAuthLists}
                  style={{}}
                  spacing={10}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => onVote(item.challengeAuthId, item.userId)}
                      style={{ alignItems: 'center' }}
                    >
                      <FastImage source={{ uri: item.challengePath }} style={{ width: 170, height: 170 }} />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </ScrollView>
          </TabView.Item>
        </TabView>
      </View>
    );
  }
}

export default ChallengeDetailScreen1;
