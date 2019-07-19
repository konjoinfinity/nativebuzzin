import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import OldBuzzScreen from "./OldBuzz"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { Vibration, View, Text, TouchableOpacity, StyleSheet } from "react-native"

const AppStack = createStackNavigator({
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
            title: `Buzzin'`,
            headerStyle: {
                backgroundColor: '#80cbc4'
            },
            headerTitleStyle: {
                color: "#ffffff",
                fontSize: 25
            }
        }
    }
})

const AuthStack = createStackNavigator({
    Login: LoginScreen,
},
    {
        initialRouteName: 'Login',
        defaultNavigationOptions: {
            title: `Buzzin'`, headerStyle: {
                backgroundColor: '#80cbc4'
            },
            headerTitleStyle: {
                color: "#ffffff",
                fontSize: 25
            }
        }
    });

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoad: AuthLoadScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoad',
    }
));

const styles = StyleSheet.create({
    headerButton: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    }
})