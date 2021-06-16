import * as React from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Dimensions,} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { getToday } from 'react-native-modern-datepicker';
import {Picker} from '@react-native-picker/picker';
import Button from '../shared/button';
import axios from 'axios'
import moment from 'moment'
import { userIDContext } from '../shared/userContext';
import AppLoading from 'expo-app-loading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'



function bookConsult2({route, navigation}) {
    const currDate = getToday().replace("/", "-").replace("/", "-")
    const clinicID = route.params.clinicID;
    const consultType = route.params.consultType;
    const doctorName = route.params.doctorName;
    console.log(doctorName);
    console.log(consultType)
    const[clinicAppts, setClinicAppts] = React.useState([])
    const userID = React.useContext(userIDContext);
    const [timeSlotArr, setTimeSlotArr] = React.useState('')
    const [loaded, setLoaded] = React.useState(false)
    const [date, setDate] = React.useState('')
    const [dateSelected, setDateSelected] = React.useState(false)
    const [selectedTime, setSelectedTime] = React.useState("")
    const [description, setDescription] = React.useState("")

    React.useEffect(() => {
        axios.get(`http://192.168.86.221:3000/api/appointments/getClinicAppointments/${clinicID}`).then(response => {
            setClinicAppts(response.data)
            console.log(clinicAppts)
        }).then(() => setLoaded(true));
    }, []);  
    
    function changeDate(newDate) {
        //Need to filter date here
        console.log(clinicAppts)
        console.log(newDate)
        const sameDateAppointments = clinicAppts.filter(appt => appt.date == newDate)
        const bookedSlots = sameDateAppointments.map(appt => appt.time)
        const temp = []
        var startTime = moment().utc().set({"hour":9, "minute": 0});
        var endTime = moment().utc().set({"hour":17, "minute": 0});
        while (startTime <= endTime) {
            const tempTime = moment(startTime)
            const stringTime = tempTime.format("hh:mm")
            
            if (bookedSlots.includes(stringTime)) {
                console.log("Booked")
            } else {
                temp.push(new moment(startTime).format('HH:mm'))
            }
            startTime.add(30, 'minute')
        }
        setTimeSlotArr(temp)
        setSelectedTime(temp[0])

        setDate(newDate);
        setDateSelected(true);
    }

    function completeBooking() {
        const editedDate = date.replace("/", "-").replace("/", "-")
        const apptData = {
            clinicId : clinicID,
            patientId : userID, 
            date : editedDate,
            time : selectedTime,
            content : description,
            doctorsName: doctorName,
            consultType : consultType
        }
        console.log(apptData)
        axios.post("http://192.168.86.221:3000/api/appointments/createAppointments", apptData).then((res) => {navigation.navigate("bookConsult3", apptData)})
    }
    
    
    if (loaded) {return(
        <KeyboardAwareScrollView 
            backgroundColor='white' 
            style = {{flexGrow:1}}
            showsVerticalScrollIndicator={false}>
            <View style = {styles.container}> 
                <View style = {styles.header}>
                    <Text style = {styles.headerText}>
                        Book a Consultation
                    </Text>
                </View>
                <View style = {styles.datePicker}> 
                    <Text style = {styles.subHeaderText}>
                        Select a Date
                    </Text>
                    <DatePicker 
                        mode = "calendar"
                        minimumDate = {currDate}
                        onDateChange = {(newDate) => {changeDate(newDate)}}
                    />
                </View>
                {dateSelected &&
                <View style = {{flex: 0.4, marginLeft:30, width:"80%"}}>
                    <Text style = {styles.subHeaderText}>Select a Time</Text>
                    <Picker 
                        mode = "dropdown"
                        selectedValue = {selectedTime}
                        onValueChange = {(selectedTime) => {setSelectedTime(selectedTime)}}
                        >
                        {timeSlotArr.map(item => (
                        <Picker.Item label = {item} value = {item} key = {item}/>  
                        ))}
                        </Picker>
                    <Text style = {{fontSize:16}}>Give a brief description of your illness:</Text>
                    <TextInput 
                        multiline
                        marginTop = {10}
                        height = {100}
                        width = '100%'
                        backgroundColor = '#eeee'
                        borderRadius = {15}
                        paddingLeft = {15}
                        value = {description} 
                        onChangeText = {(text) => 
                        setDescription(text)}/>
                </View>}
                {dateSelected && <View style = {{flex:0.1, alignItems:'center', justifyContent:'center', marginTop:30}}>
                    <Button text = "Next" onPress = {() => completeBooking()}/>
                </View>}
            </View>
        </KeyboardAwareScrollView>
    );} else {
            return <AppLoading 
            onFinish={() => setLoaded(true)}
            onError={console.warn}/> 
    }
    
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Dimensions.get('screen').height * 0.1,
        flex: 1,
        backgroundColor:'white',
    },
    header : {
        flex:0.20,
        marginLeft: 30
    },
    datePicker : {
        flex: 0.45,
        marginTop: 30,
        marginLeft:30,
        width:"80%"
    },
    headerText : {
        fontSize: 32,
        fontFamily: 'roboto-bold'
    },
    subHeaderText: {
        fontSize:20,
        fontFamily: 'roboto-bold',
        marginBottom: 10
    }
});

export default bookConsult2;