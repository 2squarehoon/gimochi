import { URL } from '../../api/API';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';
import { useAppDispatch } from '../../store';
import reloadSlice from '../../slices/reload';

function Just({ route, navigation }) {
  const userId = useSelector((state: RootState) => state.user.userId);
  console.log(userId);

  const challengeId = 16;
  const goMain = () => {
    navigation.navigate('ChallengeMainScreen');
  };

  const test1 = async () => {
    await axios
      .get(`${URL}/challenge`)
      .then(function (response) {
        console.log('야호');
        console.log(response);
        // redux(token.accessToken, String(token.accessTokenExpiresAt));
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };
  const test2 = async () => {
    const jsonData = {
      challengeDescription: '테스트테스트',
      challengeEndTime: '2022.11.30 13:00:00',
      challengeLeaderId: 4,
      challengeLeaderName: '전민재',
      challengeParticipant: 4,
      challengeRewardType: 1,
      challengeStartTime: '2022.11.05 13:00:00',
      challengeTitle: '1일 1커밋',
    };
    await axios
      .post(`${URL}/challenge`, jsonData)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };
  const test3 = async (challengeId) => {
    await axios
      .get(`${URL}/challenge/` + challengeId)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };
  const test4 = async (challengeId) => {
    await axios
      .delete(`${URL}/challenge/` + challengeId)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };

  const test5 = async () => {
    const jsonData = {
      challengeId: 10,
      userId: 4,
    };
    await axios
      .post(`${URL}/challenge/challengeInvite`, jsonData)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };

  const test6 = async (userId) => {
    await axios
      .get(`${URL}/challenge/challengeInvite/` + userId)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };

  const test7 = async (challengeInviteId) => {
    await axios
      .post(`${URL}/challenge/challengeInvite/accept/` + challengeInviteId)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };
  const test8 = async (userId) => {
    await axios
      .get(`${URL}/challenge/challengeList/` + userId)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };
  const test9 = async (challengeId) => {
    await axios
      .get(`${URL}/challenge/userList/` + challengeId)
      .then(function (response) {
        console.log('야호');
        console.log(response);
      })
      .catch(function (error) {
        console.log('ㅠㅠ');
        console.log(error);
      });
  };

  return <></>;
}
export default Just;
