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
import { NavigationEvents } from "react-navigation";

const oldkey = "oldbuzzes"
const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const breakkey = "break"
const breakdatekey = "breakdate"

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "",
            weight: "",
            alctype: "",
            break: "",
            breakdate: "",
            breaktime: ""
        }
        this.LogOut = this.LogOut.bind(this);
        this.takeAbreak = this.takeAbreak.bind(this);
        this.stopBreak = this.stopBreak.bind(this);
    };

    getDayHourMin(date1, date2) {
        var dateDiff = date2 - date1;
        dateDiff = dateDiff / 1000;
        var seconds = Math.floor(dateDiff % 60);
        dateDiff = dateDiff / 60;
        var minutes = Math.floor(dateDiff % 60);
        dateDiff = dateDiff / 60;
        var hours = Math.floor(dateDiff % 24);
        var days = Math.floor(dateDiff / 24);
        return [days, hours, minutes, seconds];
    }

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
        await AsyncStorage.getItem(breakdatekey, (error, result) => {
            if (result !== null) {
                this.setState({ breakdate: JSON.parse(result) })
                setTimeout(() => {
                    var date1 = Date.parse(this.state.breakdate)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = this.getDayHourMin(date2, date1);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    this.setState({ breaktime: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.` })
                }, 100);
            }
        })

    }

    async takeAbreak(duration) {
        var breakDate = new Date();
        breakDate.setDate(breakDate.getDate() + duration);
        Vibration.vibrate();
        this.setState({ break: true, breakdate: breakDate })
        await AsyncStorage.setItem(breakkey, JSON.stringify(true))
        await AsyncStorage.setItem(breakdatekey, JSON.stringify(breakDate))
        this.componentDidMount();
    }

    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false })
        await AsyncStorage.setItem(breakkey, JSON.stringify(false))
        await AsyncStorage.removeItem(breakdatekey)
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
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}</Text>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{this.state.weight} lbs.</Text>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                        {this.state.break === false &&
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>Take a Break</Text>}
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <View style={{ flexDirection: "column" }}>
                                {this.state.break === false &&
                                    <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak(7)}>
                                        <Text style={styles.buttonText}>1 Week</Text>
                                    </TouchableOpacity>}
                                {this.state.break === false &&
                                    <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak(21)}>
                                        <Text style={styles.buttonText}>3 Weeks</Text>
                                    </TouchableOpacity>}
                            </View>
                            <View style={{ flexDirection: "column" }}>
                                {this.state.break === false &&
                                    <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak(14)}>
                                        <Text style={styles.buttonText}>2 Weeks</Text>
                                    </TouchableOpacity>}
                                {this.state.break === false &&
                                    <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak(30)}>
                                        <Text style={styles.buttonText}>1 Month</Text>
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        {this.state.break === true &&
                            <View>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You are taking a break until:</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10, fontWeight: "bold" }}>{this.state.breaktime}</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}> Keep up the good work!</Text>
                                <TouchableOpacity style={styles.button} onPress={() => this.stopBreak()}>
                                    <Text style={styles.buttonText}>Stop Break</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
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
    breakbutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        marginTop: 10,
        marginRight: 90,
        marginLeft: 90,
        marginBottom: 10,
        borderRadius: 15
    },
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        margin: 10,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    }
})
