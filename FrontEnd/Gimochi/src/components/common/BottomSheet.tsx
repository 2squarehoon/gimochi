import React, { useState } from 'react';
import { BottomSheet, Button, ListItem } from '@rneui/themed';

const BottomSheetComponent = () => {
  const [chPoint, setChPoint] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const list = [
    { title: '2000', onPress: () => closePoint(2000) },
    { title: '1000', onPress: () => closePoint(1000) },
    { title: '500', onPress: () => closePoint(500) },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];
  const closePoint = (point) => {
    setChPoint(point);
    setIsVisible(false);
  };

  return (
    <>
      <Button title='Open Bottom Sheet' onPress={() => setIsVisible(true)} buttonStyle={styles.button} />
      <BottomSheet modalProps={{}} isVisible={isVisible}>
        {list.map((l, i) => (
          <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </>
  );
};

export default BottomSheetComponent;
