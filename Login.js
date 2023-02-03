import React from "react";
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, Keyboard, Modal, ScrollView, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./Styles"
import * as Haptics from 'expo-haptics';;
import Ficon from 'react-native-vector-icons/Fontisto'
import {
    namekey, genderkey, autobreakkey, happyhourkey, autobreakminkey, autobreakthresholdkey, limitkey,
    drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey, loginText, hhhourkey, loginButtonText, numberInputSize,
    loginTitle, indefbreakkey, limithourkey, limitdatekey, pacerkey, pacertimekey, lastcallkey, amount, maxreckey, warningkey, addButtonSize
} from "./Variables";

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "", modal: false
        };
    }

    componentDidMount() {
        try {
            Haptics.selectionAsync();
            this.nameinput.focus();
        } catch (error) {
            console.log(error)
        }
    }

    handleModal(agree) {
        try {
            agree === "yes" ? Haptics.selectionAsync() : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            if (this.state.name !== "") {
                if (this.state.gender !== "") {
                    this.setState({ modal: !this.state.modal })
                } else {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    Alert.alert("Please select your gender", "", [{ text: "Ok", onPress: () => { Haptics.selectionAsync() } }], { cancelable: false })
                }
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                Alert.alert("Please enter your name", "", [{ text: "Ok", onPress: () => { Haptics.selectionAsync(); this.nameinput.focus() } }], { cancelable: false })
            }
        } catch (error) {
            console.log(error)
        }
    }

    switchGender(gender) {
        try {
            if (this.state.gender !== gender) {
                Haptics.selectionAsync();
                gender === "Male" ? this.setState({ gender: "Male" }) : this.setState({ gender: "Female" })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async handleLogin() {
        try {
            await AsyncStorage.multiSet([[namekey, JSON.stringify(this.state.name)], [genderkey, JSON.stringify(this.state.gender)],
            [autobreakkey, JSON.stringify(false)], [happyhourkey, JSON.stringify(false)],
            [autobreakminkey, JSON.stringify(false)], [limitkey, JSON.stringify(false)], [limitbackey, JSON.stringify(0.06)],
            [autobreakthresholdkey, JSON.stringify(0.06)], [drinkskey, JSON.stringify(3)], [cancelbreakskey, JSON.stringify(0)],
            [showlimitkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)], [hhhourkey, JSON.stringify(17)],
            [indefbreakkey, JSON.stringify(false)], [limithourkey, JSON.stringify(23)], [pacerkey, JSON.stringify(false)],
            [limitdatekey, JSON.stringify(new Date().setHours(23, 0, 0, 0))], [pacertimekey, JSON.stringify(1800)],
            [lastcallkey, JSON.stringify(false)], [maxreckey, JSON.stringify(false)], [warningkey, JSON.stringify(false)]])
            this.handleModal("yes");
            this.props.navigation.navigate("Home", { login: true });
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.logincontainer} behavior={(Platform.OS === 'ios') ? "padding" : null}>
                <ScrollView>
                    <View onStartShouldSetResponder={() => this.nameinput.blur()} style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Modal animationType="slide" transparent={false} visible={this.state.modal}>
                            <ScrollView>
                                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginTop: 35, marginLeft: 10, marginRight: 10, padding: 10, marginBottom: 10 }}>
                                    {loginText}
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <TouchableOpacity style={[styles.dropShadow, styles.logindisagreeButton]} onPress={() => { this.handleModal("no") }}>
                                            <Text accessibilityLabel="donottouch" style={[styles.loginbuttonText, { fontSize: loginButtonText }]}>Disagree</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.dropShadow, styles.loginbutton]} onPress={() => { this.handleLogin() }}>
                                            <Text accessibilityLabel="agreetouch" style={[styles.loginbuttonText, { fontSize: loginButtonText }]}>Agree</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                        <Text style={[styles.loginheader, { color: "#000000", fontSize: loginTitle - 2 }]}>What is your name?</Text>
                        <View style={styles.logininputContainer}>
                            <TextInput style={[addButtonSize === "tablet" ? styles.largelogintextInput : styles.logintextInput, { fontSize: addButtonSize === "tablet" ? 50 : loginButtonText }]} placeholder="Name" placeholderTextColor="#777777"
                                name="name" id="name" blurOnSubmit={true} value={this.state.name} ref={(input) => { this.nameinput = input }} onFocus={() => this.nameinput.focus()}
                                onChangeText={(name) => this.setState({ name })} onSubmitEditing={() => Keyboard.dismiss()} returnKeyType={'done'} onBlur={() => { Keyboard.dismiss() }} />
                        </View>
                        <Text style={{ fontSize: addButtonSize === "tablet" ? loginTitle - 30 : loginTitle - 14, paddingTop: 25, color: "#AE0000", textAlign: "center" }}>*All data entered is stored locally on your phone, Kontrol does not collect or store personal data.</Text>
                        <Text style={{ fontSize: loginTitle - 2, paddingTop: 15, color: "#000000", alignSelf: "center" }}>Select Gender</Text>
                        <View style={{ paddingTop: 25, flexDirection: "row", justifyContent: "space-evenly" }}>
                            <TouchableOpacity style={[styles.dropShadow2, { backgroundColor: this.state.gender === "Female" || this.state.gender === "" ? "#A8A8A8" : "#00897b", borderRadius: addButtonSize === "tablet" ? 100 : 70, height: addButtonSize === "tablet" ? 200 : 140, width: addButtonSize === "tablet" ? 200 : 140, margin: 5, alignItems: 'center', justifyContent: 'center', flexDirection: "column" }]} onPress={() => this.switchGender("Male")}><Ficon name="male" color="#ffffff" size={addButtonSize === "tablet" ? 80 : 60} /><Text style={{ color: "#ffffff", fontSize: addButtonSize === "tablet" ? 40 : 28 }}>Male</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.dropShadow2, { backgroundColor: this.state.gender === "Male" || this.state.gender === "" ? "#A8A8A8" : "#00897b", borderRadius: addButtonSize === "tablet" ? 100 : 70, height: addButtonSize === "tablet" ? 200 : 140, width: addButtonSize === "tablet" ? 200 : 140, margin: 5, alignItems: 'center', justifyContent: 'center', flexDirection: "column" }]} onPress={() => this.switchGender("Female")}><Ficon name="female" color="#ffffff" size={addButtonSize === "tablet" ? 80 : 60} /><Text style={{ color: "#ffffff", fontSize: addButtonSize === "tablet" ? 40 : 28 }}>Female</Text></TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 30 }}>
                            <TouchableOpacity accessibilityLabel="logintouch" style={[styles.dropShadow, styles.loginbutton, { shadowOpacity: 0.35, shadowOffset: { width: 4, height: 4 }, shadowColor: "#000000", shadowRadius: 3, elevation: amount }]} onPress={() => this.handleModal("yes")}>
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <Text style={[styles.loginbuttonText, { fontSize: loginButtonText + 3 }]}>Next</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
        );
    }
}
export default LoginScreen;