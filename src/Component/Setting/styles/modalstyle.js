import React from 'react'
import { StyleSheet, Dimensions} from 'react-native'

const modal = StyleSheet.create({
    background:{
        backgroundColor:"#000",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        opacity:0.7
    },
    container:{
        width: Dimensions.get('window').width * 0.8,
        backgroundColor:"#fff",
        opacity:1,
        height:500,
        maxHeight:366,
        marginTop: -200 - (Dimensions.get('window').height/2),
        alignSelf:"center"
    },
    closemodal:{
        marginLeft:"auto",
        width:50,
        height:50,
        padding:18,
        marginBottom: 10
    },
    closeimage:{
        flex:1,
        marginLeft:-45,
        resizeMode:"contain"
    },
    topimage:{
        width:60,
        height:60,
        resizeMode:"contain",
        alignSelf:"center",
        marginTop:-20,
        marginBottom:10
    },
    passwordbox:{
        borderBottomWidth:1,
        borderColor:"#131d4a",
        color:"#131d4a",
        paddingLeft:10,
        width: Dimensions.get('window').width * 0.6,
        height:40,
        alignSelf:"center",
        marginTop:5,
        fontSize:12
    },
    savebutton:{
        width:100,
        height:40,
        paddingVertical:4,
        paddingHorizontal:8,
        backgroundColor:"#1CA49F",
        fontSize:14,
        alignContent:"center",
        justifyContent:"center",
        color:"#fff",
        alignSelf:"center",
        borderRadius:5,
        marginTop:30,
        marginBottom:50
    },
    slider:{
        width: Dimensions.get('window').width * 0.6,
        flexDirection:'row',
        alignSelf:"center"
    },
    text:{
        flex:1,
        fontSize:12,
        lineHeight:40
    },
    container2:{
        width: Dimensions.get('window').width * 0.8,
        backgroundColor:"#fff",
        opacity:1,
        height:500,
        maxHeight:405,
        marginTop: -200 - (Dimensions.get('window').height/2),
        alignSelf:"center"
    },
})

export default modal