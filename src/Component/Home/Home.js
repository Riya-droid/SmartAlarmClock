import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';

import * as Keychain from 'react-native-keychain';
const data = [
  {
    title: 'Buy Vegetables',
    desc: 'For Soup 2KG',
    time: '10.00 A.M',
  },
  {
    title: 'Study Math',
    desc: 'For EXAM',
    time: '11.00 A.M',
  },
  {
    title: 'Meet Granny',
    desc: 'Fun',
    time: '01.00 P.M',
  },
  {
    title: 'Prepare Presentation',
    desc: 'Capstone Project',
    time: '04.00 P.M',
  },
  {
    title: 'Prepare Soup',
    desc: 'For Soup 2KG',
    time: '07.00 P.M',
  },
];

class Home extends React.Component {
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

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
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
            {data.map((item, index) => (
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
                  {item.time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Home;
