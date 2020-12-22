import React from 'react';
import {
  StyleSheet,
  Animated,
  PanResponder,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native';

import slideimage from '../../assets/slideimage.png';

class SlideButton extends React.Component {
  constructor(props) {
    super(props);

    this.gestureDelay = -35;

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 25) {
          let newX = gestureState.dx + this.gestureDelay;
          position.setValue({x: newX, y: 0});
          this.setState({position});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < Dimensions.get('window').width * 0.75) {
          Animated.timing(this.state.position, {
            toValue: {x: 0, y: 0},
            duration: 150,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(this.state.position, {
            toValue: {x: Dimensions.get('window').width, y: 0},
            duration: 300,
            useNativeDriver: false,
          }).start(() => this.props.submit());
        }
      },
    });

    this.panResponder = panResponder;
    this.state = {position};
  }

  UNSAFE_componentWillReceiveProps(newprops) {
    if (newprops.reload) {
      this.setState({position: new Animated.ValueXY()});
    }
  }

  render() {
    return (
      <View style={styles.buttoncontainer}>
        <Animated.View
          style={[this.state.position.getLayout()]}
          {...this.panResponder.panHandlers}>
          <View style={styles.savebutton}>
            <Image
              source={slideimage}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginLeft: 40,
                marginTop: 20,
              }}
            />
          </View>
        </Animated.View>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            position: 'absolute',
            alignSelf: 'center',
            left: Dimensions.get('window').width * 1.39,
          }}>
          Slide to save
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttoncontainer: {
    height: 70,
    marginLeft: 0 - Dimensions.get('window').width,
    justifyContent: 'center',
    backgroundColor: 'rgba(28,164,159,0.56)',
    flexDirection: 'row',
  },
  savebutton: {
    width: Dimensions.get('window').width,
    height: 80,
    marginLeft: Dimensions.get('window').width,
    backgroundColor: '#1CA49F',
  },
});

export default SlideButton;
