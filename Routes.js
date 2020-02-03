import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createMaterialTopTabNavigator } from "react-navigation";
import ProfileScreen from "./Profile"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { View, TouchableOpacity, Dimensions, Text } from "react-native"
import styles from "./Styles"
import InfoScreen from './Info';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ficon from 'react-native-vector-icons/Feather'
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Sicon from 'react-native-vector-icons/SimpleLineIcons';
import LogScreen from "./Log"
import { screenHeight, screenWidth, addButtonSize } from "./Variables"

var bottomPad = false;
if (screenWidth === 1125) { bottomPad = true }
if (screenWidth === 828 && screenHeight === 1792) { bottomPad = true }
if (screenWidth === 1242 && screenHeight === 2688) { bottomPad = true }
if (screenWidth === 1668 && screenHeight === 2388) { bottomPad = true }
if (screenWidth === 2048 && screenHeight === 2732) { bottomPad = true }

const AppStack = createStackNavigator({
    MyTab: {
        screen: createMaterialTopTabNavigator(
            {
                Home: {
                    screen: BuzzScreen,
                    navigationOptions: {
                        tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Icon name="home" color="#4db6ac" size={addButtonSize === "tablet" ? 42 : 25} /><Text style={{ fontSize: addButtonSize === "tablet" ? 18 : 10, color: tintColor }}>Home</Text></View>)
                    },
                },
                Drinks: {
                    screen: HomeScreen,
                    navigationOptions: {
                        tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Icon name="beer" color="#4db6ac" size={addButtonSize === "tablet" ? 42 : 25} /><Text style={{ fontSize: addButtonSize === "tablet" ? 18 : 10, color: tintColor }}>Drinks</Text></View>)
                    },
                },
                Log: {
                    screen: LogScreen,
                    navigationOptions: {
                        tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><MIcon name="note-add" color="#4db6ac" size={addButtonSize === "tablet" ? 45 : 28} /><Text style={{ fontSize: addButtonSize === "tablet" ? 18 : 10, color: tintColor }}>Log</Text></View>)
                    },
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarLabel: ({ tintColor }) => (<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 2 }}><Icon name="user-cog" color="#4db6ac" size={addButtonSize === "tablet" ? 42 : 25} /><Text style={{ fontSize: addButtonSize === "tablet" ? 18 : 10, color: tintColor }}>Profile</Text></View>)

                    },
                },

            },
            {
                tabBarOptions: {
                    style: { backgroundColor: '#ffffff', borderTopWidth: 0.5, borderTopColor: "#e0e0e0" },
                    indicatorStyle: { backgroundColor: "#4db6ac" },
                    labelStyle: { margin: 0, padding: 0, paddingBottom: bottomPad === true ? 7 : 0 },
                    activeTintColor: "gray", inactiveTintColor: '#ffffff', upperCaseLabel: false, showLabel: true, showIcon: false,
                    tabStyle: { height: Dimensions.get('window').height * 0.088, width: Dimensions.get('window').width * 0.25 }
                },
                tabBarPosition: 'bottom'
            }
        ),
        navigationOptions: ({ navigation }) => ({
            title: `buzzin`,
            headerStyle: { backgroundColor: '#80cbc4', height: Dimensions.get('window').height * 0.066 },
            headerTitleStyle: {
                color: "#ffffff", fontSize: addButtonSize === "tablet" ? 40 : 25, fontWeight: '400',
                paddingTop: screenWidth === 1440 && screenHeight === 2792 ? 25 : 0
            },
            headerRight: (<View style={{ flexDirection: "row", paddingRight: 10 }}>
                <TouchableOpacity accessibilityLabel="infobutton" style={[addButtonSize === "tablet" ? styles.largeinfoButton : styles.infoButton, styles.dropShadow, { backgroundColor: "#009688" }]} onPress={() => navigation.push("Info")}>
                    <Ficon name="info" color="#ffffff" size={addButtonSize === "tablet" ? 40 : 25} style={{ height: addButtonSize === "tablet" ? 40 : 25, width: addButtonSize === "tablet" ? 40 : 25, textAlign: 'center' }} /></TouchableOpacity></View>)
        })
    },
    Info: InfoScreen,
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