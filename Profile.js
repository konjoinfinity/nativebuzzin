// imports to be used within the ProfileScreen
import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Vibration, Switch, Dimensions, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from "react-navigation";
import NumericInput from 'react-native-numeric-input'
import moment from "moment";
import { Functions } from "./Functions";
import {
    namekey, genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakthresholdkey, limitkey,
    drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey, hhhourkey, loginButtonText, abvText, indefbreakkey
} from "./Variables";
import styles from "./Styles"

// Main ProfileScreen component
class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "", weight: "", alctype: "", break: "", breakdate: "", breaktime: "", hours: 0, days: 0, weeks: 0,
            months: 0, autobreak: "", happyhour: "", threshold: "", limit: "", drinks: 0, limitbac: "", cancelbreaks: "",
            custombreak: "", hhhour: "", setautobreak: false, sethappyhour: false, setlimit: false, setcustombreak: false, indefbreak: ""
        }
    };

    async componentDidMount() {
        this.setState({ setautobreak: false, sethappyhour: false, setlimit: false, setcustombreak: false })
        var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, cancelbreakskey, limitbackey, limitkey,
            drinkskey, happyhourkey, autobreakthresholdkey, namekey, genderkey, weightkey, hhhourkey, indefbreakkey])
        this.setState({
            autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), cancelbreaks: JSON.parse(values[2][1]),
            limitbac: JSON.parse(values[3][1]), limit: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
            happyhour: JSON.parse(values[6][1]), threshold: JSON.parse(values[7][1]), name: JSON.parse(values[8][1]),
            gender: JSON.parse(values[9][1]), weight: JSON.parse(values[10][1]), hhhour: JSON.parse(values[11][1]),
            indefbreak: JSON.parse(values[12][1])
        })
        await AsyncStorage.getItem(breakkey, (error, result) => {
            if (result !== null) {
                this.setState({ break: JSON.parse(result) })
                if (JSON.parse(result) === false) { this.setState({ hours: 0, days: 0, weeks: 0, months: 0 }) }
            } else { this.setState({ break: false }) }
        })
        await AsyncStorage.getItem(breakdatekey, (error, result) => {
            if (result !== null) {
                this.setState({ breakdate: JSON.parse(result) })
                // Checking the current break time using the timestamp and setting the breaktime state
                setTimeout(() => {
                    var breaktime = Functions.timeSince(this.state.breakdate, "break")
                    if (breaktime[0] + breaktime[1] + breaktime[2] + breaktime[3] < 0) {
                        if (this.state.autobreak === true) {
                            var stopBreak5pm = moment(new Date()).local().hours()
                            if (stopBreak5pm >= 17) { this.stopBreak("all") }
                        } else if (this.state.autobreak === false) { this.stopBreak("all") }
                    }
                    var breakDate = Date.parse(this.state.breakdate), currentDate = Functions.zeroDate()
                    var durations = Functions.breakDiff(currentDate, breakDate)
                    this.setState({ hours: durations[3], days: durations[2], weeks: durations[1], months: durations[0] })
                }, 100);
            }
        })
    }

    // The takeAbreak function calculates the duration the user entered (hours, days, weeks, months) and assigns it to the 
    // duration and hours variables respectively
    async takeAbreak() {
        if (this.state.hours !== 0 || this.state.days !== 0 || this.state.weeks !== 0 || this.state.months !== 0) {
            var breakDate = Functions.zeroDate()
            var duration = this.state.days + (this.state.weeks * 7) + (this.state.months * 30), hours = this.state.hours * 60 * 60 * 1000
            if (duration !== 0) { breakDate.setDate(breakDate.getDate() + duration) }
            if (hours !== 0) { breakDate.setTime(breakDate.getTime() + hours) }
            Vibration.vibrate(); this.setState({ break: true, breakdate: breakDate })
            await AsyncStorage.multiSet([[breakkey, JSON.stringify(true)], [breakdatekey, JSON.stringify(breakDate)]])
        }
        if (this.state.hours === 0 && this.state.days === 0 && this.state.weeks === 0 && this.state.months === 0) { this.stopBreak("zero") }
    }

    // the stopBreak function cancels the break that the user is currently on, sets the state (break and breaktime) to their initial
    // values and also resets the device storage to their initial values as well.
    async stopBreak(type) {
        Vibration.vibrate();
        this.setState({ break: false, breaktime: "", hours: 0, days: 0, weeks: 0, months: 0, cancelbreaks: this.state.cancelbreaks + 1 })
        await AsyncStorage.removeItem(breakdatekey)
        await AsyncStorage.multiSet([[cancelbreakskey, JSON.stringify(this.state.cancelbreaks)], [breakkey, JSON.stringify(false)]])
        if (type !== "zero") {
            await AsyncStorage.setItem(custombreakkey, JSON.stringify(false), () => { this.setState({ setcustombreak: false, custombreak: false }) })
        }
    }

    // The LogOut function deletes all user values (buzzes, oldbuzzes, name, gender, weight, break, and breakdate) stored in device 
    // storage and navigates back to the login screen.
    async LogOut() {
        Vibration.vibrate();
        // await AsyncStorage.removeItem(oldkey)
        await AsyncStorage.multiRemove([namekey, key, genderkey, weightkey, breakkey, breakdatekey, autobreakkey, happyhourkey,
            limitkey, autobreakthresholdkey, drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey])
        this.props.navigation.navigate("Login")
    }

    handleSwitches(statename, keyvalue, setstatename) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }), () => this.saveSwitches(this.state[statename], keyvalue))
        if (this.state[setstatename] === false) { this.setState({ [setstatename]: true }) }
    }

    async saveSwitches(statevalue, keyvalue) {
        await AsyncStorage.setItem(keyvalue, JSON.stringify(statevalue))
    }

    changeBac(increment, statename, keyvalue) {
        if (increment === "up" && this.state[statename] < 0.10) {
            this.setState({ [statename]: Math.round((this.state[statename] + 0.01) * 100) / 100 }, () => this.saveValues(statename, keyvalue))
        }
        if (increment === "down" && this.state[statename] > 0.02) {
            this.setState({ [statename]: Math.round((this.state[statename] - 0.01) * 100) / 100 }, () => this.saveValues(statename, keyvalue))
        }
    }

    async saveValues(statename, keyvalue) {
        await AsyncStorage.setItem(keyvalue, JSON.stringify(this.state[statename]))
    }

    showHideSetting(statename) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }))
    }

    render() {
        var numberInputSize = Dimensions.get('window').width * PixelRatio.get() < 750 ? 125 : 150
        return (
            <View>
                {/* When navigating to this screen after initial mount, componentDidMount is triggered to ensure a fresh copy of data */}
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: (loginButtonText + 3), textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: (loginButtonText + 1), textAlign: "center" }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}   -   {this.state.weight} lbs.</Text>
                        <Text style={{ textAlign: "center", color: "#bdbdbd", paddingBottom: 10 }}>___________________________________________</Text>
                        <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Canceled Breaks: {this.state.cancelbreaks && this.state.cancelbreaks}</Text>
                    </View>
                    <View style={styles.profileCards}>
                        <View style={styles.endView}>
                            <Text style={[{ fontSize: loginButtonText }, styles.profileCardText]}>Happy Hour</Text>
                            <View style={{ marginLeft: 5, marginRight: 5 }}>
                                <Switch value={this.state.happyhour} onChange={() => this.handleSwitches("happyhour", happyhourkey, "sethappyhour")} /></View>
                            {this.state.happyhour === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Text style={[{ fontSize: loginButtonText }, styles.profileSettingTextHidden]}>⚙︎</Text></TouchableOpacity>
                                : <TouchableOpacity style={styles.profileSetting} onPress={() => this.showHideSetting("sethappyhour")}>
                                    <Text style={[{ fontSize: loginButtonText }, styles.profileSettingText]}>⚙︎</Text></TouchableOpacity>}
                        </View>
                        {this.state.happyhour === true && this.state.sethappyhour && <View>
                            <Text style={styles.profileLine}>___________________________________________</Text>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 10 }}>Set Daily Break</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5 }}>
                                <TouchableOpacity style={this.state.hhhour === 16 ? styles.selectedPlusMinusButton : styles.plusMinusButtons} onPress={() => this.setState({ hhhour: 16 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>4PM</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.hhhour === 17 ? styles.selectedPlusMinusButton : styles.plusMinusButtons} onPress={() => this.setState({ hhhour: 17 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>5PM</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.hhhour === 18 ? styles.selectedPlusMinusButton : styles.plusMinusButtons} onPress={() => this.setState({ hhhour: 18 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>6PM</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.hhhour === 19 ? styles.selectedPlusMinusButton : styles.plusMinusButtons} onPress={() => this.setState({ hhhour: 19 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>7PM</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.hhhour === 20 ? styles.selectedPlusMinusButton : styles.plusMinusButtons} onPress={() => this.setState({ hhhour: 20 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>8PM</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={styles.endView}>
                            <Text style={[{ fontSize: loginButtonText }, styles.profileCardText]}>Custom Break</Text>
                            <View style={{ marginLeft: 5, marginRight: 5 }}>
                                <Switch value={this.state.custombreak} onChange={() => this.handleSwitches("custombreak", custombreakkey, "setcustombreak")} /></View>
                            {this.state.custombreak === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Text style={[{ fontSize: loginButtonText }, styles.profileSettingTextHidden]}>⚙︎</Text></TouchableOpacity>
                                : <TouchableOpacity style={styles.profileSetting} onPress={() => this.showHideSetting("setcustombreak")}>
                                    <Text style={[{ fontSize: loginButtonText }, styles.profileSettingText]}>⚙︎</Text></TouchableOpacity>}
                        </View>
                        {this.state.custombreak === true && this.state.setcustombreak === true && <View>
                            <Text style={styles.profileLine}>___________________________________________</Text>
                            {this.state.indefbreak === false && <View>
                                <View style={styles.spaceAroundView}>
                                    <View>
                                        <Text style={styles.proNumericText}>Hours</Text>
                                        <NumericInput minValue={0} maxValue={24} initValue={this.state.hours} value={this.state.hours}
                                            onChange={(hours) => this.state.days >= 1 && hours === 0 ?
                                                setTimeout(() => { this.setState({ hours: 23, days: this.state.days - 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                hours === 24 ? setTimeout(() => { this.setState({ hours: 0, days: this.state.days + 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                    this.setState({ hours }, () => this.takeAbreak())} step={1}
                                            totalWidth={numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                    <View>
                                        <Text style={styles.proNumericText}>Days</Text>
                                        <NumericInput minValue={0} maxValue={7} initValue={this.state.days} value={this.state.days}
                                            onChange={(days) => this.state.weeks >= 1 && days === 0 ?
                                                setTimeout(() => { this.setState({ days: 6, weeks: this.state.weeks - 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                days === 7 ? setTimeout(() => { this.setState({ days: 0, weeks: this.state.weeks + 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                    this.setState({ days }, () => this.takeAbreak())} step={1}
                                            totalWidth={numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                </View>
                                <View style={styles.spaceAroundView}>
                                    <View>
                                        <Text style={styles.proNumericText}>Weeks</Text>
                                        <NumericInput minValue={0} maxValue={4} initValue={this.state.weeks} value={this.state.weeks}
                                            onChange={(weeks) => this.state.months >= 1 && weeks === 0 ?
                                                setTimeout(() => { this.setState({ weeks: 3, months: this.state.months - 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                weeks === 4 ? setTimeout(() => { this.setState({ weeks: 0, months: this.state.months + 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                    this.setState({ weeks }, () => this.takeAbreak())} step={1}
                                            totalWidth={numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                    <View>
                                        <Text style={styles.proNumericText}>Months</Text>
                                        <NumericInput minValue={0} maxValue={12} initValue={this.state.months} value={this.state.months}
                                            onChange={(months) => this.setState({ months }, () => this.takeAbreak())} step={1}
                                            totalWidth={numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                </View>
                            </View>}
                            {this.state.indefbreak === true && <View>
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 10 }}>You are taking an indefinite break.</Text>
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 10 }}> Hats off to you, keep up the good work!</Text>
                                <Text style={styles.profileLine}>___________________________________________</Text>
                            </View>}
                            {this.state.break === false && <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 15 }}>
                                <Text style={[{ fontSize: loginButtonText }, styles.profileCardText]}>Indefinite Break</Text>
                                <View style={{ marginLeft: 5, marginRight: 5 }}>
                                    <Switch value={this.state.indefbreak} onChange={() => this.handleSwitches("indefbreak", indefbreakkey)} /></View></View>}
                            {this.state.break === true && <View>
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 10 }}>You are taking a break until:</Text>
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text>
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5 }}> Keep up the good work!</Text>
                                <View style={styles.spaceAroundView}>
                                    <TouchableOpacity style={styles.profilebreakbutton} onPress={() => this.stopBreak("all")}>
                                        <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.profilebreakbutton} onPress={() => this.showHideSetting("setcustombreak")}>
                                        <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>}
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={styles.endView}>
                            <Text style={[{ fontSize: loginButtonText }, styles.profileCardText]}>Set Limit</Text>
                            <View style={{ marginLeft: 5, marginRight: 5 }}>
                                <Switch value={this.state.limit} onChange={() => this.handleSwitches("limit", limitkey, "setlimit")} /></View>
                            {this.state.limit === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Text style={[{ fontSize: loginButtonText }, styles.profileSettingTextHidden]}>⚙︎</Text></TouchableOpacity>
                                : <TouchableOpacity style={styles.profileSetting} onPress={() => this.showHideSetting("setlimit")}>
                                    <Text style={[{ fontSize: loginButtonText }, styles.profileSettingText]}>⚙︎</Text></TouchableOpacity>}
                        </View>
                        {this.state.limit === true && this.state.setlimit === true && <View>
                            <Text style={styles.profileLine}>___________________________________________</Text>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Set BAC Limit</Text>
                            <View style={styles.plusMinusView}>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.limitbac === 0.02 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.changeBac("down", "limitbac", limitbackey)}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>-</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.smallbac, { backgroundColor: "#e0f2f1" }]}>
                                    <Text style={{ fontSize: loginButtonText, textAlign: "center" }}>{this.state.limitbac && this.state.limitbac.toFixed(2)}</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.limitbac === 0.1 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.changeBac("up", "limitbac", limitbackey)}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text></View>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 10 }}>Total Drink Limit</Text>
                            <View style={{ alignSelf: "center" }}>
                                <NumericInput minValue={1} maxValue={15} initValue={this.state.drinks} value={this.state.drinks}
                                    onChange={(drinks) => this.setState({ drinks }, () => this.saveValues("drinks", drinkskey))}
                                    totalWidth={numberInputSize} step={1} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor={this.state.drinks === 15 ? "#AE0000" : "#00897b"}
                                    leftButtonBackgroundColor={this.state.drinks === 1 ? "#AE0000" : "#00897b"} />
                            </View>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={styles.endView}>
                            <Text style={[{ fontSize: loginButtonText }, styles.profileCardText]}>Auto Break</Text>
                            <View style={{ marginLeft: 5, marginRight: 5 }}>
                                <Switch value={this.state.autobreak} onChange={() => this.handleSwitches("autobreak", autobreakkey, "setautobreak")} /></View>
                            {this.state.autobreak === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Text style={[{ fontSize: loginButtonText }, styles.profileSettingTextHidden]}>⚙︎</Text></TouchableOpacity>
                                : <TouchableOpacity style={styles.profileSetting} onPress={() => this.showHideSetting("setautobreak")}>
                                    <Text style={[{ fontSize: loginButtonText }, styles.profileSettingText]}>⚙︎</Text></TouchableOpacity>}
                        </View>
                        {this.state.autobreak === true && this.state.setautobreak === true && <View>
                            <Text style={styles.profileLine}>___________________________________________</Text>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Auto Break BAC Threshold</Text>
                            <View style={styles.plusMinusView}>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.threshold === 0.02 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.changeBac("down", "threshold", autobreakthresholdkey)}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>-</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.smallbac, { backgroundColor: "#e0f2f1" }]}>
                                    <Text style={{ fontSize: loginButtonText, textAlign: "center" }}>{this.state.threshold && this.state.threshold.toFixed(2)}</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.threshold === 0.1 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.changeBac("up", "threshold", autobreakthresholdkey)}>
                                    <View><Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <TouchableOpacity style={styles.profilebutton} onPress={() => this.LogOut()}>
                            <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Logout ➡️🚪</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default ProfileScreen;
