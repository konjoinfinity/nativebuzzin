// imports to be used within the LoginScreen
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
    Keyboard,
    Modal,
    ScrollView
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input'

// Main LoginScreen component
class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "Male",
            weight: 150,
            modalVisible: false
        };
        // Bind statements are used to ensure data is changed in state by a function/method defined below
        // Binding respective state changes above 
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.switchGender = this.switchGender.bind(this);
    }

    // Screen Vibrates on when render is complete
    componentDidMount() {
        Vibration.vibrate();
    }

    // Modal function to display/hide the Legal Disclaimer and Terms of Use
    setModalVisible(visible) {
        // Conditionals to ensure name is not blank
        if (this.state.name !== "") {
            this.setState({ modalVisible: visible });
        } else {
            // Popup is displayed if name field is blank and login button is pressed
            Vibration.vibrate();
            Alert.alert("Please Enter Name")
        }
    }

    // When this function is called it updates the state of name with the text the user types in
    handleNameChange(name) {
        this.setState({ name });
    }

    // This function switches the gender when the switch gender button it pressed, the opposite gender is written to state
    switchGender() {
        Vibration.vibrate();
        if (this.state.gender === "Male") {
            this.setState({ gender: "Female" })
        }
        if (this.state.gender === "Female") {
            this.setState({ gender: "Male" })
        }
    }

    // The handleLogin function is triggered when the user clicks the Agree button on the modal
    async handleLogin() {
        // Device storage keys are defined here, (name, gender, and weight)
        const namekey = "name"
        const genderkey = "gender"
        const weightkey = "weight"
        // Values from state (name, gender, and weight are written to device storage)
        await AsyncStorage.setItem(namekey, JSON.stringify(this.state.name))
        await AsyncStorage.setItem(genderkey, JSON.stringify(this.state.gender))
        await AsyncStorage.setItem(weightkey, JSON.stringify(this.state.weight))
        // Modal is closed
        this.setModalVisible(!this.state.modalVisible);
        // Naviagtes to the HomeScreen with the login parameter set to true (triggers the copilot intro walkthrough)
        this.props.navigation.navigate("Home", { login: true });
    }

    // When the user presses Disagree, the modal is hidden and the login screen is displayed again
    handleCancel() {
        Vibration.vibrate();
        this.setModalVisible(!this.state.modalVisible);
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                {/* When the user finishes typing in their name, the keyboad is then hidden by pressing anywhere on the screen */}
                <View onStartShouldSetResponderCapture={(e) => { Keyboard.dismiss() }}
                    style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                    {/* When the user clicks Login, the modal is shown */}
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}>
                        <ScrollView>
                            {/* Leagl Disclaimer and User Terms */}
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginTop: 35, marginLeft: 10, marginRight: 10, padding: 10 }}>
                                <Text style={{ fontSize: 25, textAlign: "center", padding: 10 }}>Welcome to Buzzin'!</Text>
                                <Text style={{ fontSize: 20, textAlign: "center", padding: 10 }}>Legal Disclaimer and User Agreement</Text>
                                <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Buzzin' will not be held liable for any decisions made based on the information provided.
                                The Blood Alcohol Content (BAC) calculations are not 100% accurate and are aimed to give our users a general ballpark estimate based on their approximate weight and gender.
                                Users are liable for all data they input, as it is stored on their personal local device.  No user data is stored externally, Buzzin' does not store inputted user data externally.
                                By pressing agree, the user forfeits their rights to hold Buzzin' or LifeSystems LLC liable for any incidents, accidents, decisions based on information provided, risky activities, personal bodily injury, or accidental death.
                                This application is designed to reduce and track personal alcoholic consumption habits.  Enjoy!</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <TouchableOpacity style={styles.disagreeButton}
                                        // This function closes the modal but stays on the LoginScreen
                                        onPress={() => { this.handleCancel() }}>
                                        <Text style={styles.buttonText}>Disagree</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}
                                        // This function closes the modal and navigates to the HomeScreen
                                        onPress={() => { this.handleLogin() }}>
                                        <Text style={styles.buttonText}>Agree</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView></Modal>
                    <Text style={styles.header}>Login</Text>
                    <View style={styles.inputContainer}>
                        {/* Input for user name, updates this.state.name for each charater entered, keyboard is automatically rendered
                        (autofocus) */}
                        <TextInput
                            style={styles.textInput}
                            placeholder="Name"
                            autoFocus={true}
                            name="name"
                            id="name"
                            returnKeyType={"default"}
                            blurOnSubmit={true}
                            onChangeText={this.handleNameChange}
                            value={this.state.name}
                            onSubmitEditing={() => Keyboard.dismiss()} />
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        {/* Switch gender button, switches to opposite gender when pressed.  Displays current gender below */}
                        <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch Gender ♂♀</Text></TouchableOpacity>
                        <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: 20, alignItems: "center" }}>
                        {/* Numeric weight input displayed in pounds, +/- increment of 5 pounds, updates state based when change is made */}
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
                        {/* Login button, triggers the modal when pressed */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.setModalVisible(true)}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
// Normal export for Login Screen to be used elsewhere in the App
export default LoginScreen;

// Styles are defined
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
    disagreeButton: {
        borderWidth: 1,
        borderColor: "#AE0000",
        backgroundColor: "#AE0000",
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
