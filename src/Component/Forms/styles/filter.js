import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'


const styles = StyleSheet.create({
    container:{
        backgroundColor:"#fff",
        fontFamily:"Source Sans Pro",
        height:190
    },
    topbar:{
        backgroundColor:"#507df0",
        height:60,
        flexDirection:"row"
    },
    navheading:{
        color:"#fff",
        fontSize:20,
        flex:1,
        alignSelf:"center",
        fontWeight:"bold",
        marginLeft:25
    },
    searchcontainer:{
        width:60,
        height:60,
        marginRight:20,
        padding:12,
        justifyContent:"center"
    },
    searchimage:{
        resizeMode:"contain",
        width:17,
        height:17,
        alignSelf:"flex-end"
    },
    searchbar:{
        width: Dimensions.get('window').width * 0.9,
        height: 35,
        paddingLeft:15,
        borderWidth:1,
        borderColor:"#fff",
        color:"#fff",
        fontSize:13,
        backfaceVisibility:"hidden",
        alignSelf:"center",
        marginLeft:25
    },
    closeimagecontainer:{
        width:60,
        height:60,
        marginLeft:-70,
        padding:12,
        justifyContent:"center"
    },
    closeimage:{
        resizeMode:"contain",
        width:12,
        height:12,
        alignSelf:"flex-end"
    },
    filterbar:{
        height:80,
        backgroundColor:"#507df0",
        flex:1,
        flexDirection:"row"
    },
    activefilter:{
        backgroundColor:"#fff",
        height:30,
        borderRadius:5,
        justifyContent:"center",
        paddingHorizontal:10,
        marginRight: 15,
        marginTop:10
    },
    firstfilter:{
        marginLeft:25
    },
    normalfilter:{
        backgroundColor: "rgba(144,183,251,0.76)",
        height:30,
        borderRadius:5,
        justifyContent:"center",
        paddingHorizontal:10,
        marginRight: 15,
        marginTop:10
    },
    activefiltertext:{
        color:"#131d4a",
        fontSize:13
    },
    filtertext:{
        color:"#fff",
        fontSize:13
    }
})

export default styles;