import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Platform,
  NativeEventEmitter,
  NativeModules
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import ReactNativeAN from 'react-native-alarm-notification';
import { handleGetDirections } from './Location'

const { RNAlarmNotification } = NativeModules;
const RNEmitter = new NativeEventEmitter(RNAlarmNotification);

import * as Keychain from 'react-native-keychain';
import Loader from '../Loader';
import { actions } from './actions'
import moment from 'moment'
import { SwipeListView } from 'react-native-swipe-list-view';

import deleteimage from '../../static/deleterow.png';
import clock from '../../static/clock.png';

const Routes = {
  add_reminder: 'AddReminder',
  add_todo: 'AddTodo',
  add_location: 'AddLocation'
};

const alarmNotifData = {
  title: 'Alarm',
  message: 'Stand up',
  vibrate: true,
  play_sound: true,
  schedule_type: 'once',
  channel: 'wakeup',
  data: { content: 'my notification id is 22' },
  loop_sound: true,
  has_button: true,
};


class Home extends React.Component {
  _subscribeOpen;
  _subscribeDismiss;
  state = {
    data: [],
    loading: true,
    todos: [],
    fireDate: ReactNativeAN.parseDate(new Date(Date.now() + 3000)),
    locations: []
  };

  setAlarm = async (data) => {
    const fireDate = ReactNativeAN.parseDate(new Date(data.alarm))
    const { update } = this.state;

    const details = { ...alarmNotifData, title: data.title, message: data.desc, fire_date: fireDate, data: { id: data.key } };
    console.log(`alarm set: ${fireDate}`);

    try {
      const alarm = await ReactNativeAN.scheduleAlarm(details);
      console.log(alarm);
      if (alarm) {
        this.setState({
          update: [...update, { date: `alarm set: ${fireDate}`, id: alarm.id }],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  stopAlarmSound = () => {
    ReactNativeAN.stopAlarmSound();
  };

  sendNotification = () => {
    const details = {
      ...alarmNotifData,
      data: { content: 'my notification id is 45' },
      sound_name: 'iphone_ringtone.mp3',
      volume: 0.9,
    };
    ReactNativeAN.sendNotification(details);
  };

  handleLogout = () => {
    Keychain.resetGenericPassword({
      service: 'Test2222',
    })
      .then((res) => {
        console.log(res);
        this.props.navigation.navigate('Login');
      })
      .catch((err) => {
        console.log(err);
        this.props.navigation.navigate('Login');
      });
  };

  componentDidMount() {
    this.uid = auth().currentUser.uid;
    this.remindersRef = database().ref('reminders').child(this.uid)
    this.todoRef = database().ref('todos').child(this.uid).limitToLast(2)
    this.locationRef = database().ref('locations').child(this.uid)

    this.remindersRef.on('value', (snapshot) => {
      this.setData(snapshot)
    });
    this.locationRef.on('value', (snapshot) => {
      this.setLocationData(snapshot)
    });
    this.todoRef.on('value', (snapshot) => {
      this.setTodoData(snapshot)
    });
    this.setState({ loading: false })
    this._subscribeDismiss = RNEmitter.addListener(
      'OnNotificationDismissed',
      (data) => {
        const obj = JSON.parse(data);
        console.log(`notification id: ${obj.id} dismissed`);
      },
    );

    this._subscribeOpen = RNEmitter.addListener(
      'OnNotificationOpened',
      (data) => {
        console.log(data);
        const obj = JSON.parse(data);
        let key = obj.data && obj.data.id
        let uid = auth().currentUser.uid;
        let reminders = database().ref('reminders').child(uid)
        reminders.child(key).set(null)
        console.log(`app opened by notification: ${obj.id}`);
      },
    );

    if (Platform.OS === 'ios') {
      this.showPermissions();

      ReactNativeAN.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      }).then(
        (data) => {
          console.log('RnAlarmNotification.requestPermissions', data);
        },
        (data) => {
          console.log('RnAlarmNotification.requestPermissions failed', data);
        },
      );
    }
  }

  componentWillUnmount() {
    this._subscribeDismiss.remove();
    this._subscribeOpen.remove();
  }

  showPermissions = () => {
    ReactNativeAN.checkPermissions((permissions) => {
      console.log(permissions);
    });
  };

  setLocationData = (snapshot) => {
    if (snapshot.val()) {
      this.setState({
        locations: Object.keys(snapshot.val()).map(id => { return { key: id, ...snapshot.val()[id] } }).slice(0, 2)
      }, () => {
        this.state.locations.map(val => {
          this.setAlarm(val)
        })
      });
    } else {
      this.setState({ locations: [] })
    }
    this.setState({ loading: false });
  }
  setTodoData(snapshot) {
    if (snapshot.val()) {
      this.setState({
        todos: Object.keys(snapshot.val()).map(id => { return { key: id, ...snapshot.val()[id] } })
      });
    } else {
      this.setState({ todos: [] })
    }
    this.setState({ loading: false });
  }


  setData(snapshot) {
    if (snapshot.val()) {
      this.setState({
        data: Object.keys(snapshot.val()).map(id => { return { key: id, ...snapshot.val()[id] } }).slice(0, 2)
      }, () => {
        this.state.data.map(val => {
          this.setAlarm(val)
        })
      });
    } else {
      this.setState({ data: [] })
    }
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    if (this.remindersRef) this.remindersRef.off('value', this.setData);
  }

  render() {
    return (
      <>
        <SafeAreaView />
        <View style={styles.scrollview}>
          <View style={styles.topbar}>
            <View>
              <Text style={styles.dash}>Dashboard</Text>
              <Text style={{ fontSize: 12, marginTop: 5 }}>
                {moment(new Date()).format('dddd, DD MMM,YYYY')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Settings')}
              style={{
                marginLeft: 'auto',
              }}>
              <Image
                source={{
                  uri:
                    'https://image.freepik.com/free-vector/smiling-girl-avatar_102172-32.jpg',
                }}
                style={styles.profile}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.reminder}>
            <Text style={styles.dash}>Reminders and Alarms</Text>
            {this.state.data.length == 0 ? <Text style={styles.nodata}>No data</Text> :
              <>
                <SwipeListView
                  data={this.state.data}
                  renderItem={(data) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.row}
                        onPress={() => this.props.navigation.navigate('AddReminder', { data: JSON.stringify(data.item) })}
                      >
                        <View style={styles.itemText}>
                          <Text style={styles.text}>{data.item.title}</Text>
                          <Text style={styles.desc}>{data.item.desc.substr(0, 100)}</Text>
                        </View>
                        <View style={styles.timeWrapper}>
                          <Image source={clock} style={styles.alarm} />
                          <Text style={styles.date}>{moment(new Date(data.item.date)).format('MMM DD, hh:mm a')}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                  keyExtractor={(_, ind) => ind.toString()}
                  style={styles.liststyle}
                  leftOpenValue={60}
                  renderHiddenItem={(data) => (
                    <TouchableOpacity style={styles.rowback} onPress={() => {
                      let uid = auth().currentUser.uid;
                      let reminders = database().ref('reminders').child(uid)
                      reminders.child(data.item.key).set(null)
                    }}>
                      <Image source={deleteimage} style={styles.deleteimage} />
                    </TouchableOpacity>
                  )}
                />
                {this.state.data.length == 2 &&
                  <TouchableOpacity style={styles.seebutton} onPress={() => this.props.navigation.navigate('Reminder')}>
                    <Text style={styles.seetext}>See All</Text>
                  </TouchableOpacity>
                }
              </>
            }
          </View>
          <View style={styles.reminder}>
            <Text style={styles.dash}>Locations</Text>
            {this.state.locations.length == 0 ? <Text style={styles.nodata}>No data</Text> :
              <>
                <SwipeListView
                  data={this.state.locations}
                  renderItem={(data) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.row}
                        onPress={() => handleGetDirections(data.item.start_id, data.item.end_id)}
                      >
                        <View style={styles.itemText}>
                          <Text style={styles.text}>{data.item.title}</Text>
                          <Text style={styles.desc}>{data.item.desc.substr(0, 100)}</Text>
                        </View>
                        <View style={styles.timeWrapper}>
                          <Image source={clock} style={styles.alarm} />
                          <Text style={styles.date}>{moment(new Date(data.item.alarm)).format('MMM DD, hh:mm a')}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                  keyExtractor={(_, ind) => ind.toString()}
                  style={styles.liststyle}
                  leftOpenValue={60}
                  renderHiddenItem={(data) => (
                    <TouchableOpacity style={styles.rowback} onPress={() => {
                      let uid = auth().currentUser.uid;
                      let reminders = database().ref('locations').child(uid)
                      reminders.child(data.item.key).set(null)
                    }}>
                      <Image source={deleteimage} style={styles.deleteimage} />
                    </TouchableOpacity>
                  )}
                />
                {this.state.locations.length == 2 &&
                  <TouchableOpacity style={styles.seebutton} onPress={() => this.props.navigation.navigate('Location')}>
                    <Text style={styles.seetext}>See All</Text>
                  </TouchableOpacity>
                }
              </>
            }
          </View>

          <View style={styles.reminder2}>
            <Text style={styles.dash}>To dos</Text>
            {this.state.todos.length == 0 ? <Text style={styles.nodata}>No data</Text> :
              <>
                <SwipeListView
                  data={this.state.todos}
                  renderItem={(data) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.row}
                        onPress={() => this.props.navigation.navigate('AddTodo', { data: JSON.stringify(data.item) })}
                      >
                        <View style={styles.itemText}>
                          <Text style={styles.text}>{data.item.title}</Text>
                          <Text style={styles.desc}>{data.item.desc.substr(0, 100)}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                  keyExtractor={(_, ind) => ind.toString()}
                  style={styles.liststyle}
                  leftOpenValue={60}
                  renderHiddenItem={(data) => (
                    <TouchableOpacity style={styles.rowback} onPress={() => {
                      let uid = auth().currentUser.uid;
                      let reminders = database().ref('todos').child(uid)
                      reminders.child(data.item.key).set(null)
                    }}>
                      <Image source={deleteimage} style={styles.deleteimage} />
                    </TouchableOpacity>
                  )}
                />
                {this.state.todos.length == 2 &&
                  <TouchableOpacity style={styles.seebutton} onPress={() => this.props.navigation.navigate('Todo')}>
                    <Text style={styles.seetext}>See All</Text>
                  </TouchableOpacity>
                }
              </>
            }
          </View>

          <FloatingAction
            actions={actions}
            onPressItem={(name) => {
              console.log(name)
              this.props.navigation.navigate(Routes[name]);
            }}
            distanceToEdge={{
              vertical: 10,
              horizontal: 10,
            }}
          />
          <Loader loading={this.state.loading} />
        </View>
      </>);
  }
}
const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: 'white',
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dash: {
    fontSize: 18,
    fontWeight: '600',
  },
  profile: {
    width: 50,
    height: 50,
    // resizeMode: 'contain',
    borderColor: '#000',
    marginLeft: 'auto',
    borderRadius: 25,
    borderWidth: 1
  },
  reminder: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  reminder2: {
    padding: 10,
    borderWidth: 1,
    height: '100%',
    borderColor: '#fff',
    flex: 1
  },
  liststyle: {
    marginTop: 20,
    width: Dimensions.get('window').width,
    alignSelf: "center",
    paddingHorizontal: 10,
    maxHeight: 150
  },
  row: {
    backgroundColor: "white",
    marginVertical: 2,
    marginRight: 1,
    height: 65,
    paddingLeft: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: -1,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemText: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    marginRight: 15,
    fontWeight: '600'
  },
  desc: {
    fontSize: 12,
    marginRight: 15,
    marginTop: 5
  },
  timeWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  alarm: {
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  date: {
    fontSize: 13,
    marginLeft: 5
  },
  forward: {
    width: 20,
    height: 14,
    resizeMode: "contain",
    marginRight: 20,
    marginLeft: 5,
  },
  rowback: {
    width: 60,
    height: 65,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#D62246",
    borderRadius: 5,
  },
  deleteimage: {
    height: 15,
    width: 15,
    resizeMode: 'contain'
  },
  seebutton: {
    width: 100,
    height: 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2176F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderRadius: 5
  },
  seetext: {
    fontSize: 14,
    color: '#2176F5'
  },
  nodata: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 40
  }
})

export default Home;
