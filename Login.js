import React from "react";
import {
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
    Platform,
    Dimensions,
    PixelRatio
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input'
import {
    namekey, genderkey, weightkey, autobreakkey, happyhourkey, autobreakminkey, autobreakthresholdkey,
    cutoffkey, drinkskey, cutoffbackey, cancelbreakskey, showcutoffkey, custombreakkey, loginText, hhhourkey
} from "./Variables";
import styles from "./Styles"

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "Male",
            weight: 195,
            modal: false
        };
    }

    componentDidMount() {
        Vibration.vibrate();
    }

    handleModal() {
        Vibration.vibrate();
        if (this.state.name !== "") {
            this.setState({ modal: !this.state.modal });
        } else {
            Vibration.vibrate();
            Alert.alert("Please Enter Name")
        }
    }

    switchGender() {
        Vibration.vibrate();
        this.state.gender === "Male" ? this.setState({ gender: "Female", weight: 165 }) : this.setState({ gender: "Male", weight: 195 })
    }

    async handleLogin() {
        await AsyncStorage.multiSet([[namekey, JSON.stringify(this.state.name)], [genderkey, JSON.stringify(this.state.gender)],
        [weightkey, JSON.stringify(this.state.weight)], [autobreakkey, JSON.stringify(false)], [happyhourkey, JSON.stringify(false)],
        [autobreakminkey, JSON.stringify(false)], [cutoffkey, JSON.stringify(false)], [cutoffbackey, JSON.stringify(0.08)],
        [autobreakthresholdkey, JSON.stringify(0.08)], [drinkskey, JSON.stringify(8)], [cancelbreakskey, JSON.stringify(0)],
        [showcutoffkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)], [hhhourkey, JSON.stringify(17)]])
        this.handleModal();
        this.props.navigation.navigate("Home", { login: true });
    }

    render() {
        var numberInputSize;
        Dimensions.get('window').width * PixelRatio.get() < 750 ? numberInputSize = 125 : numberInputSize = 150
        return (
            <KeyboardAvoidingView style={styles.logincontainer} behavior={(Platform.OS === 'ios') ? "padding" : null}>
                <ScrollView>
                    <View onStartShouldSetResponderCapture={(e) => { Keyboard.dismiss() }}
                        style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modal}>
                            <ScrollView>
                                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginTop: 35, marginLeft: 10, marginRight: 10, padding: 10 }}>
                                    {loginText}
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <TouchableOpacity style={styles.logindisagreeButton}
                                            onPress={() => { this.handleModal() }}>
                                            <Text style={styles.loginbuttonText}>Disagree</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.loginbutton}
                                            onPress={() => { this.handleLogin() }}>
                                            <Text style={styles.loginbuttonText}>Agree</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView></Modal>
                        <Text style={styles.loginheader}>Login</Text>
                        <View style={styles.logininputContainer}>
                            <TextInput
                                style={styles.logintextInput}
                                placeholder="Name"
                                autoFocus={true}
                                name="name"
                                id="name"
                                returnKeyType={"default"}
                                blurOnSubmit={true}
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                                onSubmitEditing={() => Keyboard.dismiss()} />
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <TouchableOpacity style={styles.loginbutton} onPress={() => this.switchGender()}><Text style={styles.loginbuttonText}>Switch Gender ♂♀</Text></TouchableOpacity>
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
                                totalWidth={numberInputSize}
                                step={5}
                                rounded
                                textColor='#103900'
                                iconStyle={{ color: 'white' }}
                                rightButtonBackgroundColor='#00897b'
                                leftButtonBackgroundColor='#00897b' />
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <TouchableOpacity
                                style={styles.loginbutton}
                                onPress={() => this.handleModal()}>
                                <Text style={styles.loginbuttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
export default LoginScreen;