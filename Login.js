import React from "react";
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, Keyboard, Modal, ScrollView, Platform, Vibration } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input'
import styles from "./Styles"
import ReactNativeHaptic from 'react-native-haptic';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    namekey, genderkey, weightkey, autobreakkey, happyhourkey, autobreakminkey, autobreakthresholdkey, loginGenderText, limitkey,
    drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey, loginText, hhhourkey, loginButtonText, numberInputSize,
    loginTitle, indefbreakkey, limithourkey, limitdatekey, pacerkey, pacertimekey, lastcallkey, amount, maxreckey
} from "./Variables";

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "Male", weight: 195, modal: false
        };
    }

    componentDidMount() {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('impactLight') : Vibration.vibrate();
        this.nameinput.focus();
    }

    handleModal() {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate();
        if (this.state.name !== "") { this.setState({ modal: !this.state.modal }) }
        else {
            Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('notificationWarning') : Vibration.vibrate();
            Alert.alert("Please Enter Name")
        }
    }

    switchGender() {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate();
        this.state.gender === "Male" ? this.setState({ gender: "Female", weight: 165 }) : this.setState({ gender: "Male", weight: 195 })
    }

    async handleLogin() {
        await AsyncStorage.multiSet([[namekey, JSON.stringify(this.state.name)], [genderkey, JSON.stringify(this.state.gender)],
        [weightkey, JSON.stringify(this.state.weight)], [autobreakkey, JSON.stringify(false)], [happyhourkey, JSON.stringify(false)],
        [autobreakminkey, JSON.stringify(false)], [limitkey, JSON.stringify(false)], [limitbackey, JSON.stringify(0.06)],
        [autobreakthresholdkey, JSON.stringify(0.06)], [drinkskey, JSON.stringify(3)], [cancelbreakskey, JSON.stringify(0)],
        [showlimitkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)], [hhhourkey, JSON.stringify(17)],
        [indefbreakkey, JSON.stringify(false)], [limithourkey, JSON.stringify(23)], [pacerkey, JSON.stringify(false)],
        [limitdatekey, JSON.stringify(new Date().setHours(23, 0, 0, 0))], [pacertimekey, JSON.stringify(1800)],
        [lastcallkey, JSON.stringify(false)], [maxreckey, JSON.stringify(false)]])
        this.handleModal();
        this.props.navigation.navigate("Home", { login: true });
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.logincontainer} behavior={(Platform.OS === 'ios') ? "padding" : null}>
                <ScrollView>
                    <View onStartShouldSetResponder={() => this.nameinput.blur()} style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Modal animationType="slide" transparent={false} visible={this.state.modal}>
                            <ScrollView>
                                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginTop: 35, marginLeft: 10, marginRight: 10, padding: 10 }}>
                                    {loginText}
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <TouchableOpacity style={styles.logindisagreeButton} onPress={() => { this.handleModal() }}>
                                            <Text style={[styles.loginbuttonText, { fontSize: loginButtonText }]}>Disagree</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.loginbutton} onPress={() => { this.handleLogin() }}>
                                            <Text style={[styles.loginbuttonText, { fontSize: loginButtonText }]}>Agree</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView></Modal>
                        <Text style={[styles.loginheader, { fontSize: loginTitle }]}>Login</Text>
                        <View style={styles.logininputContainer}>
                            <TextInput style={[styles.logintextInput, { fontSize: loginButtonText }]} placeholder="Name"
                                name="name" id="name" blurOnSubmit={true} value={this.state.name} ref={(input) => { this.nameinput = input }} onFocus={() => this.nameinput.focus()}
                                onChangeText={(name) => this.setState({ name })} onSubmitEditing={() => Keyboard.dismiss()} returnKeyType={'done'} onBlur={() => { Keyboard.dismiss() }} />
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <TouchableOpacity style={[styles.loginbutton, { shadowOpacity: 0.35, shadowOffset: { width: 4, height: 4 }, shadowColor: "#000000", shadowRadius: 3, elevation: amount }]} onPress={() => this.switchGender()}><Text style={[styles.loginbuttonText, { fontSize: loginButtonText }]}>Choose Gender ♂♀</Text></TouchableOpacity>
                            <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Text style={{ fontSize: loginGenderText, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                            </View>
                        </View>
                        <View style={{ paddingTop: 20, alignItems: "center" }}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", paddingBottom: 20 }}>Enter Weight - lbs.</Text>
                            <NumericInput minValue={50} maxValue={500} initValue={this.state.weight} value={this.state.weight}
                                onChange={(weight) => this.setState({ weight }, () => { Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate(); })} step={5} totalWidth={numberInputSize}
                                rounded textColor='#103900' iconStyle={{ color: 'white' }} rightButtonBackgroundColor={this.state.weight === 500 ? "#AE0000" : "#00897b"}
                                leftButtonBackgroundColor={this.state.weight === 50 ? "#AE0000" : "#00897b"} />
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <TouchableOpacity style={[styles.loginbutton, { shadowOpacity: 0.35, shadowOffset: { width: 4, height: 4 }, shadowColor: "#000000", shadowRadius: 3, elevation: amount }]} onPress={() => this.handleModal()}>
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <Text style={[styles.loginbuttonText, { fontSize: loginButtonText }]}>Login   </Text><Icon name="login" color="#ffffff" size={loginButtonText} style={{ paddingTop: 2 }} />

                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
export default LoginScreen;