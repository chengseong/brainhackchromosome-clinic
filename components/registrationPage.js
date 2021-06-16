import * as React from 'react';

import {View, Text, StyleSheet, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity} from 'react-native'
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons'; 
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'


function registrationPage({navigation}) {
    const [userName, setUserName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [emailAddress, setEmail] = React.useState('')
    const [phoneNumber, setPhoneNumber] = React.useState('')
    
    function registerAccount() {
        if (password != password) {
            return 
        } if (emailAddress.length == 0) {
            return
        } if (phoneNumber.length < 8) {
            return 
        } else {
            const registrationJson = {
                "username" : userName,
                "email":emailAddress,
                "password" : password,
                "phoneNumber" : phoneNumber    
            };

            axios.post("http://192.168.86.221:3000/api/auth/register", registrationJson).then((response)  => {

                console.log(response);
                navigation.navigate("loginPage") 
            }).catch(err => {
                console.log(err)})
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView 
                scrollEnabled={false}
                contentContainerStyle = {styles.container}> 
                <View style = {{flex : 0.2, marginLeft: 30}}>
                    <Text style = {{fontSize: 40, color: '#5969FE', fontFamily: 'roboto-light'}}>Sign up with us</Text>    
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="user" size={32} color="#5464F8" style = {styles.icon}/>
                    <TextInput 
                        placeholder = "Username" 
                        style = {styles.inputFields} 
                        value = {userName}
                        autoCorrect = {false}
                        autoCapitalize = 'none'
                        onChangeText = {input => setUserName(input)}></TextInput>
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="lock" size={32} color="#5464F8" style = {styles.icon}/>
                    <TextInput 
                        placeholder = "Enter Password" 
                        style = {styles.inputFields} 
                        value = {password} 
                        secureTextEntry = {true} 
                        autoCorrect = {false}
                        autoCapitalize = 'none'
                        onChangeText = {input => setPassword(input)}></TextInput>
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="lock" size={32} color="#5464F8" style = {styles.icon}/>
                    <TextInput 
                        placeholder = "Confirm Password" 
                        style = {styles.inputFields} 
                        value = {confirmPassword} 
                        secureTextEntry = {true} 
                        autoCorrect = {false}
                        autoCapitalize = 'none'
                        onChangeText = {input => setConfirmPassword(input)}></TextInput>
                </View>
                <View style = {{marginLeft:30}}>{password != confirmPassword && <Text style = {{color:"red"}}>Please ensure both passwords are the same</Text>}
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="mail" size={32} color="#5464F8" style = {styles.icon}/>
                    <TextInput 
                        placeholder = "Email" 
                        style = {styles.inputFields} 
                        value = {emailAddress} 
                        keyboardType='email-address'
                        autoCorrect = {false}
                        autoCapitalize = 'none'
                        onChangeText = {input => setEmail(input)}></TextInput>
                </View>
                <View style = {styles.textContainer}>
                    <AntDesign name="phone" size={32} color="#5464F8" style = {styles.icon}/>
                    <TextInput 
                        placeholder = "Phone Number" 
                        style = {styles.inputFields} 
                        value = {phoneNumber} 
                        keyboardType='number-pad'
                        onChangeText = {input => setPhoneNumber(input)}></TextInput>
                </View>
                <View style = {{flex:0.1, justifyContent:"center", flexDirection:'row', paddingTop: 80}}>
                    <TouchableOpacity 
                        style = {styles.bookingButton}
                        onPress = {registerAccount}>
                            <Text style = {styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
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
        fontSize: 20
    },
    textContainer : {
        flex: 0.1, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        padding:20,
        marginLeft:10,
        color:"#2329D6",
    },
    bookingButton: {
        flexDirection:'row',
        backgroundColor: '#5464F8',
        height: 40,
        width: 150,
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

export default registrationPage; 