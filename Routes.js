import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import ProfileScreen from "./Profile"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { Vibration, View, Text, Dimensions, PixelRatio } from "react-native"
import DemoScreen from './Demo';

const AppStack = createStackNavigator({
    MyTab: {
        screen: createBottomTabNavigator(
            {
                Home: HomeScreen,
                Buzz: BuzzScreen,
                Profile: ProfileScreen,
                Demo: DemoScreen
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
                        } else if (routeName === 'Profile') {
                            iconName = `👤`;
                        } else if (routeName === 'Demo') {
                            iconName = `📋`;
                        }
                        Vibration.vibrate();
                        return <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25, color: tintColor }}>{iconName}</Text></View>;
                    }
                }),
                tabBarOptions: {
                    activeTintColor: 'gray',
                    inactiveTintColor: 'gray',
                    activeBackgroundColor: "#e0f2f1"
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
                fontSize: 25,
                paddingTop: Dimensions.get('window').width * PixelRatio.get() === 1440 && Dimensions.get('window').height * PixelRatio.get() === 2792 ? 25 : 0
            }
        }
    }
}, { headerLayoutPreset: 'center' })

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