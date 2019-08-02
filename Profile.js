import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const oldkey = "oldbuzzes"
const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const breakkey = "break"

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "",
            weight: "",
            alctype: "",
            break: ""
        }
        this.LogOut = this.LogOut.bind(this);
        this.takeAbreak = this.takeAbreak.bind(this);
        this.stopBreak = this.stopBreak.bind(this);
    };

    async componentDidMount() {
        await AsyncStorage.getItem(namekey, (error, result) => {
            this.setState({ name: JSON.parse(result) })
        })
        await AsyncStorage.getItem(genderkey, (error, result) => {
            this.setState({ gender: JSON.parse(result) })
        })
        await AsyncStorage.getItem(weightkey, (error, result) => {
            this.setState({ weight: JSON.parse(result) })
        })
        await AsyncStorage.getItem(breakkey, (error, result) => {
            if (result !== null) {
                this.setState({ break: JSON.parse(result) })
            } else {
                this.setState({ break: false })
            }
        })
    }

    async takeAbreak() {
        Vibration.vibrate();
        this.setState({ break: true })
        await AsyncStorage.setItem(breakkey, JSON.stringify(true))
    }

    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false })
        await AsyncStorage.setItem(breakkey, JSON.stringify(false))
    }

    async LogOut() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(oldkey)
        await AsyncStorage.removeItem(namekey)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(genderkey)
        await AsyncStorage.removeItem(weightkey)
        await AsyncStorage.removeItem(breakkey)
        this.props.navigation.navigate("Login")
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}</Text>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{this.state.weight} lbs.</Text>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        {this.state.break === false &&
                            <TouchableOpacity style={styles.button} onPress={() => this.takeAbreak()}>
                                <Text style={styles.buttonText}>Take a Break</Text>
                            </TouchableOpacity>}
                        {this.state.break === true &&
                            <View>
                                <Text style={{ fontSize: 22, textAlign: "center" }}>Congrats, You are taking a break.  Keep up the good work!</Text>
                                <TouchableOpacity style={styles.button} onPress={() => this.stopBreak()}>
                                    <Text style={styles.buttonText}>Stop Break</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.LogOut()}>
                            <Text style={styles.buttonText}>Logout ➡️🚪</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default ProfileScreen;

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    }
})
