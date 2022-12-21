import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Calendars from '../components/Calendar';
import { useAppDispatch } from '../store';
import screenSlice from '../slices/screen';

function AttendanceScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      screenSlice.actions.addScreen({
        screen: 'AttendanceScreen',
      }),
    );
    return () => {
      console.log('unmount');
      dispatch(screenSlice.actions.deleteScreen());
    };
  }, []);

  return (
    <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <Text style={{ fontFamily: 'Regular', color: '#000000' }}>추후 업데이트 예정입니다</Text>
    </View>
  );
}

export default AttendanceScreen;
