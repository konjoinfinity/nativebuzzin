// imports for usage within AuthLoad
import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// Main AuthLoadScreen component
class AuthLoadScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }
    // Defining and binding the bootstrapAsync method to execute 
    async bootstrapAsync() {
        // Checks the name from device storage
        const namekey = "name"
        const user = await AsyncStorage.getItem(namekey)
        this.props.navigation.navigate(user ? 'App' : 'Auth');
    };

    // This render/return is not seen as this function is executed on startup
    render() {
        return (
            <View>
            </View>
        );
    }
}

// Normal export for usage throughout the app
export default AuthLoadScreen;