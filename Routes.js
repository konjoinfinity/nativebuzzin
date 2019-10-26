import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createMaterialTopTabNavigator } from "react-navigation";
import ProfileScreen from "./Profile"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { View, Dimensions, PixelRatio, TouchableOpacity, Image } from "react-native"
import DemoScreen from './Demo';
import styles from "./Styles"
import InfoScreen from './Info';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MatCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LogScreen from "./Log"

const AppStack = createStackNavigator({
    MyTab: {
        screen: createMaterialTopTabNavigator(
            {
                Home: {
                    screen: HomeScreen,
                    navigationOptions: {
                        tabBarLabel: "Home",
                        tabBarIcon: ({ tintColor }) => (<Icon name="home" color="#4db6ac" size={25} />)
                    },
                },
                Buzz: {
                    screen: BuzzScreen,
                    navigationOptions: {
                        tabBarLabel: "Buzz",
                        tabBarIcon: ({ tintColor }) => (<Icon name="beer" color="#4db6ac" size={25} />)
                    },
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ tintColor }) => (<Icon name="user-cog" color="#4db6ac" size={25} />)
                    },
                },
                Demo: {
                    screen: DemoScreen,
                    navigationOptions: {
                        tabBarLabel: "Demo",
                        tabBarIcon: ({ tintColor }) => (<Icon name="clipboard" color="#4db6ac" size={25} />)
                    },
                },
            },
            {
                tabBarOptions: {
                    style: { backgroundColor: '#ffffff', borderTopWidth: 0.5, borderTopColor: "#e0e0e0" },
                    indicatorStyle: { backgroundColor: "#4db6ac" },
                    labelStyle: { margin: 0, padding: 0 },
                    activeTintColor: "gray", inactiveTintColor: '#ffffff', showIcon: true, upperCaseLabel: false, showLabel: true,
                },
                tabBarPosition: 'bottom'
            }
        ),
        navigationOptions: ({ navigation }) => ({
            title: `buzzin`,
            headerStyle: { backgroundColor: '#80cbc4' },
            headerTitleStyle: {
                color: "#ffffff", fontSize: 25, fontWeight: '400',
                paddingTop: Dimensions.get('window').width * PixelRatio.get() === 1440 && Dimensions.get('window').height * PixelRatio.get() === 2792 ? 25 : 0
            },
            headerLeft: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.infoButton} onPress={() => navigation.push("Info")}>
                    <View><Image style={{ width: 25, height: 25 }} source={require('./info.png')}></Image></View></TouchableOpacity></View>),
            headerRight: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.logButton} onPress={() => navigation.push("Log")}>
                    <View><MatCommIcon name="file-document-edit-outline" color="#ffffff" size={18} /></View></TouchableOpacity></View>)
        })
    },
    Info: InfoScreen,
    Log: LogScreen
}, { headerLayoutPreset: 'center' })

const AuthStack = createStackNavigator({ Login: LoginScreen },
    {
        initialRouteName: 'Login',
        headerLayoutPreset: 'center',
        defaultNavigationOptions: ({
            title: `buzzin`, headerStyle: { backgroundColor: '#80cbc4' },
            headerTitleStyle: { color: "#ffffff", fontSize: 25, textAlign: "center", fontWeight: '400' }
        })
    })

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoad: AuthLoadScreen,
        App: AppStack,
        Auth: AuthStack
    },
    { initialRouteName: 'AuthLoad' }
));