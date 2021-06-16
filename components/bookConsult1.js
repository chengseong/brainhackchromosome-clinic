import * as React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView from 'react-native-maps';
import Button from '../shared/button';
import AppLoading from 'expo-app-loading';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';

function bookConsult1({navigation}) {
    //To pull from backend
    const [clinicArr, setClinicArr] = React.useState([])
    const [selectedClinic, setSelectedClinic] = React.useState({})
    const [clinicLoaded, setClinicLoaded] = React.useState(false)
    const [doctorName, setDoctorName] = React.useState("")
    const [consultType, setConsultType] = React.useState("Physical")

    
    React.useEffect(() => {
        axios.get("http://192.168.86.221:3000/api/authClinic/allClinics").then(response => {
            setClinicArr(response.data);
            setSelectedClinic(response.data[0])
            //setDoctorName
        }).then(() => setClinicLoaded(true));
      }, []);

    function goNext() {
        if (doctorName == "") {
            console.log("hello")
            return
        } else {navigation.navigate("bookConsult2", {
            clinicID : selectedClinic._id,
            doctorName : doctorName,
            consultType : consultType
        })}
    }
    
    
    /*const [clinicArr, setClinicArr] = React.useState([
        {name: "Clinic 1", address : "TestAddress1", email : "123@gmail.com", phoneNumber:"88888888", lat: 1.3214 , lon: 103.8458},
        {name: "Clinic 2", address : "TestAddress2", email : "456@gmail.com", phoneNumber:"77777777", lat: 1.3338 , lon: 103.7453},
        {name: "Clinic 3", address : "TestAddress3", email : "789@gmail.com", phoneNumber:"66666666", lat: 1.3402 , lon: 103.9496},
    ])*/

    
    if (clinicLoaded) {
        return (
        <ScrollView 
            backgroundColor='white' 
            style = {{flexGrow:1}}
            showsVerticalScrollIndicator={false}>
            <View style = {styles.container}>
            <View style = {styles.header}>
                <Text style = {styles.headerText}>Book a Consultation</Text>
            </View>
                <View style = {styles.selectClinicContainer}>
                    <Text style = {styles.subHeaderText}>Select a Clinic</Text>
                    <View marginVertical={10}>
                        <Picker
                            selectedValue = {selectedClinic}
                            onValueChange = {(clinic) => {setSelectedClinic(clinic)}}
                            >
                            {clinicArr.map((item) => (
                            <Picker.Item label = {item.clinicName} value = {item} key = {item.address}/>  
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style = {{flex:1, marginLeft: 30, marginTop: 30}}> 
                    <Text style = {styles.subHeaderText}>Clinic Details</Text>
                    <View
                    marginTop={10}>
                        <Text style = {styles.subsubHeaderText}>Address</Text>
                        <Text style = {styles.detailsText}>{selectedClinic.address.split(", ")[0]}</Text>
                        <Text style = {styles.detailsText}>{selectedClinic.address.split(", ")[1]}</Text>
                        <MapView style={styles.map} 
                        scrollEnabled = {false}
                        region={{
                            latitude: parseFloat(selectedClinic.lat),
                            longitude: parseFloat(selectedClinic.long),
                            latitudeDelta: 0.0032,
                            longitudeDelta: 0.0032,
                            scrollEnabled: false,
                        }}/> 

                    </View>
                    <View style = {{flex: 0.25, marginTop: 20,}}>
                        <View style = {{flex:0, marginTop:5}}>
                            <Text style = {styles.subsubHeaderText}>Email </Text>
                            <Text style = {styles.detailsText}>{selectedClinic.email}</Text>
                        </View>
                        <View style = {{flex:0, marginTop:10}}>
                            <Text style = {styles.subsubHeaderText}>Phone </Text>
                            <Text style = {styles.detailsText}>{selectedClinic.phoneNumber}</Text>
                        </View>
                        <View style = {{flex:0, marginTop:30}}> 
                            <Text style = {styles.subHeaderText}>Select Consultation Type</Text>
                            <View style = {{flex:0, flexDirection:'row', alignItems: 'center', marginTop: 10}}> 
                                <RadioButton 
                                    value = "Physical" 
                                    status = {consultType === "Physical" ? 'checked' : 'unchecked'}
                                    onPress = {() => setConsultType("Physical")}
                                    color = "#2329D6"/>
                                <Text>Physical </Text>
                            </View>
                            <View style = {{flex:0, flexDirection:'row', alignItems: 'center'}}>    
                                <RadioButton 
                                    value = "Virtual" 
                                    status = {consultType === "Virtual" ? 'checked' : 'unchecked'}
                                    onPress = {() => setConsultType("Virtual")}
                                    color = "#2329D6"/> 
                                    <Text>Virtual </Text>
                            </View>
                        </View>
                        <View style = {{flex:0, marginTop:30, width: Dimensions.get('screen').width * 0.8}}> 
                            <Text style = {styles.subHeaderText}> Select your Doctor</Text>
                            <Picker
                                selectedValue = {doctorName}
                                onValueChange = {(doctor) => {setDoctorName(doctor)}}
                                >
                                {selectedClinic.doctors.map((name) => (
                                <Picker.Item label = {name} value = {name} key = {name}/>  
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
                <View style = {{flex:0.1,justifyContent:"center", alignItems:"center", marginTop:40 }}>
                    <Button
                        onPress={() => goNext()}
                        text='Next'/>
                </View>
            </View>
        </ScrollView>
    )} else {
        return <AppLoading 
        onFinish={() => setClinicLoaded(true)}
        onError={console.warn}/>
    }
} 

const styles = StyleSheet.create({
    container: {
        paddingTop: Dimensions.get('screen').height * 0.1,
        flex: 1,
        backgroundColor: 'white',
    },
    header : {
        flex:0.1,
        marginLeft:30,
    },
    selectClinicContainer : {
        paddingTop: 20,
        flex : 0.5,
        width: Dimensions.get('screen').width * 0.8,
        marginLeft:30,
    },
    headerText: {
        fontSize: 32,
        fontFamily:'roboto-bold'
    },
    subHeaderText: {
        fontSize:25,
        fontFamily:'roboto-bold'
    },
    subsubHeaderText : {
        fontFamily:'roboto-light',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 2,
    },
    detailsText:{
        fontFamily: 'roboto-regular',
        fontSize: 16,  
    },
    icon: {
        color:"#2329D6",
        padding:0
    },
    map : {
        width: Dimensions.get('screen').width * 0.8,
        height: Dimensions.get('screen').height * 0.2,
        borderRadius: 15,
        marginTop: 10
    },
});

export default bookConsult1;