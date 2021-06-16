import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, Button, Dimensions} from 'react-native';
import {Agenda} from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import Axios from 'axios';


export default class AgendaScreen extends Component {


  
  constructor(props) {
    super(props);

    Axios.get("http://192.168.50.189:3000/api/appointments/getPatientAppointments/60c77acbb9dcba875c0d5ca5").then(
      (response) => {
        for (var i = 0; i < response.data.length; i++) {
          const appointmentDetails = response.data[i]
          Axios.get("http://192.168.50.189:3000/api/authClinic/oneClinic/" + response.data[i].clinicId).then(
            (clinicDetails) => {
  
            this.state.items[appointmentDetails.date] = [[
              appointmentDetails.doctorsName,
              appointmentDetails.time, 
              clinicDetails.data.clinicName]] 
  
        }
          )
        }
      }
    )
    this.state = {
      items: {
      }
    };

  }
  render() {
    return ( 
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Calender</Text>
        <View flex={1} flexDirection='row' justifyContent='flex-end' paddingRight={40} paddingTop={10}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color='#4cd964' />
        </View>
      </View>
      
      <StatusBar style="auto" />
      <Agenda
            items={this.state.items}
            loadItemsForMonth={this.loadItems.bind(this)}
            selected={new Date()}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            rowHasChanged={this.rowHasChanged.bind(this)}
            theme={{agendaTodayColor: '#4cd964', agendaDayTextColor:'#4cd964', dotColor: 'salmon',selectedDayBackgroundColor:'#4cd964',todayTextColor:'#4cd964'}}
        />
    </View>
  
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems
      });
    }, 1000); 
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.item, {height: item.height}]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text>Doctor Name: {item[0]}</Text>
        <Text>Clinic Name: {item[2]}</Text>
        <Text>Start Time: {item[1]}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>There are no appointments for this day.</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 30
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  container: {
      paddingTop: Dimensions.get('screen').height * 0.05,
      flex: 1,
      backgroundColor: 'white'
  },
  text: {
    fontSize: 40,
    paddingLeft: 30,
    fontFamily: 'roboto-light'
  },
  header: {
    flexDirection: 'row',
    paddingTop: 20,
  },
});
