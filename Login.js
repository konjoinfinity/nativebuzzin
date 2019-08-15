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
    ScrollView,
    Platform
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input'

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "Male",
            weight: 195,
            modalVisible: false
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.switchGender = this.switchGender.bind(this);
    }

    componentDidMount() {
        Vibration.vibrate();
    }

    setModalVisible(visible) {
        Vibration.vibrate();
        if (this.state.name !== "") {
            this.setState({ modalVisible: visible });
        } else {
            Vibration.vibrate();
            Alert.alert("Please Enter Name")
        }
    }

    handleNameChange(name) {
        this.setState({ name });
    }

    switchGender() {
        Vibration.vibrate();
        if (this.state.gender === "Male") {
            this.setState({ gender: "Female", weight: 165 })
        }
        if (this.state.gender === "Female") {
            this.setState({ gender: "Male", weight: 195 })
        }
    }

    async handleLogin() {
        const namekey = "name"
        const genderkey = "gender"
        const weightkey = "weight"
        const autobreakkey = "autobreak"
        const happyhourkey = "happyhour"
        await AsyncStorage.setItem(namekey, JSON.stringify(this.state.name))
        await AsyncStorage.setItem(genderkey, JSON.stringify(this.state.gender))
        await AsyncStorage.setItem(weightkey, JSON.stringify(this.state.weight))
        await AsyncStorage.setItem(autobreakkey, JSON.stringify(false))
        await AsyncStorage.setItem(happyhourkey, JSON.stringify(false))
        await AsyncStorage.setItem(autobreakminkey, JSON.stringify(false))
        this.setModalVisible(!this.state.modalVisible);
        this.props.navigation.navigate("Home", { login: true });
    }

    handleCancel() {
        Vibration.vibrate();
        this.setModalVisible(!this.state.modalVisible);
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={(Platform.OS === 'ios') ? "padding" : null}>
                <ScrollView>
                    <View onStartShouldSetResponderCapture={(e) => { Keyboard.dismiss() }}
                        style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisible}>
                            <ScrollView>
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
                                            onPress={() => { this.handleCancel() }}>
                                            <Text style={styles.buttonText}>Disagree</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}
                                            onPress={() => { this.handleLogin() }}>
                                            <Text style={styles.buttonText}>Agree</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView></Modal>
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
                                value={this.state.name}
                                onSubmitEditing={() => Keyboard.dismiss()} />
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
                                initValue={this.state.weight}
                                value={this.state.weight}
                                onChange={(weight) => this.setState({ weight })}
                                totalWidth={290}
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
                                onPress={() => this.setModalVisible(true)}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
