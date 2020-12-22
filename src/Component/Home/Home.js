import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';

import todo from '../../assets/to-do-list.png';
import reminder from '../../assets/reminder.png';
import alarm from '../../assets/alarm-clock.png';
import location from '../../assets/pin.png';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import * as Keychain from 'react-native-keychain';
import Loader from '../Loader';

const Routes = {
  add_reminder: 'AddReminder',
};

const actions = [
  {
    text: 'Add Todo',
    name: 'add_todo',
    position: 2,
    icon: todo,
  },
  {
    text: 'Add Reminder',
    name: 'add_reminder',
    position: 1,
    icon: reminder,
  },
  {
    text: 'Add Location',
    name: 'add_location',
    position: 3,
    icon: location,
  },
  {
    text: 'Add Alarm',
    name: 'add_alarm',
    position: 4,
    icon: alarm,
  },
];

class Home extends React.Component {
  state = {
    data: [],
    loading: true,
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
    this.remindersRef = database().ref('reminders').child(this.uid);

    this.remindersRef.on('value', (snapshot) => this.setData(snapshot));
  }

  setData(snapshot) {
    if (snapshot.val()) this.setState({data: Object.values(snapshot.val())});

    this.setState({loading: false});
  }

  componentWillUnmount() {
    if (this.remindersRef) this.remindersRef.off('value', this.setData);
  }

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        contentContainerStyle={{
          height: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
              }}>
              Dashboard
            </Text>
            <Text
              style={{
                fontSize: 12,
              }}>
              {new Date().toDateString()}
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
              style={{
                width: 50,
                height: 50,
                // resizeMode: 'contain',
                borderColor: 'red',
                marginLeft: 'auto',
                borderRadius: 25,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            padding: 10,
            flex: 1,
            borderWidth: 1,
            height: '100%',
            borderColor: '#fff',
          }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 18,
            }}>
            Reminders
          </Text>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            {this.state.data.map((item, index) => (
              <View
                key={index}
                style={{
                  marginTop: 20,
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,

                  elevation: 3,
                  backgroundColor: 'white',
                  borderRadius: 4,
                }}>
                <View>
                  <Text>{item.title}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                    }}>
                    {item.desc}
                  </Text>
                </View>
                <Text
                  style={{
                    marginLeft: 'auto',
                  }}>
                  {new Date(item.date).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <FloatingAction
          actions={actions}
          onPressItem={(name) => {
            this.props.navigation.navigate(Routes[name]);
            console.log(`selected button: ${name}`);
          }}
          distanceToEdge={{
            vertical: 10,
            horizontal: 10,
          }}
        />
        <Loader loading={this.state.loading} />
      </ScrollView>
    );
  }
}

export default Home;
