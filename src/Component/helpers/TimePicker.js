import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import calender from '../../assets/calender.png';

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value != '' && props.value != null ? props.value : '',
      showtime: false,
    };
  }

  UNSAFE_componentWillReceiveProps(newprops) {
    if (newprops.value != '' && newprops.value != null) {
      this.setState({
        value: newprops.value,
      });
    }
  }
  showtime = () => {
    this.setState({showtime: true});
  };
  setTime = (time) => {
    var hr = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    time = hr + ':' + min + ':' + sec;
    this.setState(
      {
        showtime: false,
        value: time,
      },
      () => this.props.setValue(this.props.name, time),
    );
  };

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.showtime}
          style={{
            width: Dimensions.get('window').width * 0.85,
            alignSelf: 'center',
          }}>
          <Text style={styles.value}>{this.state.value}</Text>
          <Text style={styles.label}>{this.props.label}</Text>
          <View style={styles.dropbuttoncontainer}>
            <Image source={calender} style={styles.image} />
          </View>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={this.state.showtime && this.props.editable}
          onConfirm={this.setTime}
          onCancel={() => this.setState({showtime: false})}
          mode="time"
          headerTextIOS="Pick time"
          date={new Date()}
        />
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  value: {
    flex: 1,
    paddingLeft: 15,
    color: '#131d4a',
    fontSize: 12,
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(230,230,230,0.6)',
    backgroundColor: 'rgba(230,230,230,0.6)',
    marginTop: 10,
    paddingTop: 25,
    width: Dimensions.get('window').width * 0.85,
    alignSelf: 'center',
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(80,86,101,0.36)',
    marginTop: -47,
    marginLeft: 30,
    width: Dimensions.get('window').width * 0.85,
    alignSelf: 'center',
    marginBottom: 33,
  },
  dropbuttoncontainer: {
    position: 'absolute',
    right: 17,
    top: 30,
  },
  image: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  datepicker: {
    position: 'absolute',
    top: 100,
    height: 100,
  },
});

export default TimePicker;
