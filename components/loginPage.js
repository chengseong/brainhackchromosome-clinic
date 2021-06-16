import * as React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';
import axios from 'axios';
import { loginContext } from '../shared/loginContext.js';




function loginPage({navigation}) {
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {setLoggedIn, setUserID} = React.useContext(loginContext);

    function goToRegistration() {
        navigation.navigate("registrationPage")
    }

    function logIn() {

        axios.get(`http://192.168.1.10:3000/api/authClinic/login/${userName}/${password}`).then((res) => {
            if (res.status == 200) {
                console.log(true);
                setUserID(res.data.userId)
                setLoggedIn(true)
            }
        }).catch(err => {
            console.log(err)})
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style = {styles.container}> 
                <View style = {{flex : 0.5, marginLeft: 40}}>
                    <Text style = {{fontSize: 40, color: '#44C636', fontFamily: 'roboto-light'}}>Welcome to</Text>
                    <Text style = {{fontSize: 40, color: '#44C636', fontFamily: 'roboto-light'}}>TeleConsult</Text>    
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="user" size={32} color="#44BD37" style = {styles.icon}/>
                    <TextInput 
                        placeholder = "Username" 
                        style = {styles.inputFields} 
                        value = {userName} 
                        autoCorrect = {false}
                        autoCapitalize = 'none'
                        onChangeText = {input => setUserName(input)}></TextInput>
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="lock" size={32} color = "#44BD37" style = {styles.icon}/>    
                    <TextInput placeholder = "Password" style = {styles.inputFields} value = {password} secureTextEntry = {true} onChangeText = {input => setPassword(input)}></TextInput>
                </View>
                <View style = {{flex: 0.5, marginTop : 60, marginLeft : Dimensions.get('screen').width * 0.35}}>
                <TouchableOpacity 
                    style = {styles.bookingButton}
                    onPress = {logIn}>
                        <Text style = {styles.buttonText}>Login</Text>
                </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Dimensions.get('screen').height * 0.13,
    },
    inputFields : {
        flex:1,
        fontSize: 20,
        width:"80%"
    },
    textContainer : {
        flex: 0.25, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        padding:20,
        marginLeft:10
    },
    bookingButton: {
            flexDirection:'row',
            backgroundColor: '#4cd964',
            height: 40,
            width: 100,
            borderRadius:25,
            marginBottom: 10,
            justifyContent:'center',
            alignContent:'center',
        },
        buttonText: {
            marginTop: 7,
            fontFamily: 'roboto-bold',
            fontSize:20,
            color: 'white'
    }
});

export default loginPage; 