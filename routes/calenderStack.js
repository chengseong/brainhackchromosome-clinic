import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Calendar from '../components/Calender.js'

const Stack = createStackNavigator()

export default function HomeStack({navigation}) {
    return (
        <Stack.Navigator screenOptions = {{headerShown: false}}>
            <Stack.Screen name = "Calendar" component = {Calendar} />
        </Stack.Navigator>
    );
};