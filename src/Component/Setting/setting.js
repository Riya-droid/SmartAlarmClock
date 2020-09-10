import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import camera from '../../assets/camera.png';
import forward from '../../assets/forward.png';
import password from '../../assets/password.png';
import logout from '../../assets/logout.png';
import changepassword from '../../assets/changepassword.png';
import close from '../../assets/close.png';

import styles from './styles/style';
import modal from './styles/modalstyle';

import Snackbar from 'react-native-snackbar';
import {UIActivityIndicator} from 'react-native-indicators';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const options = {
  title: 'Select profile pic',
  allowsEditing: true,
};

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modal2: false,
      passworderror: '',
      passwordloading: false,
      dashboardloading: false,
      loading: false,
      password: {
        current: '',
        new: '',
        confirm: '',
      },
      user_data: {
        displayName: '',
        email: '',
        photoURL: '',
      },
    };
  }

  componentDidMount() {
    let user = auth().currentUser;
    console.log(user);
    this.setState({
      user_data: {displayName: user.displayName, email: user.email},
    });
  }

  addPassword = () => {
    this.setState({visible: true});
  };

  closePassword = () => {
    this.setState({visible: false});
  };

  changepassword = async () => {
    return null;
    if (this.state.password.current == '') {
      this.setState({passworderror: 'Enter current password'});
    } else if (this.state.password.new == '') {
      this.setState({passworderror: 'Enter new password'});
    } else if (this.state.password.confirm == '') {
      this.setState({passworderror: 'Confirm new password'});
    } else if (this.state.password.new != this.state.password.confirm) {
      this.setState({passworderror: "New password doesn't match"});
    } else {
      this.setState({
        passwordloading: true,
      });

      /**
       * @TODO implement password change
       */

      let res = await this.props.context.changepassword({
        newPassword: this.state.password.new,
        currentPassword: this.state.password.current,
      });
      if (res[0]) {
        this.setState({visible: false, passwordloading: false}, () => {
          setTimeout(() => {
            Snackbar.show({
              text: 'Password changed successfully',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: '#1CA49F',
            });
          }, 400);
        });
      } else {
        this.setState({passworderror: res[1], passwordloading: false});
      }
    }
  };

  closeconfigure = () => {
    this.setState({modal2: false});
  };

  logout = async () => {
    await auth().signOut();
    this.props.navigation.navigate('Login');
  };

  changeuserdata = async (key, toshow) => {
    let value = this.state.user_data[key];
    try {
      let res = await auth().currentUser.updateProfile({
        [key]: value,
      });

      console.log(res);
      Snackbar.show({
        text: `${toshow} has been updated.`,
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  addprofilepic = () => {
    ImagePicker.showImagePicker(options, async (res) => {
      let err = '';
      if (res.didCancel) {
        err = 'You cancelled image picking';
      } else if (res.error) {
        err = res.error;
      } else {
        this.setState({loading: true});
        // upload photo url
        this.updateProfile(res.imagePath);
      }
      if (err != '') {
        Snackbar.show({
          text: err,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D62246',
        });
      }
    });
  };

  updateProfile = async (imagePath) => {
    let {uid} = auth().currentUser;
    let fileName = imagePath.split('/').pop();
    let ref = storage()
      .ref('/users/' + uid)
      .child(fileName);

    try {
      await ref.putFile(imagePath, {cacheControl: false});
    } catch (error) {
      return error;
    }

    let url = await ref.getDownloadURL();

    await auth().currentUser.updateProfile({
      photoURL: url,
    });

    return url;
  };

  updateApp = () => {
    console.log('hi');
  };

  renderLoading = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.loading}>
        <View style={modal.background} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            justifyContent: 'center',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}>
          <UIActivityIndicator color="#fff" size={50} />
        </View>
      </Modal>
    );
  };

  renderPasswordModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.visible}>
        <View style={modal.background} />
        <View style={modal.container}>
          <ScrollView>
            <TouchableOpacity
              style={modal.closemodal}
              onPress={this.closePassword}>
              <Image source={close} style={modal.closeimage} />
            </TouchableOpacity>
            <Image source={changepassword} style={modal.topimage} />
            <TextInput
              style={modal.passwordbox}
              secureTextEntry={true}
              placeholder="Enter current password"
              value={this.state.password.current}
              onChangeText={(text) =>
                this.setState({
                  password: {...this.state.password, current: text},
                })
              }
            />
            <TextInput
              style={modal.passwordbox}
              secureTextEntry={true}
              placeholder="Enter new password"
              value={this.state.password.new}
              onChangeText={(text) =>
                this.setState({password: {...this.state.password, new: text}})
              }
            />
            <TextInput
              style={modal.passwordbox}
              secureTextEntry={true}
              placeholder="Confirm new password"
              value={this.state.password.confirm}
              onChangeText={(text) =>
                this.setState({
                  password: {...this.state.password, confirm: text},
                })
              }
            />
            {this.state.passworderror != undefined &&
            this.state.passworderror != '' ? (
              <Text style={styles.error}>{this.state.passworderror}</Text>
            ) : null}
            {this.state.passwordloading ? (
              <TouchableOpacity
                style={modal.savebutton}
                onPress={this.changepassword}>
                <UIActivityIndicator color="#fff" size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={modal.savebutton}
                onPress={this.changepassword}>
                <Text
                  style={{color: '#fff', alignSelf: 'center', fontSize: 17}}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <ScrollView style={styles.containerStyle}>
        {this.renderLoading()}
        <View style={styles.topbar} />
        <View style={styles.restarea}>
          <TouchableOpacity activeOpacity={1} onPress={this.addprofilepic}>
            <View>
              <Image
                source={{
                  uri:
                    'https://image.freepik.com/free-vector/smiling-girl-avatar_102172-32.jpg',
                }}
                style={styles.profileimage}
              />
              <Image source={camera} style={styles.camera} />
            </View>
          </TouchableOpacity>
          <View style={styles.firstformcomponent}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.textinput}
              placeholder="Enter your name"
              value={this.state.user_data.displayName}
              onChangeText={(text) =>
                this.setState({
                  user_data: {...this.state.user_data, displayName: text},
                })
              }
              onBlur={() => this.changeuserdata('displayName', 'Name')}
            />
          </View>
          <View style={styles.otherformcomponent}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.textinput}
              placeholder="Enter email address"
              value={this.state.user_data.email}
              onChangeText={(text) =>
                this.setState({
                  user_data: {...this.state.user_data, email: text},
                })
              }
              onBlur={() => this.changeuserdata('email', 'Email address')}
            />
          </View>
          <View style={styles.separator} />

          <TouchableOpacity style={styles.navigator} onPress={this.todolist}>
            <Text style={styles.forwardtitle}>To do list</Text>
            <Image source={forward} style={styles.forwardarrow} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.password} onPress={this.addPassword}>
            <Text style={styles.passwordtitle}>{`Change Password   `}</Text>
            <Image source={password} style={styles.forwardarrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logout} onPress={this.logout}>
            <Text style={styles.logouttitle}>{'Logout  '} </Text>
            <Image source={logout} style={styles.forwardarrow} />
          </TouchableOpacity>
        </View>
        {this.renderPasswordModal()}
      </ScrollView>
    );
  }
}

export default Settings;
