import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tab, Text, TabView, ThemeProvider, createTheme } from '@rneui/themed';
import { useAppDispatch } from '../../store';
import screenSlice from '../../slices/screen';
import Dial from './SpeedDial';
import { Divider } from '@rneui/themed';
const theme = createTheme({
  components: {
    Button: {
      titleStyle: {
        // color: 'red',
        // height: 8,
      },
    },
  },
});

function ChallengeMainScreen({ navigation }) {
  const dispatch = useAppDispatch();

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

  const [index, setIndex] = useState(0);
  console.log(index);
  const goDetail = (id) => {
    navigation.navigate('ChallengeDetailScreen', { challengeId: id });
  };

  const goWrite = () => {
    navigation.navigate('ChallengeCreateScreen1');
  };
  return (
    <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <ThemeProvider theme={theme}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            height: 0,
          }}
          style={{
            borderRadius: 21,
            backgroundColor: '#F6F6F6',
            marginTop: 21,
            marginHorizontal: 10,
            height: 42,
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
              borderRadius: 20,
              backgroundColor: index == 0 ? 'white' : '#F6F6F6',
              margin: 2,
              height: 38,
              padding: 0,
            }}
            // buttonStyle={{}}
            titleStyle={{
              fontSize: 20,
              color: index == 0 ? '#FFA401' : '#686868',
              paddingHorizontal: 0,
              paddingVertical: 0,
              fontWeight: '900',
            }}
          />
          <Tab.Item
            title='종료된 챌린지'
            containerStyle={{
              borderRadius: 20,
              backgroundColor: index == 1 ? 'white' : '#F6F6F6',
              margin: 2,
              height: 38,
              padding: 0,
            }}
            // buttonStyle={{}}
            titleStyle={{
              fontSize: 20,
              color: index == 1 ? '#FFA401' : '#686868',
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
          />
        </Tab>
      </ThemeProvider>
      <TabView value={index} onChange={setIndex} animationType='spring'>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <ScrollView>
            <TouchableOpacity onPress={() => goDetail(1)}>
              <Text h1>챌린지 상세보기 버튼</Text>
            </TouchableOpacity>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
            <Text h1>진행중 목록</Text>
          </ScrollView>
        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <ScrollView>
            <Text h1>종료된 목록</Text>
            <Text h1>Favorite</Text>
          </ScrollView>
        </TabView.Item>
      </TabView>
      <Dial navigation={navigation}></Dial>
    </View>
  );
}

export default ChallengeMainScreen;