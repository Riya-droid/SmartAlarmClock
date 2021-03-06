import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StyleSheet,
    Dimensions
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import Loader from '../Loader';
import { SwipeListView } from 'react-native-swipe-list-view';

import deleteimage from '../../static/deleterow.png';

class ToDos extends React.Component {
    state = {
        data: [],
        loading: true,
    };

    componentDidMount() {
        this.uid = auth().currentUser.uid;
        this.remindersRef = database().ref('todos').child(this.uid)

        this.remindersRef.on('value', (snapshot) => {
            this.setData(snapshot)
        });
    }

    setData(snapshot) {
        if (snapshot.val()) {
            this.setState({
                data: Object.keys(snapshot.val()).map(id => { return { key: id, ...snapshot.val()[id] } })
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
                    <View style={styles.reminder}>
                        <Text style={styles.dash}>To dos</Text>
                        <SwipeListView
                            data={this.state.data}
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
                    </View>
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

    dash: {
        fontSize: 18,
        fontWeight: '600',
        paddingLeft: 10,
        marginTop: 20
    },
    liststyle: {
        marginTop: 20,
        width: Dimensions.get('window').width,
        alignSelf: "center",
        paddingHorizontal: 10,
        maxHeight: 210
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
})

export default ToDos;
