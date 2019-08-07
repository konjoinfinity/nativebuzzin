// imports to be used within the ProfileScreen
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

// constant keys used for asyncstorage
const oldkey = "oldbuzzes"
const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const breakkey = "break"
const breakdatekey = "breakdate"

// Main ProfileScreen component
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
            hours: 0,
            days: 0,
            weeks: 0,
            months: 0,
        }
        // Bind statements are used to ensure data is changed in state by a function/method defined below
        // Binding respective state changes above 
        this.LogOut = this.LogOut.bind(this);
        this.takeAbreak = this.takeAbreak.bind(this);
        this.stopBreak = this.stopBreak.bind(this);
    };

    // The getDayHourMin passes in two timestamps (dates) and calculates the duration between the two
    // returns the values in and array of [days, hours, minutes, seconds] 
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

    // When the screen loads componentDidMount requests the data from device storage (name, gender, weight, break, breakdate).
    // All these values are written to this.state
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
                // Checking the current break time using the timestamp and setting the breaktime state
                setTimeout(() => {
                    var date1 = Date.parse(this.state.breakdate)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = this.getDayHourMin(date2, date1);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    if (days + hours + minutes + seconds < 0) {
                        this.stopBreak()
                    }
                    this.setState({ breaktime: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.` })
                }, 100);
            }
        })
    }

    // The takeAbreak function calculates the duration the user entered (hours, days, weeks, months) and assigns it to the 
    // duration and hours variables respectively
    async takeAbreak() {
        var duration = this.state.days + (this.state.weeks * 7) + (this.state.months * 30)
        var hours = this.state.hours * 60 * 60 * 1000
        var breakDate = new Date();
        if (duration !== 0) {
            // The future date stamp is set based on the duration
            breakDate.setDate(breakDate.getDate() + duration);
        }
        if (hours !== 0) {
            // The future timestamp is set based on the number of hours
            breakDate.setTime(breakDate.getTime() + hours);
        }
        Vibration.vibrate();
        // Once the breakDate has been set, break is set to true, and breakdate is written to state
        this.setState({ break: true, breakdate: breakDate })
        // The breakkey and breakdate are both saved to device storage
        await AsyncStorage.setItem(breakkey, JSON.stringify(true))
        await AsyncStorage.setItem(breakdatekey, JSON.stringify(breakDate))
        // componentDidMount is triggered to refresh the data
        this.componentDidMount();
        // Lastly state durations are zeroed out to ensure values are not represented in the Numeric inputs
        this.setState({ hours: 0, days: 0, weeks: 0, months: 0 })
    }

    // the stopBreak function cancels the break that the user is currently on, sets the state (break and breaktime) to their initial
    // values and also resets the device storage to their initial values as well.
    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false, breaktime: "" })
        await AsyncStorage.setItem(breakkey, JSON.stringify(false))
        await AsyncStorage.removeItem(breakdatekey)
    }

    // The LogOut function deletes all user values (buzzes, oldbuzzes, name, gender, weight, break, and breakdate) stored in device 
    // storage and navigates back to the login screen.
    async LogOut() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(oldkey)
        await AsyncStorage.removeItem(namekey)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(genderkey)
        await AsyncStorage.removeItem(weightkey)
        await AsyncStorage.removeItem(breakkey)
        await AsyncStorage.removeItem(breakdatekey)
        this.props.navigation.navigate("Login")
    }

    // When the cancel break button is pressed, an alert popup asks the user if they are sure they want to cancel the break
    // Yes cancels, No closes the alert popup without any action
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
                {/* When navigating to this screen after initial mount, componentDidMount is triggered to ensure a fresh copy of data */}
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        {/* Displays the user name, gender and weight */}
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}</Text>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>{this.state.weight} lbs.</Text>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                        {this.state.break === false &&
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <View>
                                    {/* Numeric input for hours, changes the state of hours each time the number changes */}
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5, fontWeight: "bold" }}>Hours</Text>
                                    <NumericInput
                                        minValue={0}
                                        maxValue={24}
                                        value={this.state.hours}
                                        onChange={(hours) => this.setState({ hours })}
                                        totalWidth={150}
                                        step={1}
                                        rounded
                                        textColor='#103900'
                                        iconStyle={{ color: 'white' }}
                                        rightButtonBackgroundColor='#00897b'
                                        leftButtonBackgroundColor='#00897b' />
                                </View>
                                <View>
                                    {/* Numeric input for days, changes the state of days each time the number changes */}
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5, fontWeight: "bold" }}>Days</Text>
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

                            </View>}
                        {this.state.break === false &&
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <View>
                                    {/* Numeric input for weeks, changes the state of weeks each time the number changes */}
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5, fontWeight: "bold" }}>Weeks</Text>
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
                                <View>
                                    {/* Numeric input for months, changes the state of months each time the number changes */}
                                    <Text style={{ fontSize: 15, textAlign: "center", padding: 5, fontWeight: "bold" }}>Months</Text>
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
                        {/* Take a break button triggers the takeAbreak function based on the inputted values, conditional for at least 
                            one value to be present to execute */}
                        {this.state.break === false &&
                            <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak()}>
                                <Text style={styles.buttonText}>Take a Break</Text>
                            </TouchableOpacity>}
                        {/* When the user is on a break (this.state.break is set to true), the break card view is rendered instead. */}
                        {this.state.break === true &&
                            <View>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You are taking a break for:</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10, fontWeight: "bold" }}>{this.state.breaktime}</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}> Keep up the good work!</Text>
                                {/* The Cancel Break button triggers cancelBreakAlert when pressed, which asks the user if they are sure they want 
                                to cancel the break from drinking*/}
                                <TouchableOpacity style={styles.breakbutton} onPress={() => this.cancelBreakAlert()}>
                                    <Text style={styles.buttonText}>Cancel Break</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                        {/* The logout button triggers the logOut method and clears all user data.  Then the app navigates to the login screen */}
                        <TouchableOpacity style={styles.button} onPress={() => this.LogOut()}>
                            <Text style={styles.buttonText}>Logout ➡️🚪</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// Noraml export of ProfileScreen for use throughout the App
export default ProfileScreen;

// Styles are defined
const styles = StyleSheet.create({
    breakbutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        marginTop: 10,
        marginRight: 60,
        marginLeft: 60,
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
