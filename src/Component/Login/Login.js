import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Keychain from 'react-native-keychain';

import loginImage from '../../static/login.png';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  };

  componentDidMount() {
    Keychain.getGenericPassword({
      service: 'Test2222',
      authenticationPrompt: {
        title: 'Unlock Smart Clock App',
      },
    })
      .then((res) => {
        if (res) {
          this.props.navigation.navigate('Home');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (name, value) => {
    this.setState({[name]: value});
  };

  handleSubmit = () => {
    let {email, password} = this.state;

    if (email == 'rmishra_50be18@thapar.edu' && password == '12345678') {
      Keychain.setGenericPassword('name', 'value', {
        service: 'Test2222',
        accessControl:
          Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      })
        .then((res) => {
          console.log(res);
          this.props.navigation.navigate('Home');
        })
        .catch((err) => {
          console.log(err);
          this.props.navigation.navigate('Home');
        });
    } else {
      alert('Email or Password is wrong. Please try again.');
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={style.container}
          showsVerticalScrollIndicator={false}>
          <Image source={loginImage} style={style.loginImage} />
          <View style={style.formContainer}>
            <TextInput
              style={style.input}
              placeholder={'Email'}
              value={this.state.email}
              onChangeText={(text) => this.handleChange('email', text)}
            />
            <TextInput
              style={style.input}
              placeholder={'Password'}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.handleChange('password', text)}
            />
            <TouchableOpacity
              style={style.loginButton}
              onPress={this.handleSubmit}>
              <Text
                style={{
                  color: 'white',
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loginImage: {
    width: '100%',
    height: 200,
    marginTop: 100,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(79, 79, 79, 0.3)',
    marginTop: 30,
    width: '90%',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    height: 50,
  },

  loginButton: {
    height: 50,
    width: '90%',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: '#3F3D56',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default Login;
