import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import OldBuzzScreen from "./OldBuzz"
import BuzzScreen from "./Buzz"
import LoginScreen from './Login';
import AuthLoadScreen from "./AuthLoad"
import HomeScreen from "./Home"

const AppStack = createStackNavigator({
    Home: HomeScreen,
    Buzz: BuzzScreen,
    OldBuzz: OldBuzzScreen
},
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            title: `Buzzin'`, headerStyle: {
                backgroundColor: '#80cbc4'
            },
            headerTitleStyle: {
                color: "#ffffff",
                fontSize: 25
            }
        }
    }
)

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
