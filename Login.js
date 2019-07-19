import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Vibration,
    KeyboardAvoidingView,
    Picker
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
            gender: "",
            weight: 150
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleGender = this.handleGender.bind(this);
    }

    componentDidMount() {
        Vibration.vibrate();
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    handleNameChange(name) {
        this.setState({ name });
    }

    handleGender(index) {
        if (index !== 0) {
            this.setState({ gender: options[index].props.children })
        }
    }

    async handleLogin() {
        const namekey = "name"
        const genderkey = "gender"
        const weightkey = "weight"
        await AsyncStorage.setItem(namekey, JSON.stringify(this.state.name))
        await AsyncStorage.setItem(genderkey, JSON.stringify(this.state.gender))
        await AsyncStorage.setItem(weightkey, JSON.stringify(this.state.weight))
        this.props.navigation.navigate("Home");
        console.log(this.state)
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
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onChangeText={this.handleNameChange}
                            value={this.state.name} />
                    </View>
                    <View style={{ paddingTop: 30 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.showActionSheet()}><Text style={styles.buttonText}>Select Gender ♂♀</Text></TouchableOpacity>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={<Text style={{ color: '#000', fontSize: 25 }}>Gender</Text>}
                            options={options}
                            cancelButtonIndex={0}
                            onPress={this.handleGender}
                        />
                        {this.state.gender !== "" &&
                            <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                            </View>}
                    </View>
                    <View style={{ paddingTop: 30, alignItems: "center" }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 20 }}>Enter Weight</Text>
                        <NumericInput
                            minValue={80}
                            maxValue={300}
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
                    <View style={{ paddingTop: 30 }}>
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
        flex: 1,
        paddingTop: 10
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
