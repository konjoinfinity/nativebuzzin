import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Alert,
    Switch,
    Dimensions,
    PixelRatio
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from "react-navigation";
import NumericInput from 'react-native-numeric-input'
import moment from "moment";

const oldkey = "oldbuzzes"
const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const breakkey = "break"
const breakdatekey = "breakdate"
const autobreakkey = "autobreak"
const happyhourkey = "happyhour"

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
            autobreak: "",
            happyhour: ""
        }
        this.LogOut = this.LogOut.bind(this);
        this.takeAbreak = this.takeAbreak.bind(this);
        this.stopBreak = this.stopBreak.bind(this);
        this.handleAutoBreak = this.handleAutoBreak.bind(this);
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
        await AsyncStorage.getItem(autobreakkey, (error, result) => {
            this.setState({ autobreak: JSON.parse(result) })
        })
        await AsyncStorage.getItem(happyhourkey, (error, result) => {
            this.setState({ happyhour: JSON.parse(result) })
        })
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
                    if (days + hours + minutes + seconds < 0) {
                        this.stopBreak()
                    }
                }, 100);
            }
        })
        var happyHour = new Date()
        happyHour = moment(happyHour).local();
        happyHour = happyHour.hours();
        this.setState({ happyhourtime: happyHour })
    }

    async takeAbreak() {
        var breakDate;
        var duration = this.state.days + (this.state.weeks * 7) + (this.state.months * 30)
        var hours = this.state.hours * 60 * 60 * 1000
        if (this.state.break === true) {
            breakDate = new Date(this.state.breakdate);
        } else if (this.state.break === false) {
            breakDate = new Date();
        }
        if (duration !== 0) {
            breakDate.setDate(breakDate.getDate() + duration);
        }
        if (hours !== 0) {
            breakDate.setTime(breakDate.getTime() + hours);
        }
        Vibration.vibrate();
        this.setState({ break: true, breakdate: breakDate })
        await AsyncStorage.setItem(breakkey, JSON.stringify(true))
        await AsyncStorage.setItem(breakdatekey, JSON.stringify(breakDate))
        this.componentDidMount();
        this.setState({ hours: 0, days: 0, weeks: 0, months: 0 })
    }

    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false, breaktime: "" })
        await AsyncStorage.setItem(breakkey, JSON.stringify(false))
        await AsyncStorage.removeItem(breakdatekey)
    }

    async LogOut() {
        Vibration.vibrate();
        // await AsyncStorage.removeItem(oldkey)
        await AsyncStorage.removeItem(namekey)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(genderkey)
        await AsyncStorage.removeItem(weightkey)
        await AsyncStorage.removeItem(breakkey)
        await AsyncStorage.removeItem(breakdatekey)
        await AsyncStorage.removeItem(autobreakkey)
        await AsyncStorage.removeItem(happyhourkey)
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

    handleAutoBreak() {
        this.setState(prevState => ({ autobreak: !prevState.autobreak }), () => this.saveAutoBreak())
    }

    handleHappyHour() {
        this.setState(prevState => ({ happyhour: !prevState.happyhour }), () => this.saveHappyHour())
    }

    async saveAutoBreak() {
        if (this.state.autobreak === true) {
            await AsyncStorage.setItem(autobreakkey, JSON.stringify(true))
        } else if (this.state.autobreak === false) {
            await AsyncStorage.setItem(autobreakkey, JSON.stringify(false))
        }
    }

    async saveHappyHour() {
        if (this.state.happyhour === true) {
            await AsyncStorage.setItem(happyhourkey, JSON.stringify(true))
        } else if (this.state.happyhour === false) {
            await AsyncStorage.setItem(happyhourkey, JSON.stringify(false))
        }
    }

    render() {
        // Update render sizes for different screens
        var numberInputSize;
        if (Dimensions.get('window').width * PixelRatio.get() < 750) {
            numberInputSize = 125
        } else {
            numberInputSize = 150
        }
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: 25, textAlign: "center" }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}   -   {this.state.weight} lbs.</Text>
                        <Text style={{ textAlign: "center", color: "#bdbdbd", paddingBottom: 10 }}>___________________________________________</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Auto Break</Text><Switch value={this.state.autobreak} onChange={() => this.handleAutoBreak()} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Happy Hour</Text><Switch value={this.state.happyhour} onChange={() => this.handleHappyHour()} />
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                        <Text style={{ fontSize: 18, textAlign: "center" }}>Custom Break</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <View>
                                <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Hours</Text>
                                <NumericInput
                                    minValue={0}
                                    maxValue={24}
                                    initValue={this.state.hours}
                                    value={this.state.hours}
                                    onChange={(hours) => this.setState({ hours })}
                                    totalWidth={numberInputSize}
                                    step={1}
                                    rounded
                                    textColor='#103900'
                                    iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor='#00897b'
                                    leftButtonBackgroundColor='#00897b' />
                            </View>
                            <View>
                                <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Days</Text>
                                <NumericInput
                                    minValue={0}
                                    maxValue={31}
                                    initValue={this.state.days}
                                    value={this.state.days}
                                    onChange={(days) => this.setState({ days })}
                                    totalWidth={numberInputSize}
                                    step={1}
                                    rounded
                                    textColor='#103900'
                                    iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor='#00897b'
                                    leftButtonBackgroundColor='#00897b' />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <View>
                                <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Weeks</Text>
                                <NumericInput
                                    minValue={0}
                                    maxValue={52}
                                    initValue={this.state.weeks}
                                    value={this.state.weeks}
                                    onChange={(weeks) => this.setState({ weeks })}
                                    totalWidth={numberInputSize}
                                    step={1}
                                    rounded
                                    textColor='#103900'
                                    iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor='#00897b'
                                    leftButtonBackgroundColor='#00897b' />
                            </View>
                            <View>
                                <Text style={{ fontSize: 15, textAlign: "center", padding: 5 }}>Months</Text>
                                <NumericInput
                                    minValue={0}
                                    maxValue={12}
                                    initValue={this.state.months}
                                    value={this.state.months}
                                    onChange={(months) => this.setState({ months })}
                                    totalWidth={numberInputSize}
                                    step={1}
                                    rounded
                                    textColor='#103900'
                                    iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor='#00897b'
                                    leftButtonBackgroundColor='#00897b' />
                            </View>
                        </View>
                        {this.state.break === false &&
                            <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak()}>
                                <Text style={styles.buttonText}>Take a Break</Text>
                            </TouchableOpacity>}
                        {this.state.break === true &&
                            <TouchableOpacity style={styles.breakbutton} onPress={() => this.takeAbreak()}>
                                <Text style={styles.buttonText}>Add to Break</Text>
                            </TouchableOpacity>}
                        {this.state.break === true &&
                            <View>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You are taking a break until:</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10, fontWeight: "bold" }}>{moment(this.state.breakdate).format('MMMM Do YYYY, h:mm a')}</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}> Keep up the good work!</Text>
                                <TouchableOpacity style={styles.breakbutton} onPress={() => this.cancelBreakAlert()}>
                                    <Text style={styles.buttonText}>Cancel Break</Text>
                                </TouchableOpacity>
                            </View>}
                        {/* {this.state.happyhour === true &&
                            <View>
                                {this.state.happyhourtime >= 17 ?
                                    <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>It's Happy Hour, enjoy!</Text> :
                                    <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>Happy Hour isn't until 5pm</Text>}
                            </View>} */}
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
        padding: 10,
        marginTop: 15,
        marginRight: 90,
        marginLeft: 90,
        marginBottom: 10,
        borderRadius: 15
    },
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        marginTop: 10,
        marginRight: 70,
        marginLeft: 70,
        marginBottom: 10,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: "center"
    }
})
