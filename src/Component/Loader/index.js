import React from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';

const Loader = (props) => (
  <Modal animationType="fade" transparent={true} visible={props.loading}>
    <View style={style.background} />
    <View
      style={{
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}>
      <ActivityIndicator color="#ED1A5C" size={30} />
    </View>
  </Modal>
);

const style = StyleSheet.create({
  background: {
    backgroundColor: '#000',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    opacity: 0.7,
  },
});

export default Loader;
