import React from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

import minus from '../../assets/minus.png';
import plus from '../../assets/plus.png';

class IncrementField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '0',
			intvalue: 0,
			unit: "",
			active:false
		};
	}

	componentDidMount() {
		this.setState({
			value: this.props.value,
			intvalue: parseInt(this.props.value),
			unit: this.props.unit
		});
	}

	UNSAFE_componentWillReceiveProps(newprops){
		this.setState({
			value: newprops.value,
			intvalue: parseInt(newprops.value),
			unit:newprops.unit
		});
	}

	onChangeText = (text) => {
		if (!isNaN(text) && parseInt(text)>0){
			this.setState({
				value:text,
				intvalue: parseInt(text),
			},()=>this.props.getValue(this.props.name,this.state.value))
		}else if (text == ''){
			this.setState({
				value:text,
				intvalue: 0
			},()=>this.props.getValue(this.props.name,this.state.value))
		}
	}

	increaseValue =() => {
		this.setState({
			value: (this.state.intvalue+1).toString(),
			intvalue: this.state.intvalue+1
		},()=>this.props.getValue(this.props.name,this.state.value))
	}

	decreaseValue =() => {
		if(this.state.intvalue - 1 > 0){
			this.setState({
				value: (this.state.intvalue-1).toString(),
				intvalue: this.state.intvalue-1
			},()=>this.props.getValue(this.props.name,this.state.value))
		}
	}

	render() {
		return (
			<View style={{ width: Dimensions.get('window').width * 0.85, alignSelf: 'center' }}>
				<TextInput
					style={(this.state.active)? style.active : style.input}
					placeholder={this.props.placeholder}
					keyboardType="numeric"
					value={this.state.value}
					onChangeText={(text)=>this.onChangeText(text)}
					editable={this.props.editable}
					onTouchStart={()=>this.setState({active:true})}
					onBlur={()=>this.setState({active:false})}
				/>
				<Text style={style.label}>{`${this.props.label} ( in ${this.props.unit})`}</Text>
				<TouchableOpacity activeOpacity={1} style={style.decrementbuttoncontainer} onPress={this.decreaseValue}>
					<Image source={minus} style={style.image} />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={1} style={style.incrementbuttoncontainer} onPress={this.increaseValue}>
					<Image source={plus} style={style.image} />
				</TouchableOpacity>
			</View>
		);
	}
}

const style = StyleSheet.create({
	input: {
		flex: 1,
		paddingLeft: 15,
		color: '#131d4a',
		fontSize: 12,
		height: 55,
		borderWidth: 1,
		borderColor: 'rgba(230,230,230,0.6)',
		backgroundColor: 'rgba(230,230,230,0.6)',
		marginTop: 10,
		paddingTop: 20,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center'
	},
	active: {
		flex: 1,
		paddingLeft: 15,
		color: '#131d4a',
		fontSize: 12,
		height: 55,
		borderWidth: 1,
		borderLeftWidth: 3,
		backgroundColor: 'transparent',
		marginTop: 10,
		paddingTop: 20,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center',
		borderTopColor: 'rgba(230,230,230,0.6)',
		borderBottomColor: 'rgba(230,230,230,0.6)',
		borderRightColor: 'rgba(230,230,230,0.6)',
		borderLeftColor: '#5988FF'
	},
	label: {
		flex: 1,
		fontSize: 12,
		fontWeight: '700',
		color: 'rgba(80,86,101,0.36)',
		position: 'absolute',
		top: 20,
		paddingLeft: 15,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center'
	},
	decrementbuttoncontainer: {
		width: 55,
		height: 55,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: 56,
		top: 10
	},
	incrementbuttoncontainer: {
		width: 55,
		height: 55,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: 0,
		top: 10
	},
	image: {
		width: 18,
		height: 18,
		resizeMode: 'contain'
	}
});

export default IncrementField;
