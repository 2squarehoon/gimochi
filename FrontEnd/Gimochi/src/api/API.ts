/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from 'axios';
import Config from 'react-native-config';

export const axiosBasic = axios.create({
  baseURL: Config.API_URL,
});

export const singleNotification = async (receiverId: number, senderId: number, type: number) => {
  try {
    const response = await axiosBasic.post('/notification/message/single', {
      receiverId: receiverId,
      senderId: senderId,
      type: type,
    });
    console.log('hi');
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const multiNotification = async (userId: any, type: number) => {
  try {
    const response = await axiosBasic.post('/notification/message/multi', {
      type: type,
      userId: userId,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const chiunGifticonCount = async (userId: any) => {
  try {
    const response = await axiosBasic.get(`/user/usage/used/${userId}`);
    return response;
  } catch (error) {
    console.log;
  }
};

export const chiunGifticonMinus = async (userId: any) => {
  try {
    const response = await axiosBasic.get(`/user/usage/used/down/${userId}`);
    return response;
  } catch (error) {
    console.log;
  }
};
