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
import auth from '@react-native-firebase/auth';
import Loader from '../Loader';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
    loading: false,
  };

  componentDidMount() {
    Keychain.getGenericPassword({
      service: 'Test2222',
      authenticationPrompt: {
        title: 'Unlock Smart Clock App',
      },
    })
      .then((res) => {
        console.log(res);
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

  handleSubmit = async () => {
    let {email, password} = this.state;
    this.setState({error: '', loading: true});

    try {
      let value = await auth().createUserWithEmailAndPassword(email, password);
      this.navigateToHome();
    } catch (error) {
      if (error.code == 'auth/email-already-in-use') {
        this.signIn(email, password);
      } else {
        this.handleError(error);
      }
    }
  };

  signIn = async (email, password) => {
    try {
      let value = await auth().signInWithEmailAndPassword(email, password);
      this.navigateToHome();
    } catch (error) {
      this.handleError(error);
    }
  };

  navigateToHome = () => {
    Keychain.setGenericPassword('name', 'value', {
      service: 'Test2222',
      accessControl:
        Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    })
      .then((res) => {
        console.log(res);
        this.setState({loading: false}, () => {
          this.props.navigation.navigate('Home');
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({loading: false}, () => {
          this.props.navigation.navigate('Home');
        });
      });
  };

  handleError = (error) => {
    switch (error.code) {
      case 'auth/wrong-password':
        this.setState({error: 'The password is wrong.', loading: false});
        return;

      case 'auth/invalid-email':
        this.setState({error: 'Email address is invalid.', loading: false});
        return;
      default:
        this.setState({error: error.code, loading: false});
        return;
    }
  };

  keyChainSet = () => {
    Keychain.setGenericPassword('name', 'value', {
      service: 'Test2222',
      accessControl:
        Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    });
  };

  renderError = () => {
    let error = this.state.error;
    if (error) {
      return (
        <Text
          style={{
            color: 'red',
            width: '90%',
            marginTop: 10,
          }}>
          {this.state.error}
        </Text>
      );
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
            {this.renderError()}
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
        <Loader loading={this.state.loading} />
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
