import React from 'react';
import { StyleSheet, Text, TextInput, Dimensions, Image ,View} from 'react-native';

import correct from '../../assets/correct.png';
import errorimage from '../../assets/error.png';

/**
 * @param label
 * @param placeholder
 * @param value
 * @param validationarray
 * @param key
 * @param getValue
 */
class TextArea extends React.Component {
	constructor(props) {
		super(props);
		this.validationarray = props.validate;
		this.state = {
			active: false,
			value: props.value,
			source: correct,
			error: ''
		};
	}

	UNSAFE_componentWillReceiveProps(newprops){
		this.setState({
			value: newprops.value
		})
	}

	endEditing = () => {
		this.setState({ active: false },()=>this.props.getValue(this.props.name,this.state.value));
	};

	validation = (type,val) => {
		switch (type) {
			case 'empty':
				if (val.length > 0){
					return ""
				}else{
					return "Can't be empty"
				}
			case 'number':
				if (!isNaN(val)){
					return ""
				}else{
					return "Should be a number"
				}
			default:
				return ""
		}
	};

	checkInput = (text) => {
		let err = ''
		for (let i = 0; i < this.validationarray.length; i++) {
			let filter = this.validationarray[i];
			if(err == ''){
				err = this.validation(filter,text)
				if (err != ''){
					break
				}
			}
		}
		if(err == ""){
			this.setState({ value: text, error:err,source:correct },()=>this.props.getValue(this.props.name,this.state.value));
		}else{
			this.setState({ value: text, error:err,source:errorimage },()=>this.props.getValue(this.props.name,this.state.value));
		}
	};

	render() {
		let props = this.props;
		return (
			<View style={{width:Dimensions.get('window').width *0.85,alignSelf:"center"}}>
				<TextInput
					style={this.state.active ? styles.active : styles.input}
					placeholder={props.placeholder}
					onTouchStart={() =>{ (this.props.editable) ? this.setState({ active: true }):null}}
					onBlur={() => this.endEditing()}
					defaultValue={this.state.value}
					onChangeText={(text) => this.checkInput(text)}
					editable={this.props.editable}
                    keyboardType={(this.props.keyboardType) ? this.props.keyboardType : "default"}
                    multiline={true}
                    numberOfLines={4}
				/>
				<Text
					style={[
						styles.label,
						this.state.error == ''
							? this.state.active ? { marginBottom: 7 } : { marginBottom: 33 }
							: this.state.active ? { marginBottom: 7 } : { marginBottom: 14 }
					]}
				>
					{props.label}
				</Text>
				{this.state.active ? (
					<Image
						source={this.state.source}
						style={[
							styles.validation,
							this.state.error == '' ? { marginBottom: 15 } : { marginBottom: 0 }
						]}
					/>
				) : null}
				{this.state.error != '' ? <Text style={styles.error}>{this.state.error}</Text> : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	input: {
		flex: 1,
		paddingLeft: 15,
		color: '#131d4a',
		fontSize: 12,
		height: 155,
		borderWidth: 1,
		borderColor: 'rgba(230,230,230,0.6)',
		backgroundColor: 'rgba(230,230,230,0.6)',
		marginTop: 10,
		paddingTop: 25,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center'
	},
	active: {
		flex: 1,
		paddingLeft: 15,
		color: '#131d4a',
		fontSize: 12,
		height: 155,
		borderWidth: 1,
		borderLeftWidth: 3,
		backgroundColor: 'transparent',
		marginTop: 10,
		paddingTop: 25,
		width: Dimensions.get('window').width * 0.85,
		alignSelf: 'center',
		borderTopColor: 'rgba(230,230,230,0.6)',
		borderBottomColor: 'rgba(230,230,230,0.6)',
		borderRightColor: 'rgba(230,230,230,0.6)',
		borderLeftColor: '#5988FF',
	},
	label: {
		flex: 1,
		fontSize: 12,
		fontWeight: '700',
		color: 'rgba(80,86,101,0.36)',
		width: Dimensions.get('window').width * 0.8,
        alignSelf: 'center',
        position:"absolute",
        top:20,
        left:15,
        zIndex:1
	},
	validation: {
		width: 18,
		height: 18,
        resizeMode: 'contain',
        position:"absolute",
        right:17,
        top:30
	},
	error: {
		color: '#D62246',
		fontSize: 12,
        textTransform:"uppercase",
        position:"absolute",
        top:170,
        left:15
	}
});
export default TextArea;
