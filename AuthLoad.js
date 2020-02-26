import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    async bootstrapAsync() {
        try {
            const namekey = "name"
            const user = await AsyncStorage.getItem(namekey)
            this.props.navigation.navigate(user ? 'App' : 'Auth');
        } catch (error) {
            console.log(error)
        }
    };

    render() {
        return (
            <View>
            </View>
        );
    }
}

export default AuthLoadScreen;