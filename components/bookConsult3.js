import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import AppLoading from 'expo-app-loading';
import axios from 'axios'
import { StackActions, CommonActions} from '@react-navigation/native';
import Button from '../shared/button';

function bookConsult3({route, navigation}) {
    const clinicID = route.params.clinicId;
    console.log(clinicID)
    const date = route.params.date
    const time = route.params.time 
    const [clinic, setClinicName] = React.useState()
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        axios.get(`http://192.168.86.221:3000/api/authClinic/oneClinic/${clinicID}`).then(response => {
            console.log(response.data)
            setClinicName(response.data);
            setLoaded(true)
        })
      }, []);


    
    if (loaded) {return (
        <ScrollView 
            style = {{flexGrow: 1, backgroundColor:'white'}}
            showsVerticalScrollIndicator={false}>
            <View style = {styles.container}> 
                <View style = {styles.header}><Text style = {styles.headerText}>
                    Your appointment has been booked!
                    </Text> 
                </View>
                <View style = {{flex:0.2, marginLeft:30, marginTop:30}}> 
                    <Text style = {{fontSize:24, fontFamily: 'roboto-bold'}}>Appointment Details</Text>
                    <View style = {{flex:1, marginTop:5}}>
                        <Text style = {styles.subHeaderText}>Date</Text>
                        <Text style = {styles.detailsText}>{date}</Text>
                    </View>
                    <View style = {{flex:1, marginTop:5}}>
                        <Text style = {styles.subHeaderText}>Time</Text>
                        <Text style = {styles.detailsText}>{time}</Text>
                    </View>
                </View>
                <View style = {{flex:0.2, marginTop:30, marginLeft:30}}> 
                    <Text style = {{fontSize:24, fontFamily: 'roboto-bold'}}>{clinic.clinicName}</Text>
                </View>
                <View style = {{flex:0.2, marginLeft:30}}> 
                    <Text style = {styles.subHeaderText}>Address</Text> 
                    <Text style = {styles.detailsText}>{clinic.address}</Text>
                    <View style = {{flex:0.5}}>
                    <MapView style={styles.map} 
                    scrollEnabled = {false}
                    region={{
                        latitude: parseFloat(clinic.lat),
                        longitude: parseFloat(clinic.long),
                        latitudeDelta: 0.0032,
                        longitudeDelta: 0.0032,
                        }}/> 
                    </View>
                </View>      
                <View style = {{flex:0.2, marginLeft: 30, marginTop: 10}}> 
                    <View style = {{flex:0, marginTop:5, }}>
                        <Text style = {styles.subHeaderText}>Email</Text> 
                        <Text style = {styles.detailsText}>{clinic.email}</Text>
                    </View>
                    <View style = {{flex:0, marginTop:10}}>
                        <Text style = {styles.subHeaderText}>Phone</Text> 
                        <Text style = {styles.detailsText}>{clinic.phoneNumber}</Text>
                    </View>

                    <Text style = {{marginTop:20, fontFamily:'roboto-regular'}}>You will be reminded 15 minutes before your consultation.</Text>
                
                </View>      
                <View
                    marginTop={20}
                    flexDirection='row'
                    justifyContent='center'>
                    <Button onPress = {() => (navigation.dispatch(CommonActions.reset({index:1, routes:[{name: 'Home'}]})))}  text = "Return Home"></Button>
                </View>
            </View>
        </ScrollView>
    );} else {
        return <AppLoading 
        onFinish={() => setLoaded(true)}
        onError={console.warn}/>
    }
    
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Dimensions.get('screen').height * 0.1,
    },
    header : {
        flex:0.20,
        marginLeft:30,
        marginRight:30,
    },
    headerText : {
        fontSize: 32,
        fontFamily: 'roboto-bold'
    },
    subHeaderText : {
        fontFamily:'roboto-light',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 2,
    },
    detailsText:{
        fontFamily: 'roboto-regular',
        fontSize: 16,  
    },
    map : {
        width: Dimensions.get('screen').width * 0.8,
        height: Dimensions.get('screen').height * 0.2,
        borderRadius: 15,
        marginTop: 10
    },
});

export default bookConsult3;