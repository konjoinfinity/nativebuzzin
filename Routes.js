import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator, NavigationActions, StackActions } from "react-navigation";
import ProfileScreen from "./Profile"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { Vibration, View, Text } from "react-native"
import TestScreen from './Test';

const AppStack = createStackNavigator({
    MyTab: {
        screen: createBottomTabNavigator({
            Home: {
                screen: HomeScreen,
                navigationOptions: {
                    tabBarLabel: 'Home',
                    tabBarIcon: <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25 }}>🏠</Text></View>,
                    tabBarOptions: {
                        activeTintColor: 'gray',
                        inactiveTintColor: 'gray',
                        activeBackgroundColor: "#e0f2f1"
                    }
                },
            },
            Buzz: {
                screen: BuzzScreen,
                navigationOptions: {
                    tabBarLabel: 'Buzz',
                    tabBarIcon: <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25 }}>🍺</Text></View>,
                    tabBarOptions: {
                        activeTintColor: 'gray',
                        inactiveTintColor: 'gray',
                        activeBackgroundColor: "#e0f2f1"
                    }
                },
            },
            Profile: {
                screen: ProfileScreen,
                navigationOptions: {
                    tabBarLabel: 'Profile',
                    tabBarIcon: <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25 }}>👤</Text></View>,
                    tabBarOptions: {
                        activeTintColor: 'gray',
                        inactiveTintColor: 'gray',
                        activeBackgroundColor: "#e0f2f1"
                    }
                },
            },
            Test: {
                screen: TestScreen,
                navigationOptions: {
                    tabBarLabel: 'Test',
                    tabBarIcon: <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25 }}>📋</Text></View>,
                    tabBarOptions: {
                        activeTintColor: 'gray',
                        inactiveTintColor: 'gray',
                        activeBackgroundColor: "#e0f2f1"
                    }
                },
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