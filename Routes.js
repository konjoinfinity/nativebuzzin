// imports for usage within Routes, for Routes we import all other screens in the app to define navigation, styles, etc.
import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import ProfileScreen from "./Profile"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { Vibration, View, Text, Dimensions, PixelRatio } from "react-native"
import DemoScreen from './Demo';

// We define the AppStack, screens accessible after login here
const AppStack = createStackNavigator({
    MyTab: {
        // Places all screens defined in a TabNavigator bar at the bottom of the app screen
        screen: createBottomTabNavigator(
            {
                Home: HomeScreen,
                Buzz: BuzzScreen,
                Profile: ProfileScreen,
                Demo: DemoScreen
            },
            {
                // We define all navigation options for the tabs, icons, styles, selection styling, vibration, etc.
                defaultNavigationOptions: ({ navigation }) => ({
                    tabBarIcon: ({ horizontal, tintColor }) => {
                        const { routeName } = navigation.state;
                        let iconName;
                        routeName === 'Home' ? iconName = `🏠` : routeName === 'Buzz' ? iconName = `🍺` : routeName === 'Profile' ? iconName = `👤` : iconName = `📋`
                        Vibration.vibrate();
                        return <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25, color: tintColor }}>{iconName}</Text></View>;
                    }
                }),
                tabBarOptions: { activeTintColor: 'gray', inactiveTintColor: 'gray', activeBackgroundColor: "#e0f2f1" }
            }
        ),
        // We define the static header bar with App title and style
        navigationOptions: {
            title: `buzzin`,
            headerStyle: { backgroundColor: '#80cbc4' },
            headerTitleStyle: {
                color: "#ffffff", fontSize: 25,
                paddingTop: Dimensions.get('window').width * PixelRatio.get() === 1440 && Dimensions.get('window').height * PixelRatio.get() === 2792 ? 25 : 0
            }
        }
    }
}, { headerLayoutPreset: 'center' })

<<<<<<< HEAD
// The Auth Stack is defined here, only one route - Login we use the same static header
const AuthStack = createStackNavigator({
    Login: LoginScreen,
},
=======
const AuthStack = createStackNavigator({ Login: LoginScreen },
>>>>>>> master
    {
        initialRouteName: 'Login',
        headerLayoutPreset: 'center',
        defaultNavigationOptions: {
            title: `buzzin`, headerStyle: { backgroundColor: '#80cbc4' },
            headerTitleStyle: { color: "#ffffff", fontSize: 25, textAlign: "center" }
        }
    });

// We export the AppContainer wrapped around a switch navigator, this loads the AuthLoad screen first (to determine if a user is 
// logged in or not which returns either "App" or "Auth".  Base on the return, the app navigated to either the AppStack or AuthStack)    
export default createAppContainer(createSwitchNavigator(
    { 
        AuthLoad: AuthLoadScreen, 
        App: AppStack, 
        Auth: AuthStack 
    },
    { initialRouteName: 'AuthLoad' }
));