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
            { Home: HomeScreen, Buzz: BuzzScreen, Profile: ProfileScreen, Demo: DemoScreen },
            {
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

const AuthStack = createStackNavigator({ Login: LoginScreen },
    {
        initialRouteName: 'Login',
        headerLayoutPreset: 'center',
        defaultNavigationOptions: {
            title: `buzzin`, headerStyle: { backgroundColor: '#80cbc4' },
            headerTitleStyle: { color: "#ffffff", fontSize: 25, textAlign: "center" }
        }
    });

export default createAppContainer(createSwitchNavigator(
    { AuthLoad: AuthLoadScreen, App: AppStack, Auth: AuthStack },
    { initialRouteName: 'AuthLoad' }
));