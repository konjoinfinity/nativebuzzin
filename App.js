import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Vibration
} from 'react-native';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import OldBuzzScreen from "./OldBuzz"
import BuzzScreen from "./Buzz"

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "Wesley",
        gender: "Male",
        weight: 220
      },
      bac: 0.0,
      buzzes: [],
      oldbuzzes: []
    }
  };

  componentDidMount() {
    Vibration.vibrate();
  }

  getDayHourMin(date1, date2) {
    var dateDiff = date2 - date1;
    dateDiff = dateDiff / 1000;
    var seconds = Math.floor(dateDiff % 60);
    dateDiff = dateDiff / 60;
    var minutes = Math.floor(dateDiff % 60);
    dateDiff = dateDiff / 60;
    var hours = Math.floor(dateDiff % 24);
    var days = Math.floor(dateDiff / 24);
    return [days, hours, minutes, seconds];
  }

  singleDuration(initialbuzz) {
    var duration;
    var currentDate = new Date();
    var date2 = currentDate.getTime();
    var date1 = initialbuzz.getTime();
    var dayHourMin = getDayHourMin(date1, date2);
    var days = dayHourMin[0];
    var hours = dayHourMin[1];
    var minutes = dayHourMin[2];
    var seconds = dayHourMin[3];
    if (days >= 1) {
      hours = hours + days * 24;
    }
    if (hours == 0) {
      duration = minutes / 60 + seconds / 3600;
    } else {
      duration = hours + minutes / 60 + seconds / 3600;
    }
    return duration;
  }

  getBAC(weight, gender, drinks, drinkType, hours) {
    var distribution;
    if (gender == "Female") {
      distribution = 0.66;
    }
    if (gender == "Male") {
      distribution = 0.73;
    }
    var totalAlc;
    if (drinkType == "Beer") {
      totalAlc = 12 * drinks * 0.05;
    }
    if (drinkType == "Wine") {
      totalAlc = 5 * drinks * 0.12;
    }
    if (drinkType == "Liquor") {
      totalAlc = 1.5 * drinks * 0.4;
    }
    var bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
    return bac;
  }

  addDrink(drink) {
    Vibration.vibrate();
    var total = this.getBAC(this.state.user.weight, this.state.user.gender, 1, drink, 0)
    this.setState({ bac: total })
    var drinkDate = new Date();
    this.setState(prevState => ({ buzzes: [...prevState.buzzes, { drinkType: drink, dateCreated: drinkDate }] }))
  }

  render() {
    // Once users have signed up, we don't need to display their weight and gender.  
    // A name/email is sufficient for a greeting.
    return (
      <View>
        <ScrollView>
          <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Name/Email - 123@abc.com</Text>
            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Gender - Male/Female</Text>
            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Weight - xxx lbs.</Text>
            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current BAC</Text>
            <View borderRadius={15}><Text style={{ fontSize: 30, textAlign: "center" }}>0.0</Text></View>
            <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>Check BAC</Text></TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Add a Drink</Text>
            <TouchableOpacity style={styles.checkBacButton} onPress={() => this.addDrink("Beer")}><Text style={styles.checkBacButtonText}>+1 Beer 🍺</Text></TouchableOpacity>
            <TouchableOpacity style={styles.checkBacButton} onPress={() => this.addDrink("Wine")}><Text style={styles.checkBacButtonText}>+1 Wine 🍷</Text></TouchableOpacity>
            <TouchableOpacity style={styles.checkBacButton} onPress={() => this.addDrink("Liquor")}><Text style={styles.checkBacButtonText}>+1 Liquor 🥃</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkBacButton: {
    borderWidth: 1,
    borderColor: "#00897b",
    backgroundColor: "#00897b",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  checkBacButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center"
  }
})

const RootStack = createStackNavigator({
  MyTab: {
    screen: createBottomTabNavigator(
      {
        Home: HomeScreen,
        Buzz: BuzzScreen,
        OldBuzz: OldBuzzScreen

      },
      {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Home') {
              iconName = `🏠`;
            } else if (routeName === 'Buzz') {
              iconName = `🍺`
            } else if (routeName === 'OldBuzz') {
              iconName = `🐝`;
            }
            Vibration.vibrate();
            return <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25, color: tintColor }}>{iconName}</Text></View>;
          },
        }),
        tabBarOptions: {
          activeTintColor: '#00897b',
          inactiveTintColor: 'gray',
        }
      }
    ),
    navigationOptions: {
      title: `Buzzin'`, headerStyle: {
        backgroundColor: '#80cbc4'
      },
      headerTitleStyle: {
        color: "#ffffff",
        fontSize: 25
      }
    }
  }
})

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
