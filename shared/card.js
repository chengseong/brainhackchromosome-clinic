import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Card(props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                { props.children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        height: 150,
        width: 150,
        borderRadius: 15,
        backgroundColor: '#4cd964',
        marginRight: 10,
        marginBottom: 20,
    },
    cardContent:{
        marginHorizontal: 18,
        marginVertical: 15,
    }
})