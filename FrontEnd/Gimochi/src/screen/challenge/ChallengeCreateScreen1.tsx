import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tab, TabView, ThemeProvider, createTheme, SpeedDial } from '@rneui/themed';
import { Icon } from '@rneui/themed';

function ChallengeCreateScreen1({ navigation }) {
  const [index, setIndex] = useState(0);
  console.log(index);

  const goWrite2 = (index2) => {
    // index 0 :포인트  1 :기프티콘
    navigation.navigate('ChallengeCreateScreen2', { indexOfGP: index2 + 1 });
  };

  return (
    <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <Tab
        // index 0 :포인트  1 :기프티콘
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
          title='포인트'
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
          title='기프티콘'
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
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 5,
          color: 'black',
          fontFamily: 'Regular',
          fontWeight: '500',
          fontSize: 18,
        }}
      >
        도움말
      </Text>
      <View
        style={{
          width: 0,
          height: 0,
          // backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 20,
          borderRightWidth: 20,
          borderBottomWidth: 30,
          // borderTopWidth: 1,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#efefef',
          position: 'absolute',
          top: 80,
          left: 88,
          display: index == 0 ? 'flex' : 'none',
        }}
      ></View>
      <View
        style={{
          width: 0,
          height: 0,
          // backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 20,
          borderRightWidth: 20,
          borderBottomWidth: 30,
          // borderTopWidth: 1,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#efefef',
          position: 'absolute',
          top: 80,
          right: 88,
          display: index == 1 ? 'flex' : 'none',
        }}
      ></View>
      <TabView value={index} onChange={setIndex} animationType='spring'>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <ScrollView
            style={{
              padding: 20,
              backgroundColor: '#efefef',
              marginBottom: 10,
              marginHorizontal: 10,
              borderRadius: 20,
            }}
          >
            <>
              <Text
                style={{
                  marginBottom: 15,
                  fontWeight: '900',
                  fontSize: 25,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                포인트 챌린지 간략 안내
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                0. 승자 독식 | 공동 1등은 랜덤추첨
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                1. 방장이 방을 생성 할때는 모두가 똑같이
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
                내야할 포인트를 설정합니다.
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
                2. D-day 가 되면 자정에 자동으로 시작이됩니다.
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
                3. 초대는 대기중에 할 수 있습니다.
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
                4. 진행중인 챌린지는 취소 할 수 없습니다.
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
                5. 포인트는 최대 9999 입니다. 취소 불가능!
              </Text>
            </>
          </ScrollView>
        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <ScrollView
            style={{ padding: 20, backgroundColor: '#efefef', marginHorizontal: 10, borderRadius: 20 }}
          >
            <>
              <Text
                style={{
                  marginBottom: 15,
                  fontWeight: '900',
                  fontSize: 25,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                기프티콘 챌린지 간략 안내
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                0. 승자 독식 | 공동 1등은 랜덤추첨
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                1. 방장이 방을 생성 할때는 기프티콘을
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
                설정하지 않습니다.
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
                2. D-day 가 되면 자정에 자동으로 시작이됩니다.
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
                3. 초대는 대기중에 할 수 있습니다.
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
                4. 진행중인 챌린지는 취소 할 수 없습니다.
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: 'Regular',
                  color: 'black',
                }}
              >
                5. 대기중 방에서 참가자들은 자동시작전까지
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
                기프티콘을 걸수 있습니다. 취소 불가능!
              </Text>
            </>
          </ScrollView>
        </TabView.Item>
      </TabView>

      <Icon
        name='navigate-next'
        type='material'
        color='#FFE7BC'
        size={25}
        reverse
        reverseColor='#FFA401'
        onPress={() => goWrite2(index)}
        iconStyle={{ fontSize: 43 }}
        containerStyle={{ position: 'absolute', top: '85%', left: '80%' }}
      />
    </View>
  );
}

export default ChallengeCreateScreen1;
