import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tab, Icon, TabView, Divider, ThemeProvider, createTheme, ListItem } from '@rneui/themed';
import { useAppDispatch } from '../../store';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';

import screenSlice from '../../slices/screen';

function ChallengeMainScreen({ navigation, route }) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const reload = useSelector((state: RootState) => state.reload.reload);
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalDay, setTotalDay] = useState(0); // 챌린지 정보
  const [myChList, setmyChList] = useState([]);
  const [my0ChList, setmy0ChList] = useState([]);
  const [my1ChList, setmy1ChList] = useState([]);
  const [my2ChList, setmy2ChList] = useState([]);

  const goDetail0 = (id) => {
    navigation.navigate('ChallengeDetailScreen0', { challengeId: id });
  };
  const goDetail1 = (id) => {
    navigation.navigate('ChallengeDetailScreen1', { challengeId: id });
  };
  const goDetail2 = (id) => {
    navigation.navigate('ChallengeDetailScreen2', { challengeId: id });
  };

  const goWrite1 = () => {
    navigation.navigate('ChallengeCreateScreen1');
  };

  const create012List = async (res) => {
    const wait = [];
    const ing = [];
    const end = [];
    await res.forEach((chall, i) => {
      if (chall.challengeActive === 0) {
        wait.push(chall);
      } else if (chall.challengeActive === 1) {
        ing.push(chall);
      } else if (chall.challengeActive === 2) {
        end.push(chall);
      }
    });
    wait.sort((a, b) => new Date(a.challengeStartDate) - new Date(b.challengeStartDate));
    ing.sort((a, b) => new Date(a.challengeEndDate) - new Date(b.challengeEndDate));
    end.sort((a, b) => new Date(b.challengeEndDate) - new Date(a.challengeEndDate));
    setmy0ChList(wait);
    setmy1ChList(ing);
    setmy2ChList(end);
    console.log(myChList, my0ChList, my1ChList, my2ChList);
  };
  const calSDay = (time) => {
    const t = new Date(time) - new Date() - 32400000;
    const result = parseInt(t / 86400000);
    return result === 0 ? 1 : result + 1;
  };
  const calEDay = (time) => {
    const t = new Date(time) - new Date() - 32400000;
    const result = parseInt(t / 86400000);
    return result === 0 ? 1 : result + 1;
  };
  useEffect(() => {
    dispatch(
      screenSlice.actions.addScreen({
        screen: 'ChallengeScreen',
      }),
    );
    return () => {
      console.log('unmount');
      dispatch(screenSlice.actions.deleteScreen());
    };
  }, []);

  const reMain = async () => {
    await axios
      .get(`${Config.API_URL}/challenge/challengeList/` + userId)
      .then(async (response) => {
        console.log(response.data.data);
        setmyChList(response.data.data);
        create012List(response.data.data);
        // const temp = { ...response1.data.data[i], ...response2.data.data };
        // console.log(myChList, my0ChList, my1ChList, my2ChList);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    async function myF() {
      await axios
        .get(`${Config.API_URL}/challenge/challengeList/` + userId)
        .then(function (response) {
          console.log(response.data.data);
          for (var i = 0; i < response.data.data.length; i++) {
            axios
              .put(`${Config.API_URL}/challenge/` + response.data.data[i].challengeId)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
          }

          // setmyChList(response.data.data);
          // create012List(response.data.data);
          // const temp = { ...response1.data.data[i], ...response2.data.data };
          // console.log(myChList, my0ChList, my1ChList, my2ChList);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    myF();
    reMain();
    // .finally(() => setLoading(false));
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
            marginHorizontal: 10,
            height: 52,
          }}
          // containerStyle={{
          //   borderRadius: 21,
          //   backgroundColor: 'red',
          //   marginTop: 21,
          //   height: 42,
          // }}
          // buttonStyle={{
          //   borderRadius: 21,
          //   backgroundColor: 'white',
          //   marginTop: 21,
          //   height: 42,
          // }}
          // titleStyle={{
          //   margin: 2,
          //   height: 38,
          //   borderRadius: 21,
          //   color: 'red',
          // }}
          variant='primary'
        >
          <Tab.Item
            title='진행중인 챌린지'
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
            title='종료된 챌린지'
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
              fontWeight: '900',
              color: index == 1 ? '#FFA401' : '#686868',
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
          />
        </Tab>

        <TabView value={index} onChange={setIndex} animationType='spring'>
          <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
            <ScrollView>
              <Divider width={0} style={{ height: 10, width: '100%' }} />
              {my1ChList.map((Ch, index) => (
                <TouchableOpacity key={index + 10000} onPress={() => goDetail1(Ch.challengeId)}>
                  <ListItem>
                    {Ch.challengeRewardType === 1 ? (
                      <Icon name='file-powerpoint-box-outline' type='material-community' size={60} />
                    ) : (
                      <Icon name='barcode-scan' type='material-community' size={60} />
                    )}

                    <ListItem.Content>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                          <ListItem.Title
                            style={{ color: 'black', fontWeight: '900', fontSize: 22, fontFamily: 'Regular' }}
                          >
                            {Ch.challengeTitle}
                          </ListItem.Title>
                        </View>
                        <View style={{ flex: 1 }}>
                          <ListItem.Title
                            style={{
                              textAlign: 'right',
                              color: '#FFA401',
                              fontWeight: '900',
                              fontSize: 18,
                              fontFamily: 'Regular',
                            }}
                          >
                            종료 까지 D-{calEDay(Ch.challengeEndDate)}day
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
                        게시자:{Ch.challengeLeaderName} | 참여자수:{Ch.challenger_cnt}명 | 1위:{Ch.winnerName}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                  <Divider inset={true} width={1} style={{ width: '100%' }} />
                </TouchableOpacity>
              ))}
              <Divider width={0} style={{ height: 30, width: '100%' }} />
              {my0ChList.map((Ch, index) => (
                <TouchableOpacity key={index + 100} onPress={() => goDetail0(Ch.challengeId)}>
                  <ListItem>
                    {Ch.challengeRewardType === 1 ? (
                      <Icon name='file-powerpoint-box-outline' type='material-community' size={60} />
                    ) : (
                      <Icon name='barcode-scan' type='material-community' size={60} />
                    )}

                    <ListItem.Content>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                          <ListItem.Title
                            style={{ color: 'black', fontWeight: '900', fontSize: 22, fontFamily: 'Regular' }}
                          >
                            {Ch.challengeTitle}
                          </ListItem.Title>
                        </View>
                        <View style={{ flex: 1 }}>
                          <ListItem.Title
                            style={{
                              textAlign: 'right',
                              color: '#FFA401',
                              fontWeight: '900',
                              fontSize: 18,
                              fontFamily: 'Regular',
                            }}
                          >
                            시작 까지 D-{calSDay(Ch.challengeStartDate)}day
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
                        게시자:{Ch.challengeLeaderName} | 참여자수:{Ch.challenger_cnt}명 | 현재 순위 미정
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                  <Divider inset={true} width={1} style={{ width: '100%' }} />
                </TouchableOpacity>
              ))}
              <Divider width={0} style={{ height: 80, width: '100%' }} />
            </ScrollView>
          </TabView.Item>
          <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
            <ScrollView>
              <Divider width={0} style={{ height: 10, width: '100%' }} />
              {my2ChList.map((Ch, index) => (
                <>
                  <TouchableOpacity key={index + 1000} onPress={() => goDetail2(Ch.challengeId)}>
                    <ListItem>
                      {Ch.challengeRewardType === 1 ? (
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
                              {Ch.challengeTitle}
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
                          게시자:{Ch.challengeLeaderName} | 참여자수:{Ch.challenger_cnt}명 | 우승자:
                          {Ch.winnerName}
                        </ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                  </TouchableOpacity>
                  <Divider inset={true} width={1} style={{ width: '100%' }} />
                </>
              ))}
              <Divider width={0} style={{ height: 80, width: '100%' }} />
            </ScrollView>
          </TabView.Item>
        </TabView>

        <Icon
          name='add'
          type='material'
          color='#FFE7BC'
          size={25}
          reverse
          reverseColor='#FFA401'
          onPress={() => goWrite1()}
          iconStyle={{ fontSize: 43 }}
          containerStyle={{ position: 'absolute', top: '85%', left: '80%' }}
        />
      </View>
    );
  }
}

export default ChallengeMainScreen;
