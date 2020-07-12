import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import * as Keychain from 'react-native-keychain';

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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Welcome to Smart Clock Home Page</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            width: 100,
            height: 55,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.handleLogout}>
          <Text
            style={{
              fontSize: 16,
              color: 'blue',
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;
