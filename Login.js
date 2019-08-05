import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Vibration,
    KeyboardAvoidingView,
    Alert,
    Keyboard
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import NumericInput from 'react-native-numeric-input'

const options = [
    'Cancel',
    <Text style={{ color: '#94BFE2', fontSize: 25 }}>Male</Text>,
    <Text style={{ color: '#F398BE', fontSize: 25 }}>Female</Text>
]

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "Male",
            weight: 150
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.switchGender = this.switchGender.bind(this);
    }

    componentDidMount() {
        Vibration.vibrate();
    }

    handleNameChange(name) {
        this.setState({ name });
    }

    switchGender() {
        Vibration.vibrate();
        if (this.state.gender === "Male") {
            this.setState({ gender: "Female" })
        }
        if (this.state.gender === "Female") {
            this.setState({ gender: "Male" })
        }
    }

    async handleLogin() {
        const namekey = "name"
        const genderkey = "gender"
        const weightkey = "weight"
        if (this.state.name !== "") {
            if (this.state.gender !== "") {
                await AsyncStorage.setItem(namekey, JSON.stringify(this.state.name))
                await AsyncStorage.setItem(genderkey, JSON.stringify(this.state.gender))
                await AsyncStorage.setItem(weightkey, JSON.stringify(this.state.weight))
                this.props.navigation.navigate("Home", { login: true });
            } else {
                Vibration.vibrate();
                Alert.alert("Please Select Gender")
            }
        } else {
            Vibration.vibrate();
            Alert.alert("Please Enter Name")
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                    <Text style={styles.header}>Login</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Name"
                            autoFocus={true}
                            name="name"
                            id="name"
                            returnKeyType={"default"}
                            blurOnSubmit={true}
                            onChangeText={this.handleNameChange}
                            value={this.state.name} />
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch Gender ♂♀</Text></TouchableOpacity>
                        <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: 20, alignItems: "center" }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 20 }}>Enter Weight - lbs.</Text>
                        <NumericInput
                            minValue={50}
                            maxValue={500}
                            value={this.state.weight}
                            onChange={(weight) => this.setState({ weight })}
                            totalWidth={325}
                            step={5}
                            rounded
                            textColor='#103900'
                            iconStyle={{ color: 'white' }}
                            rightButtonBackgroundColor='#00897b'
                            leftButtonBackgroundColor='#00897b' />
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView >
        );
    }
}
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 30,
        textAlign: "center",
        margin: 10
    },
    inputContainer: {
        paddingTop: 15
    },
    textInput: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 15,
        textAlign: "center"
    },
    loginButton: {
        borderWidth: 1,
        borderColor: "#80cbc4",
        backgroundColor: "#80cbc4",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center"
    },
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        margin: 5,
        borderRadius: 15
    }
});
