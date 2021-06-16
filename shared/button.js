import React from 'react';
import { Text, TouchableOpacity, StyleSheet  } from 'react-native';

export default function Button({onPress, text}){
    return(
    <TouchableOpacity 
        style = {styles.bookingButton}
        onPress = {onPress}>
            <Text style = {styles.buttonText}>{text}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    bookingButton: {
        flexDirection:'row',
        backgroundColor: '#5464F8',
        height: 40,
        width: 250,
        borderRadius:25,
        marginBottom: 30,
        justifyContent:'center',
        alignContent:'center',
    },
    buttonText: {
        marginTop: 7,
        fontFamily: 'roboto-regular',
        fontSize:20,
        color: 'white'
    }
})