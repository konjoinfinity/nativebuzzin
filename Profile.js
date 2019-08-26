import React, { Component } from 'react';
import {
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
import { Functions } from "./Functions";
import {
    namekey, genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey,
    autobreakthresholdkey, cutoffkey, drinkskey, cutoffbackey, cancelbreakskey, showcutoffkey, custombreakkey
} from "./Variables";
import styles from "./Styles"

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
            happyhour: "",
            threshold: "",
            cutoff: "",
            drinks: 0,
            cutoffbac: "",
            cancelbreaks: "",
            custombreak: ""
        }
        this.LogOut = this.LogOut.bind(this);
        this.takeAbreak = this.takeAbreak.bind(this);
        this.stopBreak = this.stopBreak.bind(this);
    };

    async componentDidMount() {
        await AsyncStorage.getItem(autobreakkey, (error, result) => {
            this.setState({ autobreak: JSON.parse(result) })
        })
        await AsyncStorage.getItem(custombreakkey, (error, result) => {
            this.setState({ custombreak: JSON.parse(result) })
        })
        await AsyncStorage.getItem(cancelbreakskey, (error, result) => {
            this.setState({ cancelbreaks: JSON.parse(result) })
        })
        await AsyncStorage.getItem(cutoffbackey, (error, result) => {
            this.setState({ cutoffbac: JSON.parse(result) })
        })
        await AsyncStorage.getItem(cutoffkey, (error, result) => {
            this.setState({ cutoff: JSON.parse(result) })
        })
        await AsyncStorage.getItem(drinkskey, (error, result) => {
            this.setState({ drinks: JSON.parse(result) })
        })
        await AsyncStorage.getItem(happyhourkey, (error, result) => {
            this.setState({ happyhour: JSON.parse(result) })
        })
        await AsyncStorage.getItem(autobreakthresholdkey, (error, result) => {
            this.setState({ threshold: JSON.parse(result) })
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
                if (JSON.parse(result) === false) {
                    this.setState({ hours: 0, days: 0, weeks: 0, months: 0 })
                }
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
                    var dayHourMin = Functions.getDayHourMin(date2, date1);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    if (days + hours + minutes + seconds < 0) {
                        this.stopBreak()
                    }
                    var currentDate = new Date()
                    var breakDate = Date.parse(this.state.breakdate)
                    var durations = Functions.breakDiff(currentDate, breakDate)
                    this.setState({ hours: durations[3], days: durations[2], weeks: durations[1], months: durations[0] })
                }, 100);
            }
        })
        var happyHour = new Date()
        happyHour = moment(happyHour).local();
        happyHour = happyHour.hours();
        this.setState({ happyhourtime: happyHour })
    }

    async takeAbreak() {
        if (this.state.hours !== 0 || this.state.days !== 0 || this.state.weeks !== 0 || this.state.months !== 0) {
            var breakDate = new Date();
            var duration = this.state.days + (this.state.weeks * 7) + (this.state.months * 30)
            var hours = this.state.hours * 60 * 60 * 1000
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
        }
        if (this.state.hours === 0 && this.state.days === 0 && this.state.weeks === 0 && this.state.months === 0) {
            this.stopBreak()
        }
    }

    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false, breaktime: "", hours: 0, days: 0, weeks: 0, months: 0, cancelbreaks: this.state.cancelbreaks + 1 })
        await AsyncStorage.setItem(breakkey, JSON.stringify(false))
        await AsyncStorage.removeItem(breakdatekey)
        await AsyncStorage.setItem(cancelbreakskey, JSON.stringify(this.state.cancelbreaks))
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
        await AsyncStorage.removeItem(cutoffkey)
        await AsyncStorage.removeItem(autobreakthresholdkey)
        await AsyncStorage.removeItem(drinkskey)
        await AsyncStorage.removeItem(cutoffbackey)
        await AsyncStorage.removeItem(cancelbreakskey)
        await AsyncStorage.removeItem(showcutoffkey)
        await AsyncStorage.removeItem(custombreakkey)
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

    handleSwitches(statename, keyvalue) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }), () => this.saveSwitches(this.state[statename], keyvalue))
    }

    async saveSwitches(statevalue, keyvalue) {
        if (statevalue === true) {
            await AsyncStorage.setItem(keyvalue, JSON.stringify(true))
        } else if (statevalue === false) {
            await AsyncStorage.setItem(keyvalue, JSON.stringify(false))
        }
    }

    changeBac(increment, statename, keyvalue) {
        if (increment === "up") {
            if (this.state[statename] < 0.10) {
                if (this.state[statename] === 0.06) {
                    this.setState({ [statename]: 0.07 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.07) {
                    this.setState({ [statename]: 0.08 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.08) {
                    this.setState({ [statename]: 0.09 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.09) {
                    this.setState({ [statename]: 0.10 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.02) {
                    this.setState({ [statename]: 0.03 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.03) {
                    this.setState({ [statename]: 0.04 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.04) {
                    this.setState({ [statename]: 0.05 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.05) {
                    this.setState({ [statename]: 0.06 }, () => this.saveValues(statename, keyvalue))
                }
            }
        }
        if (increment === "down") {
            if (this.state[statename] > 0.02) {
                if (this.state[statename] === 0.06) {
                    this.setState({ [statename]: 0.05 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.05) {
                    this.setState({ [statename]: 0.04 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.04) {
                    this.setState({ [statename]: 0.03 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.03) {
                    this.setState({ [statename]: 0.02 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.10) {
                    this.setState({ [statename]: 0.09 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.09) {
                    this.setState({ [statename]: 0.08 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.08) {
                    this.setState({ [statename]: 0.07 }, () => this.saveValues(statename, keyvalue))
                } else if (this.state[statename] === 0.07) {
                    this.setState({ [statename]: 0.06 }, () => this.saveValues(statename, keyvalue))
                }
            }
        }
    }

    async saveValues(statename, keyvalue) {
        await AsyncStorage.setItem(keyvalue, JSON.stringify(this.state[statename]))
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
                        <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 5 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Auto Break</Text><Switch value={this.state.autobreak} onChange={() => this.handleSwitches("autobreak", autobreakkey)} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Happy Hour</Text><Switch value={this.state.happyhour} onChange={() => this.handleSwitches("happyhour", happyhourkey)} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 5 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Cut Off</Text><Switch value={this.state.cutoff} onChange={() => this.handleSwitches("cutoff", cutoffkey)} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Custom Break</Text><Switch value={this.state.custombreak} onChange={() => this.handleSwitches("custombreak", custombreakkey)} />
                            </View>
                        </View>
                        <Text style={{ textAlign: "center", color: "#bdbdbd", paddingBottom: 10 }}>___________________________________________</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Canceled Breaks: {this.state.cancelbreaks && this.state.cancelbreaks}</Text>
                    </View>
                    {this.state.autobreak === true &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                            <View>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>Auto Break BAC Threshold</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", padding: 5 }}>
                                    <TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.changeBac("down", "threshold", autobreakthresholdkey)}>
                                        <View>
                                            <Text style={{ fontSize: 18, color: "#ffffff" }}>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.smallbac, { backgroundColor: "#e0f2f1" }]}>
                                        <Text style={{ fontSize: 20, textAlign: "center" }}>{this.state.threshold && this.state.threshold.toFixed(2)}</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.changeBac("up", "threshold", autobreakthresholdkey)}>
                                        <View>
                                            <Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>}
                    {this.state.happyhour === true &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                            <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>You are on a daily break until Happy Hour at 5pm.</Text>
                        </View>}
                    {this.state.cutoff === true &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 }}>
                            <View>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 5 }}>BAC Cut Off</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", padding: 5 }}>
                                    <TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.changeBac("down", "cutoffbac", cutoffbackey)}>
                                        <View>
                                            <Text style={{ fontSize: 18, color: "#ffffff" }}>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.smallbac, { backgroundColor: "#e0f2f1" }]}>
                                        <Text style={{ fontSize: 20, textAlign: "center" }}>{this.state.cutoffbac && this.state.cutoffbac.toFixed(2)}</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.changeBac("up", "cutoffbac", cutoffbackey)}>
                                        <View>
                                            <Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, textAlign: "center", padding: 10 }}>Total Drinks Cut Off</Text>
                                <View style={{ alignSelf: "center" }}>
                                    <NumericInput
                                        minValue={1}
                                        maxValue={15}
                                        initValue={this.state.drinks}
                                        value={this.state.drinks}
                                        onChange={(drinks) => this.setState({ drinks }, () => this.saveValues("drinks", drinkskey))}
                                        totalWidth={numberInputSize}
                                        step={1}
                                        rounded
                                        textColor='#103900'
                                        iconStyle={{ color: 'white' }}
                                        rightButtonBackgroundColor='#00897b'
                                        leftButtonBackgroundColor='#00897b' />
                                </View>
                            </View>
                        </View>}
                    {this.state.custombreak === true &&
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
                                        onChange={(hours) => this.setState({ hours }, () => this.takeAbreak())}
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
                                        onChange={(days) => this.setState({ days }, () => this.takeAbreak())}
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
                                        onChange={(weeks) => this.setState({ weeks }, () => this.takeAbreak())}
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
                                        onChange={(months) => this.setState({ months }, () => this.takeAbreak())}
                                        totalWidth={numberInputSize}
                                        step={1}
                                        rounded
                                        textColor='#103900'
                                        iconStyle={{ color: 'white' }}
                                        rightButtonBackgroundColor='#00897b'
                                        leftButtonBackgroundColor='#00897b' />
                                </View>
                            </View>
                            {this.state.break === true &&
                                <View>
                                    <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You are taking a break until:</Text>
                                    <Text style={{ fontSize: 22, textAlign: "center", padding: 10, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text>
                                    <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}> Keep up the good work!</Text>
                                    <TouchableOpacity style={styles.profilebreakbutton} onPress={() => this.cancelBreakAlert()}>
                                        <Text style={styles.profilebuttonText}>Cancel Break</Text>
                                    </TouchableOpacity>
                                </View>}
                        </View>}
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10 }}>
                        <TouchableOpacity style={styles.profilebutton} onPress={() => this.LogOut()}>
                            <Text style={styles.profilebuttonText}>Logout ➡️🚪</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default ProfileScreen;