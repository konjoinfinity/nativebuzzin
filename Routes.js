import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import ProfileScreen from "./Profile"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"
import { View, Text, Dimensions, PixelRatio, TouchableOpacity, Image } from "react-native"
import DemoScreen from './Demo';
import styles from "./Styles"
import InfoScreen from './Info';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
                        routeName === 'Home' ? iconName = <Icon name="home" color="#4db6ac" size={25} /> : routeName === 'Buzz' ? iconName = <Icon name="beer" color="#4db6ac" size={25} /> : routeName === 'Profile' ? iconName = <Icon name="user-cog" color="#4db6ac" size={25} /> : iconName = <Icon name="clipboard" color="#4db6ac" size={25} />
                        return <View style={{ paddingTop: 5 }}><Text style={{ fontSize: 25, color: tintColor }}>{iconName}</Text></View>
                    }
                }),
                tabBarOptions: { activeTintColor: 'gray', inactiveTintColor: '#ffffff', activeBackgroundColor: "#e0f2f1" }
            }
        ),
        navigationOptions: ({ navigation }) => ({
            title: `buzzin`,
            headerStyle: { backgroundColor: '#80cbc4' },
            headerTitleStyle: {
                color: "#ffffff", fontSize: 25, fontWeight: '400',
                paddingTop: Dimensions.get('window').width * PixelRatio.get() === 1440 && Dimensions.get('window').height * PixelRatio.get() === 2792 ? 25 : 0
            },
            headerRight: (<View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.infoButton} onPress={() => navigation.push("Info")}>
                    <View><Image style={{ width: 25, height: 25 }} source={require('./info.png')}></Image></View></TouchableOpacity></View>)
        })
    }, Info: InfoScreen
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