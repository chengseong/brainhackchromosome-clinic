import React, {useState, useContext} from 'react';

import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, ActivityIndicator} from 'react-native';
import { EvilIcons, Ionicons, } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Card from '../shared/card';
import { Feather } from '@expo/vector-icons';
import Button from '../shared/button';
import { userIDContext } from '../shared/userContext';
import axios from 'axios';
import AppLoading from 'expo-app-loading';
import { CommonActions } from '@react-navigation/native';


registerForPushNotificationsAsync = async (userID) => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {  
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      axios.post("http://192.168.1.10:3000/api/auth/pushToken", {
            pushToken: token,
            userId: userID   
      })
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    };

export default function Home({navigation}) {
    const [appointmentsVisible, setAppointmentsVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const userID = useContext(userIDContext);

    const [toShow, setToShow] = useState({});
    const [userToShow, setUserToShow] = useState({});
    const showItem = (item) => setToShow(item);

    const [appointments, setAppointments] = useState({});
    const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [userClinic, setUserClinic] = useState({})

    React.useEffect(() => {
        const appointments = axios.get(`http://192.168.1.10:3000/api/appointments/getClinicAppointments/${userID}`)
        const users = axios.get(`http://192.168.1.10:3000/api/auth/getAllUsers`)
        const userclinic = axios.get(`http://192.168.1.10:3000/api/authClinic/oneClinic/${userID}`)
        axios.all([appointments, users, userclinic])
            .then(
                axios.spread((...responses) => {
                    const appointmentsRes = responses[0].data;
                    const usersRes = responses[1].data;
                    const userclinicRes = responses[2].data;
                    
                    setAppointments(appointmentsRes);
                    setUsers(usersRes);
                    console.log(users);
                    setUserClinic(userclinicRes);
                })
            ).then(() => {setAppointmentsLoaded(true), registerForPushNotificationsAsync(userID)})
      }, []);

    function cancelAppointment(appointmentId) {
        console.log(appointmentId)
        const deleteJSON = {
            appointmentId: appointmentId
        };
        axios.delete('http://192.168.1.10:3000/api/appointments/deleteClinicAppointments', {data: deleteJSON}).then((res) => {
            (navigation.dispatch(CommonActions.reset({index:1, routes:[{name: 'Home'}]})))
        })
    }

    function findUser(userId) {
        let user;
        for (u in users){
            if (users[u]._id == userId) {
                user = users[u];
                break;
            }
        } 
        return user;
    }

    if(appointmentsLoaded) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style = {styles.container} > 
                    <View style = {styles.header}>
                        <View flex={2}>
                            <Text style = {styles.name}>{userClinic.clinicName}</Text>
                        </View>
                        <View flex={1} flexDirection='row' justifyContent='flex-end' paddingRight={40}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color='#4cd964'
                                onPress={() => setNotificationsVisible(true)} />
                        </View>
                    </View>

                    {/*Notification Modal Start*/}
                    <Modal
                        animationType='fade'
                        visible={notificationsVisible}
                        transparent={true}>
                        <TouchableWithoutFeedback onPress={() => setNotificationsVisible(false)}>
                            <View style={styles.modalContainer}>
                                <TouchableWithoutFeedback onPress={() => setNotificationsVisible(true)}>
                                    <View style={{...styles.modalView, ...styles.notificationsModal}}>
                                    <FlatList
                                        paddingTop={10}
                                        data={appointments}
                                        renderItem={({item}) => (

                                            <View style={styles.notificationStyle}> 
                                                <View justifyContent='center'>
                                                    <Feather
                                                        name="alert-circle"
                                                        size={12}
                                                        color='#0009FF' />
                                                </View>
                                                <View 
                                                    paddingTop={15}
                                                    paddingLeft={20}
                                                    paddingRight={20}
                                                    alignItems='center'>
                                                    <Text>The following appointment has been confirmed</Text>
                                                    <Text></Text>
                                                </View>
                                            </View>
                                    )}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                    {/*Notification Modal End*/}

                    {/* Subheader */}
                    <View style = {styles.subheader}>
                        <Text style = {styles.search}>Search</Text>
                        <Text style = {styles.recentAppointments}>Recent</Text>
                        <Text style = {styles.recentAppointments}>Appointments</Text>
                        <View style = {styles.searchBar}>
                            <EvilIcons
                            name = 'search'
                            size = {24}
                            color = '#4cd964'/>
                            <TextInput 
                                style = {styles.input}
                                onChangeText = {(val) => setSearchText(val)}
                            />
                        </View>
                    </View>

                    {/* Upcoming Appointments Start */}
                    <View style = {styles.body}>
                        <Text style = {styles.bodyText}>Upcoming Appointments</Text>
                        <FlatList
                            marginTop={10}
                            data={appointments}
                            numColumns={2}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => {
                                    showItem(item);
                                    setUserToShow(findUser(item.patientId));
                                    setAppointmentsVisible(true);}}>
                                    <Card>
                                        <Text style={styles.clinicName}>{findUser(item.patientId).username}</Text>
                                        <Text style={styles.cardText}>{item.doctorsName}</Text>
                                        <Text style={styles.cardText}>{item.consultType}</Text>
                                        <Text style={styles.cardText}>{item.date}</Text>
                                        <Text style={styles.timeText}>{item.time}</Text>
                                    </Card>
                                </TouchableOpacity>
                            )}/>
                    </View>

                    {/* Upcoming Appointments End */}

                    {/*Appointment Info Modal Start*/}
                    <Modal
                        animationType='fade'
                        visible={appointmentsVisible}
                        transparent={true}>
                        <TouchableWithoutFeedback onPress={() => setAppointmentsVisible(false)}>
                            <View style={styles.modalContainer}>
                                <TouchableWithoutFeedback onPress={() => setAppointmentsVisible(true)}>
                                    <View style={{...styles.modalView, ...styles.appointmentsModal}}>
                                        <View paddingTop={20} paddingLeft={20}>
                                            <Text style={styles.modalTitle}>{userToShow.username}</Text>

                                            <Text style={styles.modalSubHeader}>Date</Text>
                                            <Text style={styles.modalDescription}>{toShow.date}</Text>
                                            <Text style={styles.modalSubHeader}>Time</Text>
                                            <Text style={styles.modalDescription}>{toShow.time}</Text>

                                            <Text style={styles.modalSubHeader}>Email</Text>
                                            <Text style={styles.modalDescription}>{userToShow.email}</Text>
                                            <Text style={styles.modalSubHeader}>Phone</Text>
                                            <Text style={styles.modalDescription}>{userToShow.phoneNumber}</Text>

                                        </View>
                                        <View 
                                            flexDirection='row'
                                            alignItems='center'
                                            justifyContent='center'>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    cancelAppointment(toShow._id);
                                                    setAppointmentsVisible(false);
                                                }}
                                                style={styles.button}>
                                                    <View>
                                                        <Text style={styles.cancelText}>Cancel Appointment</Text>
                                                    </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                    {/*Appointment Info Modal End */}

                </View>
            </TouchableWithoutFeedback>
        )
    } else {
        return (
            <AppLoading
        />
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop : Dimensions.get('screen').height * 0.1,
    },
    header: {
        flex: 0.5,
        flexDirection: 'row',
        paddingLeft: 30,
    },
    subheader: {
        flex: 2.5,
        marginTop: 20,
        paddingLeft: 30,
    },
    name: {
        fontFamily: 'roboto-light',
        color: '#4cd964',
        fontSize: 25,
    },
    search: {
        fontFamily: 'roboto-light',
        fontSize: 25
    },
    recentAppointments: {
        fontFamily: 'roboto-bold',
        fontSize: 25
    },
    searchBar:{
        paddingTop:20,
        flexDirection:'row'
    },
    input: {
        marginLeft: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal:10,
        paddingVertical: 2,
        width: Dimensions.get('screen').width * 0.6,
    },
    body: {
        flex: 6,
        paddingLeft: 30,
    },
    bodyText: {
        fontFamily: 'roboto-regular',
        color: '#7B7B7B',
        fontSize: 18
    },
    clinicName: {
        fontFamily: 'roboto-bold',
        color: 'white',
        fontSize: 18,
    },
    cardText: {
        fontFamily: 'roboto-regular',
        color: 'white',
        fontSize: 12,
        paddingTop: 4
    },
    timeText: {
        fontFamily: 'roboto-regular',
        color: 'white',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(222, 222, 222, 0.8)',
    },
    modalView: {
        backgroundColor: "white",
        paddingTop: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dddd',
    },
    appointmentsModal: {
        marginLeft: Dimensions.get('screen').width * 0.075,
        height: Dimensions.get('screen').height * 0.75,
        width: Dimensions.get('screen').width * 0.85,
    },
    modalTitle: {
        fontFamily:'roboto-bold',
        fontSize:30,
        paddingBottom: 10
    },
    modalSubHeader:{
        fontFamily:'roboto-light',
        fontSize:12,
        marginTop: 10,
        marginBottom: 2
    },
    modalDescription: {
        fontFamily:'roboto-regular',
        fontSize:16,
        color: '#444444'
    },
    mapView: {
        width:Dimensions.get('screen').width * 0.73,
        height:100,
        borderRadius:15,
        borderWidth:0.5,
        marginTop: 10,
        marginBottom: 30,
    },
    button: {
        width: 220,
        height: 36,
        alignItems: "center",
        backgroundColor: "#4cd964",
        marginTop: 20,
        borderRadius: 18
    },
    cancelText: {
        fontFamily: 'roboto-bold',
        fontSize: 16,
        color: 'white',
        paddingVertical: 10,     
    },
    notificationStyle :{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingLeft:20,
        paddingRight:20,
    },
    notificationsModal :{
        marginLeft: Dimensions.get('screen').width * 0.1,
        height: Dimensions.get('screen').height * 0.7,
        width: Dimensions.get('screen').width * 0.8,
    },
});