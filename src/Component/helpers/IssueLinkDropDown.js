import React from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet, Dimensions, Modal } from 'react-native';

import ModalDropdown from './ModalDropDown';

import drop from '../../assets/dropdown.png';

/**
 * @param dropdown
 * @param value
 * @param name
 * @param getValue
 * @param label
 */

class DropDown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			dropdown: props.dropdown
		};
	}

	UNSAFE_componentWillReceiveProps(newprops){
		this.setState({
			value: newprops.value,
			dropdown: newprops.dropdown
		})
	}
	getValue = (key,value)=>{
		this.props.getValue(key,value,this.props.index)
	}

	render() {
		return (
			<View style={{ width: Dimensions.get('window').width * 0.85, alignSelf: 'center' }}>
				<ModalDropdown
					options={this.state.dropdown}
					style={styles.input}
					defaultValue={this.state.value}
					getValue={this.getValue}
					name={this.props.name}
					disabled={this.props.disabled}
				/>
				<Text style={styles.label}>{`${this.props.label}  `}</Text>
				<Image source={drop} style={styles.dropdownimage} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: 'rgba(230,230,230,1)',
		width: Dimensions.get('window').width * 0.85,
		height: 55,
		alignSelf: 'center',
		marginTop: 10
	},
	label: {
		paddingLeft: 15,
		fontSize: 12,
		fontWeight: '700',
		color: 'rgba(80,86,101,0.5)',
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 20,
		zIndex: 0
	},
	dropdownimage: {
		width: 15,
		height: 15,
		resizeMode: 'contain',
		position: 'absolute',
		top: 30,
		right: 17
	}
});

export default DropDown;
