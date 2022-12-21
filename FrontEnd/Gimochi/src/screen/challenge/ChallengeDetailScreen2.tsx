import React, { useState, useEffect } from 'react';
import { Alert, Text, Image, ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BottomSheet,
  Button,
  Divider,
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
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';
import { FlatGrid } from 'react-native-super-grid';
import FastImage from 'react-native-fast-image';

// @@@@@@@@@@@@@@@중간결과에서 원하는것만 복사해오자
function ChallengeDetailScreen2({ route, navigation }) {
  const [visibleG, setVisibleG] = useState(false);
  const [visibleDialogF, setVisibleDialogF] = useState(false);
  const [gifticons, setGifticons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myChallenge, setMyChallenge] = useState([]); // 챌린지 정보
  const [totalDay, setTotalDay] = useState(0); // 챌린지 정보
  const [usersInfo, setUsersInfo] = useState([]); // 챌린지 참여 목록
  const [myInfo, setMyInfo] = useState([]); // 챌린지 내 순위 기록
  const [myName, setMyName] = useState(''); // 내이름

  const dispatch = useAppDispatch();

  const userId = useSelector((state: RootState) => state.user.userId);
  const challengeId = route.params.challengeId;

  const toggleDialogF = () => {
    setVisibleDialogF(!visibleDialogF);
  };

  const successRate = (cnt) => {
    const temp = (100 * cnt) / totalDay;
    return Math.round(temp);
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
  const toggleG = () => {
    setVisibleG(!visibleG);
  };

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/user/info/` + userId)
      .then(function (response) {
        console.log(response.data.data);
        setMyName(response.data.data.userNickname);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${Config.API_URL}/challenge/rewardInfo/${challengeId}}`)
      .then(function (response) {
        // console.log(response.data.data.gifticonList);
        setGifticons(response.data.data.gifticonList);
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
            // console.log(response2.data.data);
            let temp2 = response2.data.data;
            temp2.sort((a, b) => b.successCnt - a.successCnt);
            setUsersInfo(temp2);
          }),
        )
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => setLoading(false));
    }
    myF();
  }, []);

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <ScrollView>
        <Divider width={0} style={{ marginTop: 20, width: '100%' }} />
        <ListItem>
          {myChallenge.challengeRewardType === 1 ? (
            <Icon name='file-powerpoint-box-outline' type='material-community' size={60} />
          ) : (
            <Icon name='barcode-scan' type='material-community' size={60} />
          )}

          <ListItem.Content>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <ListItem.Title
                  style={{
                    color: 'black',
                    fontWeight: '900',
                    fontSize: 22,
                    fontFamily: 'Regular',
                  }}
                >
                  {myChallenge.challengeTitle}
                </ListItem.Title>
              </View>
              <View style={{ flex: 1 }}>
                <ListItem.Title
                  style={{
                    textAlign: 'right',
                    color: 'red',
                    fontWeight: '900',
                    fontSize: 18,
                    fontFamily: 'Regular',
                  }}
                >
                  종료
                </ListItem.Title>
              </View>
            </View>
            <ListItem.Subtitle
              style={{
                color: 'black',
                fontWeight: '100',
                fontSize: 16,
                fontFamily: 'Regular',
                paddingTop: 3,
              }}
            >
              게시자:{myChallenge.challengeLeaderName} | 참여자수:{usersInfo.length}명 | 우승자:
              {myInfo.winnerName}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        <Divider inset={true} width={1} style={{ width: '100%' }} />

        <View
          style={{
            flexDirection: 'row',
            height: 70,
            paddingHorizontal: 20,
            marginTop: 30,
          }}
        >
          <Text style={{ textAlign: 'center', flex: 1, color: 'black', fontSize: 30, fontFamily: 'Regular' }}>
            챌린지가 종료 되었습니다.
          </Text>
        </View>

        <View
          style={{
            height: 90,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ textAlign: 'center', flex: 1, color: 'black', fontSize: 20, fontFamily: 'Regular' }}>
            {myChallenge.challengeStartDate}
            {'  '}부터{'    '}
          </Text>
          <Text style={{ textAlign: 'center', flex: 1, color: 'black', fontSize: 20, fontFamily: 'Regular' }}>
            {myChallenge.challengeEndDate}
            {'  '}까지 {'  '} 매일
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 70,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ textAlign: 'center', flex: 1, color: 'black', fontSize: 20, fontFamily: 'Regular' }}>
            설명{'  '}:{'  '}
            {myChallenge.challengeDescription}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            height: 70,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ textAlign: 'center', flex: 1, color: 'black', fontSize: 25, fontFamily: 'Regular' }}>
            내 순위 {myInfo.myRank} 위 | 달성률 :{' '}
            <Text style={{ color: '#FFA401' }}>{successRate(myInfo.successCnt)}%</Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            height: 70,
            paddingHorizontal: 20,
          }}
        >
          <Text
            onPress={() => toggleDialogF()}
            style={{ textAlign: 'center', flex: 1, color: 'black', fontSize: 25, fontFamily: 'Regular' }}
          >
            전체 순위 보기 !
          </Text>
        </View>

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
            최종 순위
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
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{
              color: 'black',
              textAlign: 'right',
              flex: 1,
              fontSize: 25,
              marginTop: 5,
              fontFamily: 'Regular',
            }}
            onPress={() => toggleG()}
          >
            보상 확인
          </Text>
          <Dialog
            isVisible={visibleG}
            onBackdropPress={toggleG}
            overlayStyle={{
              height: 400,
              backgroundColor: '#FFE7BC',
              flex: myInfo.winnerName === myName ? 0.7 : 0.2,
              borderRadius: 20,
            }}
          >
            {myInfo.winnerName === myName ? (
              <>
                <Text
                  style={{
                    marginBottom: 10,
                    color: 'black',
                    fontSize: 25,
                    fontFamily: 'Regular',
                    textAlign: 'center',
                  }}
                >
                  보상 기프티콘 목록
                </Text>

                <ScrollView>
                  <FlatGrid
                    itemDimension={100}
                    data={gifticons.filter((gifticon) => !gifticon.gifticonUsed)}
                    style={{}}
                    spacing={5}
                    renderItem={({ item, index }) => (
                      <>
                        <FastImage source={{ uri: item.gifticonPath }} style={{ width: 100, height: 100 }} />
                        <Text style={{ color: 'black', fontFamily: 'Regular' }}>{item.gifticonPeriod}</Text>
                        <Text style={{ color: 'black', fontFamily: 'Regular' }}>{item.gifticonStore}</Text>
                      </>
                    )}
                  />
                </ScrollView>
              </>
            ) : (
              <Text
                style={{
                  justifyContent: 'center',
                  color: 'black',
                  fontSize: 25,
                  fontFamily: 'Regular',
                  textAlign: 'center',
                }}
              >
                보상이 없습니다.
              </Text>
            )}
          </Dialog>
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

export default ChallengeDetailScreen2;
