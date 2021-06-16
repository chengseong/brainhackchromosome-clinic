import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../components/home.js'
import bookConsult1 from '../components/bookConsult1.js';
import bookConsult2 from '../components/bookConsult2.js';
import bookConsult3 from '../components/bookConsult3.js';

const Stack = createStackNavigator()

export default function HomeStack({navigation}) {
    return (
        <Stack.Navigator screenOptions = {{headerShown: false}} initialRouteName = "Home">
            <Stack.Screen name = "Home" component = {Home} />
            <Stack.Screen name = "bookConsult1" component = {bookConsult1} />
            <Stack.Screen name = "bookConsult2" component = {bookConsult2} />
            <Stack.Screen name = "bookConsult3" component = {bookConsult3} />
        </Stack.Navigator>
    );
};