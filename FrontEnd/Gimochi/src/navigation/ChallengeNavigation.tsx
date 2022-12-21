import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import ChallengeMainScreen from '../screen/challenge/ChallengeMainScreen';
import ChallengeDetailScreen0 from '../screen/challenge/ChallengeDetailScreen0';
import ChallengeDetailScreen1 from '../screen/challenge/ChallengeDetailScreen1';
import ChallengeDetailScreen2 from '../screen/challenge/ChallengeDetailScreen2';
import ChallengeCreateScreen1 from '../screen/challenge/ChallengeCreateScreen1';
import ChallengeCreateScreen2 from '../screen/challenge/ChallengeCreateScreen2';
import ChallengeCameraScreen from '../screen/challenge/ChallengeCameraScreen';

export type ChallengeStackParamList = {
  ChallengeMainScreen: undefined;
  ChallengeDetailScreen0: undefined;
  ChallengeDetailScreen1: undefined;
  ChallengeDetailScreen2: undefined;
  ChallengeCreateScreen1: undefined;
  ChallengeCreateScreen2: undefined;
  ChallengeCameraScreen: undefined;
};

const Challenge = createNativeStackNavigator<ChallengeStackParamList>();

function ChallengeNavigation() {
  return (
    <Challenge.Navigator
      initialRouteName='ChallengeMainScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Regular',
        },
      }}
    >
      <Challenge.Screen
        name='ChallengeMainScreen'
        component={ChallengeMainScreen}
        options={{ title: '챌린지' }}
      ></Challenge.Screen>

      <Challenge.Screen
        name='ChallengeDetailScreen0'
        component={ChallengeDetailScreen0}
        options={{ title: '대기중 챌린지' }}
      ></Challenge.Screen>
      <Challenge.Screen
        name='ChallengeDetailScreen1'
        component={ChallengeDetailScreen1}
        options={{ title: '진행중 챌린지' }}
      ></Challenge.Screen>
      <Challenge.Screen
        name='ChallengeDetailScreen2'
        component={ChallengeDetailScreen2}
        options={{ title: '종료된 챌린지' }}
      ></Challenge.Screen>
      <Challenge.Screen
        name='ChallengeCameraScreen'
        component={ChallengeCameraScreen}
        options={{ title: '챌린지 인증샷' }}
      ></Challenge.Screen>
      <Challenge.Screen
        name='ChallengeCreateScreen1'
        component={ChallengeCreateScreen1}
        options={{ title: '챌린지 생성안내' }}
      ></Challenge.Screen>
      <Challenge.Screen
        name='ChallengeCreateScreen2'
        component={ChallengeCreateScreen2}
        options={{ title: '챌린지 생성하기' }}
      ></Challenge.Screen>
    </Challenge.Navigator>
  );
}

export default ChallengeNavigation;
