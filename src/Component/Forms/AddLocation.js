import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
} from 'react-native';

import form from './styles/formstyle';

import { Slidebutton, DatePicker, InputField, TextArea } from '../helpers';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


import Snackbar from 'react-native-snackbar';

import back from '../../assets/back.png';

import database from '@react-native-firebase/database';

import Loader from '../Loader';
import auth from '@react-native-firebase/auth';

export class AddLocation extends React.Component {
    constructor(props) {
        super(props);
        let initialValue = {
            title: '',
            desc: '',
            date: '',
            edit: false,
            start_id: '',
            end_id: ''
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
                edit: initialValue.edit,
                start_id: initialValue.start_id,
                end_id: initialValue.end_id
            },
            time: 0,
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

            let reminders = database().ref('locations').child(uid)
            if (this.state.editdata.edit) {
                reminders = reminders.child(this.data.key)
            } else {
                reminders = reminders.push();
            }
            if (this.state.time == 0 || !this.state.time) {
                Snackbar.show({
                    text: 'Please choose valid waypoints',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#D62246',
                });
                this.setState({ reload: true }, () => this.setState({ reload: false }));
            }
            let calculated_alarm = new Date(this.state.editdata.date) - (this.state.time * 1000)

            reminders
                .set({
                    title: this.state.editdata.title,
                    date: this.state.editdata.date.toString(),
                    desc: this.state.editdata.desc,
                    alarm: calculated_alarm,
                    start_id: this.state.editdata.start_id,
                    end_id: this.state.editdata.end_id
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

    calculateDirections = () => {
        let { start_id, end_id } = this.state.editdata
        if (start_id == '' || end_id == '' || !start_id || !end_id) return

        try {
            fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${start_id}&destination=place_id:${end_id}&key=GOOGLE_API_KEY`).then(res => res.json()).then(res => {
                let routes = res.routes
                if (res.status != 'OK') {
                    Snackbar.show({
                        text: 'There is no possible path between starting point and endpoint',
                        textColor: 'white',
                        backgroundColor: 'red'
                    })
                    return
                }
                if (routes && Array.isArray(routes) && routes.length > 0) {
                    let legs = routes[0].legs
                    if (legs && Array.isArray(legs) && legs.length > 0) {
                        let duration = legs[0].duration
                        if (duration && duration.value) {
                            this.setState({
                                time: duration.value
                            })
                        }
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

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
                    <Text style={form.heading}>{this.state.editdata.edit ? 'Edit Location' : `Add Location`}</Text>
                </View>
                <ScrollView style={form.mainform} nestedScrollEnabled={true}>
                    <View style={{ height: 120 }} />
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
                        label="Enter destination time"
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

                <GooglePlacesAutocomplete
                    placeholder='Search start location'
                    styles={{ container: { height: 50, position: 'absolute', top: 170, width: Dimensions.get('window').width * 0.85, zIndex: 1, left: 30 }, listView: { position: 'absolute', top: 50, zIndex: 1000 } }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        this.setState({ editdata: { ...this.state.editdata, start_id: data.place_id } }, () => {
                            this.calculateDirections()
                        })
                    }}
                    query={{
                        key: 'GOOGLE_API_KEY',
                        language: 'en',
                    }}
                />
                <GooglePlacesAutocomplete
                    placeholder='Search destination location'
                    styles={{ container: { height: 50, position: 'absolute', top: 230, width: Dimensions.get('window').width * 0.85, left: 30 }, listView: { position: 'absolute', top: 50, zIndex: 1000 } }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        this.setState({ editdata: { ...this.state.editdata, end_id: data.place_id } }, () => {
                            this.calculateDirections()
                        })
                    }}
                    query={{
                        key: 'GOOGLE_API_KEY',
                        language: 'en',
                    }}
                />
                <Slidebutton submit={this.handleSubmit} reload={this.state.reload} />
                <Loader loading={this.state.loading} />
            </React.Fragment>
        );
    }
}
