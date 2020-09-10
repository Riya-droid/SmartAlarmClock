import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
    containerStyle: {
		backgroundColor:"#F6F7F9"
	},
	topbar: {
		width: '100%',
		height: 250
	},
	background: {
		flex: 1,
		resizeMode: 'stretch',
		fontFamily: 'Source Sans Pro',
		paddingTop:20
	},
	username:{
		color:"#fff",
		paddingVertical:5,
		marginLeft:35,
		fontSize:14
	},
	liststyle:{
		marginTop:-150,
		width:Dimensions.get('window').width * 0.85,
		alignSelf:"center"
	},
	row:{
		backgroundColor:"white",
		marginVertical:2,
		height:55,
		paddingLeft:20,
		borderRadius:5,
		flexDirection:"row",
		alignItems:"center"
	},
    text:{
        fontSize:12,
        marginRight:15,
        flex:1,
        alignSelf:"center"
    },
    forward:{
        width:40,
        height:14,
        resizeMode:"contain",
        marginRight:20,
        marginLeft:5,
        marginTop:5
	},
	rowback:{
		width:50,
		height:55,
		marginTop:2,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:"#D62246",
		borderRadius:5,
		overflow:'hidden'
	},
	deleteimage:{
		height:15,
		width:15,
		resizeMode:'contain'
	},
	newbutton:{
		height:70,
		position:'absolute',
		bottom:0,
		width:Dimensions.get('window').width,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:"#507df0"
	},
	newtext:{
		fontSize:14,
		color:"#fff"
	},
    textinput:{
        height:40,
        borderWidth:1,
        marginTop:7,
        paddingLeft:20,
        color:"#131D4A",
        fontSize: 12,
		borderColor:"#E6E6E6",
		width:"80%",
		alignSelf:"center"
    },
})

export default styles