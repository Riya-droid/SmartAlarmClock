import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import form from './styles/formstyle';

import { Slidebutton, DatePicker, InputField, TextArea } from '../helpers';

import Snackbar from 'react-native-snackbar';

import back from '../../assets/back.png';

import database from '@react-native-firebase/database';

import Loader from '../Loader';
import auth from '@react-native-firebase/auth';

export class AddReminder extends React.Component {
  constructor(props) {
    super(props);
    let initialValue = {
      title: '',
      desc: '',
      date: '',
      edit: false
    }
    if (props.route.params && props.route.params.data) {
      this.data = JSON.parse(props.route.params.data)
      initialValue.title = this.data.title
      initialValue.desc = this.data.desc
      initialValue.date = new Date(this.data.date)
      initialValue.edit = true
    }
    this.state = {
      editdata: {
        title: initialValue.title,
        desc: initialValue.desc,
        date: initialValue.date,
        edit: initialValue.edit
      },
      reload: false,
      loading: false,
    };
  }

  goback = () => {
    this.props.navigation.goBack(null);
  };

  validateForm = () => {
    if (this.state.editdata.title == '') {
      return 'Please fill the title of the reminder';
    }

    if (this.state.editdata.date == '') {
      return 'Please enter the date';
    }

    return false;
  };

  handleSubmit = () => {
    const { navigation } = this.props;
    let err = this.validateForm();
    if (!err) {
      this.setState({ loading: true });
      /**
       * save the data in database
       */

      let uid = auth().currentUser.uid;

      let reminders = database().ref('reminders').child(uid)
      if (this.state.editdata.edit) {
        reminders = reminders.child(this.data.key)
      } else {
        reminders = reminders.push();
      }

      reminders
        .set({
          title: this.state.editdata.title,
          date: this.state.editdata.date.toString(),
          desc: this.state.editdata.desc,
          alarm: new Date(this.state.editdata.date).getTime()
        })
        .then((res) => {
          this.setState({ loading: false }, () => {
            this.props.navigation.goBack(null);
          });
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Snackbar.show({
        text: err,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D62246',
      });
      this.setState({ reload: true }, () => this.setState({ reload: false }));
    }
  };

  getValue = (key, value) => {
    let ob = { ...this.state.editdata };
    ob[key] = value;
    this.setState({ editdata: ob });
  };

  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={{ backgroundColor: '#507df0' }} />
        <View style={form.topbar}>
          <TouchableOpacity
            activeOpacity={1}
            style={form.backcontainer}
            onPress={this.goback}>
            <Image source={back} style={form.backimage} />
          </TouchableOpacity>
          <Text style={form.heading}>{this.state.editdata.edit ? 'Edit Reminder' : `Add Reminder`}</Text>
        </View>
        <ScrollView style={form.mainform} nestedScrollEnabled={true}>
          <View style={{ height: 10 }} />
          <InputField
            placeholder="Enter Title"
            label="Title"
            value={this.state.editdata.title}
            validate={['empty']}
            name="title"
            getValue={this.getValue}
            editable={true}
          />
          <DatePicker
            label="Enter Time"
            value={this.state.editdata.date}
            name="date"
            setValue={this.getValue}
            editable={true}
          />
          <TextArea
            placeholder=""
            label="Description"
            value={this.state.editdata.desc}
            validate={[]}
            name="desc"
            getValue={this.getValue}
            editable={true}
          />
          <View style={{ height: 70 }} />
        </ScrollView>
        <Slidebutton submit={this.handleSubmit} reload={this.state.reload} />
        <Loader loading={this.state.loading} />
      </React.Fragment>
    );
  }
}
