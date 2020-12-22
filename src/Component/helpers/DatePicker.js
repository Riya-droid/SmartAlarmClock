import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import calender from '../../assets/calender.png';

class DatePicker extends React.Component {
	constructor(props) {
		super(props);
		this.date = '';
		this.state = {
			value: props.value != '' && props.value != null ? this.convertdate(props.value) : '',
			showdate: false,
			mode: 'date',
			date: props.value != '' && props.value != null ? new Date(Date.parse(props.value)) : new Date(),
			showtime: false
		};
	}

	convertdate = (date) => {
		let monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		let formatted = new Date(Date.parse(date));

		var hr = formatted.getHours();
		var min = formatted.getMinutes();
		var ampm = 'AM';
		if (hr > 12) {
			hr -= 12;
			ampm = 'PM';
		}
		formatted =
			monthNames[formatted.getMonth()] +
			' ' +
			formatted.getDate() +
			', ' +
			formatted.getFullYear() +
			' ' +
			hr +
			':' +
			min +
			' ' +
			ampm;
		return formatted;
	};

	UNSAFE_componentWillReceiveProps(newprops) {
		if (newprops.value != '' && newprops.value != null) {
			this.setState({
				value: this.convertdate(newprops.value),
				date: new Date(Date.parse(newprops.value))
			});
		}
	}

	showdate = () => {
		this.setState({ showdate: true });
	};

	setDate = (date) => {
		this.date = date;
		this.setState({showdate:false},()=>{
			setTimeout(() => {
				this.setState({showtime:true})
			}, 500);
		})
	};
	
	setTime = (time) => {
		var dd = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();
		var MM = ((this.date.getMonth() + 1) < 10 ? '0' : '') + (this.date.getMonth() + 1); 
		let date = this.date.getFullYear()+"-"+MM+"-"+dd
		var hr = time.getHours();
		var min = time.getMinutes();
		var sec = time.getSeconds()
		var ms = String(time.getMilliseconds()).padStart(3, '0')
		time = hr+":"+min+":"+sec+":"+ms
		let t = (date+" "+time).split(/[- :]/)
		let newdate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
		this.setState({
			showtime:false,
			date:newdate,
			value: this.convertdate(newdate)
		},()=>this.props.setValue(this.props.name,newdate.toISOString()))
	};

	render() {
		return (
			<React.Fragment>
				<TouchableOpacity
					activeOpacity={1}
					onPress={this.showdate}
					style={{ width: Dimensions.get('window').width * 0.85, alignSelf: 'center' }}
				>
					<Text style={styles.value}>{this.state.value}</Text>
					<Text style={styles.label}>{this.props.label}</Text>
					<View style={styles.dropbuttoncontainer}>
						<Image source={calender} style={styles.image} />
					</View>
				</TouchableOpacity>
				<DateTimePickerModal
					isVisible={this.state.showdate && this.props.editable}
					onConfirm={this.setDate}
					onCancel={() => this.setState({ showdate: false, showtime: false })}
					mode="date"
					headerTextIOS="Pick date"
					maximumDate={(this.props.maximumDate) ? this.props.maximumDate : new Date(2030,12,31)}
					minimumDate={(this.props.minimumDate) ? this.props.minimumDate : this.state.date}
					date={this.state.date}
				/>
				<DateTimePickerModal
					isVisible={this.state.showtime && this.props.editable}
					onConfirm={this.setTime}
					onCancel={() => this.setState({ showdate: false, showtime: false })}
					mode="time"
					headerTextIOS="Pick time"
					date={this.state.date}
				/>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	value: {
		flex: 1,
		paddingLeft: 15,
		color: '#131d4a',
		fontSize: 12,
		height: 55,
		borderWidth: 1,
		borderColor: 'rgba(230,230,230,0.6)',
		backgroundColor: 'rgba(230,230,230,0.6)',
		marginTop: 10,
		paddingTop: 25,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center'
	},
	label: {
		flex: 1,
		fontSize: 12,
		fontWeight: '700',
		color: 'rgba(80,86,101,0.36)',
		marginTop: -47,
		marginLeft: 30,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center',
		marginBottom: 33
	},
	dropbuttoncontainer: {
		position: 'absolute',
		right: 17,
		top: 30
	},
	image: {
		width: 15,
		height: 15,
		resizeMode: 'contain'
	},
	datepicker: {
		position: 'absolute',
		top: 100,
		height: 100
	}
});

export default DatePicker;
