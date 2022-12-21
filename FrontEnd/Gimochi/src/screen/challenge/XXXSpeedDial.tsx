import React, { useState, useEffect } from 'react';
import { SpeedDial } from '@rneui/themed';

// 생성 삭제 다이얼 참고용
// 이모티콘은 FAB 참고  | 버튼은 button 참고
function Dial({ navigation }) {
  const [open, setOpen] = React.useState(false);
  const goWrite = () => {
    navigation.navigate('ChallengeCreateScreen1');
  };
  return (
    <SpeedDial
      style={{ width: 400, height: 550 }} //위치
      buttonStyle={{ backgroundColor: '#FFE7BC' }}
      isOpen={open}
      icon={{ name: 'edit', color: '#FFA401' }}
      openIcon={{ name: 'close', color: '#FFA401' }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        buttonStyle={{ backgroundColor: '#FFE7BC' }}
        icon={{ name: 'add', color: '#FFA401' }}
        title='만들기'
        onPress={() => goWrite()}
      />
      <SpeedDial.Action
        buttonStyle={{ backgroundColor: '#FFE7BC' }}
        icon={{ name: 'delete', color: '#FFA401' }}
        title='삭제'
        onPress={() => console.log('Delete Something')}
      />
    </SpeedDial>
  );
}
export default Dial;
