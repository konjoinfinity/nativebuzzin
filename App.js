import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Vibration,
  Button
} from 'react-native';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import OldBuzzScreen from "./OldBuzz"
import BuzzScreen from "./Buzz"

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ""
    };
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
            <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>+1 Beer 🍺</Text></TouchableOpacity>
            <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>+1 Wine 🍷</Text></TouchableOpacity>
            <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>+1 Liquor 🥃</Text></TouchableOpacity>
          </View>
          <View paddingBottom={100}></View>
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
            return <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25, color: tintColor }}>{iconName}</Text></View>;
          },
        }),
        tabBarOptions: {
          activeTintColor: '#00897b',
          inactiveTintColor: 'gray',
        },
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
