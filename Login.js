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

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "",
            weight: ""
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        Vibration.vibrate();
    }

    handleNameChange(name) {
        this.setState({ name });
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
                    <Picker
                        selectedValue={this.state.gender}
                        style={{ height: 0, width: 350, margin: 10, padding: 10 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ gender: itemValue })
                        }>
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                    <View style={{ paddingTop: 100 }}>
                        <Picker
                            selectedValue={this.state.weight}
                            style={{ height: 0, width: 350, margin: 10, padding: 10 }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ weight: itemValue })
                            }>
                            <Picker.Item label="Select Weight" value="" />
                            <Picker.Item label="100 lbs." value={100} />
                            <Picker.Item label="105 lbs." value={105} />
                            <Picker.Item label="110 lbs." value={110} />
                            <Picker.Item label="115 lbs." value={115} />
                            <Picker.Item label="120 lbs." value={120} />
                            <Picker.Item label="125 lbs." value={125} />
                            <Picker.Item label="130 lbs." value={130} />
                            <Picker.Item label="135 lbs." value={135} />
                            <Picker.Item label="140 lbs." value={140} />
                            <Picker.Item label="145 lbs." value={145} />
                            <Picker.Item label="150 lbs." value={150} />
                            <Picker.Item label="155 lbs." value={155} />
                            <Picker.Item label="160 lbs." value={160} />
                            <Picker.Item label="165 lbs." value={165} />
                            <Picker.Item label="170 lbs." value={170} />
                            <Picker.Item label="175 lbs." value={175} />
                            <Picker.Item label="180 lbs." value={180} />
                            <Picker.Item label="185 lbs." value={185} />
                            <Picker.Item label="190 lbs." value={190} />
                            <Picker.Item label="195 lbs." value={195} />
                            <Picker.Item label="200 lbs." value={200} />
                            <Picker.Item label="205 lbs." value={205} />
                            <Picker.Item label="210 lbs." value={210} />
                            <Picker.Item label="215 lbs." value={215} />
                            <Picker.Item label="220 lbs." value={220} />
                            <Picker.Item label="225 lbs." value={225} />
                            <Picker.Item label="230 lbs." value={230} />
                            <Picker.Item label="235 lbs." value={235} />
                            <Picker.Item label="240 lbs." value={240} />
                            <Picker.Item label="245 lbs." value={245} />
                            <Picker.Item label="250 lbs." value={250} />
                        </Picker>
                    </View>
                    <View style={{ paddingTop: 250 }}>
                        <TouchableOpacity
                            style={styles.loginButton}
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
    }
});
