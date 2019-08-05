import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from "react-navigation";
import NumericInput from 'react-native-numeric-input'

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
            breaktime: "",
            days: 0,
            weeks: 0,
            months: 0
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

    async takeAbreak() {
        var duration = this.state.days + (this.state.weeks * 7) + (this.state.months * 30)
        if (duration !== 0) {
            var breakDate = new Date();
            breakDate.setDate(breakDate.getDate() + duration);
            Vibration.vibrate();
            this.setState({ break: true, breakdate: breakDate })
            await AsyncStorage.setItem(breakkey, JSON.stringify(true))
            await AsyncStorage.setItem(breakdatekey, JSON.stringify(breakDate))
            this.componentDidMount();
            this.setState({ days: 0, weeks: 0, months: 0 })
        }
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

    cancelBreakAlert() {
        Vibration.vibrate();
        Alert.alert(
            'Are you sure?',
            'Click Yes to cancel break, No to continue break',
            [
                { text: 'Yes', onPress: () => this.stopBreak() },
                { text: 'No' },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}</Text>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>{this.state.weight} lbs.</Text>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                        {/* <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
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
                        </View> */}
                        {this.state.break === false &&
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <View>
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Days</Text>
                                    <NumericInput
                                        minValue={0}
                                        maxValue={31}
                                        value={this.state.days}
                                        onChange={(days) => this.setState({ days })}
                                        totalWidth={150}
                                        step={1}
                                        rounded
                                        textColor='#103900'
                                        iconStyle={{ color: 'white' }}
                                        rightButtonBackgroundColor='#00897b'
                                        leftButtonBackgroundColor='#00897b' />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Weeks</Text>
                                    <NumericInput
                                        minValue={0}
                                        maxValue={52}
                                        value={this.state.weeks}
                                        onChange={(weeks) => this.setState({ weeks })}
                                        totalWidth={150}
                                        step={1}
                                        rounded
                                        textColor='#103900'
                                        iconStyle={{ color: 'white' }}
                                        rightButtonBackgroundColor='#00897b'
                                        leftButtonBackgroundColor='#00897b' />
                                </View>
                            </View>}
                        {this.state.break === false &&
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Months</Text>
                                    <NumericInput
                                        minValue={0}
                                        maxValue={12}
                                        value={this.state.months}
                                        onChange={(months) => this.setState({ months })}
                                        totalWidth={150}
                                        step={1}
                                        rounded
                                        textColor='#103900'
                                        iconStyle={{ color: 'white' }}
                                        rightButtonBackgroundColor='#00897b'
                                        leftButtonBackgroundColor='#00897b' />
                                </View>
                            </View>}
                        {this.state.break === false &&
                            <TouchableOpacity style={styles.button} onPress={() => this.takeAbreak()}>
                                <Text style={styles.buttonText}>Take a Break</Text>
                            </TouchableOpacity>}
                        {this.state.break === true &&
                            <View>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You are taking a break for:</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10, fontWeight: "bold" }}>{this.state.breaktime}</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}> Keep up the good work!</Text>
                                <TouchableOpacity style={styles.button} onPress={() => this.cancelBreakAlert()}>
                                    <Text style={styles.buttonText}>Cancel Break</Text>
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
