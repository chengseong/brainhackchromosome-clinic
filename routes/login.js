import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


//Import Components for this stack 
import loginPage from '../components/loginPage.js'
import registrationPage from '../components/registrationPage'



const Stack = createStackNavigator()

function loginStack() {
    return (
        <Stack.Navigator screenOptions = {{headerShown: false}}>
            <Stack.Screen name = "loginPage" component = {loginPage}/>
            <Stack.Screen name = "registrationPage" component = {registrationPage}/>
        </Stack.Navigator>
    );
};

export default loginStack;