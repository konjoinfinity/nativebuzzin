import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from "react-navigation";
import NumericInput from 'react-native-numeric-input'
import moment from "moment";
import { Functions } from "./Functions";
import styles from "./Styles"
import ReactNativeHaptic from 'react-native-haptic';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {
    namekey, genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakthresholdkey, limitkey,
    drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey, hhhourkey, loginButtonText, abvText, indefbreakkey,
    limithourkey, limitdatekey, pacerkey, pacertimekey, autobreakminkey, lastcallkey, logskey, maxreckey, addButtonSize, screenWidth
} from "./Variables";

var numberInputSize = screenWidth < 750 ? 125 : 150

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "", weight: "", alctype: "", break: "", breakdate: "", hours: 0, days: 0, weeks: 0,
            months: 0, autobreak: "", happyhour: "", threshold: "", limit: "", drinks: 0, limitbac: "", cancelbreaks: "",
            custombreak: "", hhhour: "", setautobreak: false, sethappyhour: false, setlimit: false, setcustombreak: false,
            indefbreak: "", limithour: "", pacer: "", setpacer: false, pacertime: "", setlastcall: false, lastcall: "",
            setmaxrec: false, maxrec: ""
        }
    };

    async componentDidMount() {
        try {
            ReactNativeHaptic.generate('impactLight');
            this.setState({ setautobreak: false, sethappyhour: false, setlimit: false, setcustombreak: false, setpacer: false, setlastcall: false, setmaxrec: false })
            var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, cancelbreakskey, limitbackey, limitkey,
                drinkskey, happyhourkey, autobreakthresholdkey, namekey, genderkey, weightkey, hhhourkey, indefbreakkey,
                limithourkey, pacerkey, pacertimekey, lastcallkey, maxreckey])
            this.setState({
                autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), cancelbreaks: JSON.parse(values[2][1]),
                limitbac: JSON.parse(values[3][1]), limit: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
                happyhour: JSON.parse(values[6][1]), threshold: JSON.parse(values[7][1]), name: JSON.parse(values[8][1]),
                gender: JSON.parse(values[9][1]), weight: JSON.parse(values[10][1]), hhhour: JSON.parse(values[11][1]),
                indefbreak: JSON.parse(values[12][1]), limithour: JSON.parse(values[13][1]), pacer: JSON.parse(values[14][1]),
                pacertime: JSON.parse(values[15][1]), lastcall: JSON.parse(values[16][1]), maxrec: JSON.parse(values[17][1])
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
        } catch (error) {
            console.log(error)
        }
    }

    async takeAbreak() {
        try {
            if (this.state.hours !== 0 || this.state.days !== 0 || this.state.weeks !== 0 || this.state.months !== 0) {
                var breakDate = Functions.zeroDate()
                var duration = this.state.days + (this.state.weeks * 7) + (this.state.months * 30), hours = this.state.hours * 60 * 60 * 1000
                if (duration !== 0) { breakDate.setDate(breakDate.getDate() + duration) }
                if (hours !== 0) { breakDate.setTime(breakDate.getTime() + hours) }
                ReactNativeHaptic.generate('selection');
                this.setState({ break: true, breakdate: breakDate })
                await AsyncStorage.multiSet([[breakkey, JSON.stringify(true)], [breakdatekey, JSON.stringify(breakDate)]])
            }
            if (this.state.hours === 0 && this.state.days === 0 && this.state.weeks === 0 && this.state.months === 0) { this.stopBreak("zero") }
        } catch (error) {
            console.log(error)
        }
    }

    async stopBreak(type) {
        try {
            ReactNativeHaptic.generate('selection');
            this.setState({ break: false, breakdate: "", hours: 0, days: 0, weeks: 0, months: 0, cancelbreaks: this.state.cancelbreaks + 1 })
            await AsyncStorage.removeItem(breakdatekey)
            await AsyncStorage.multiSet([[cancelbreakskey, JSON.stringify(this.state.cancelbreaks)], [breakkey, JSON.stringify(false)]])
            if (type !== "zero") { await AsyncStorage.setItem(custombreakkey, JSON.stringify(false), () => { this.setState({ setcustombreak: false, custombreak: false }) }) }
        } catch (error) {
            console.log(error)
        }
    }

    async LogOut() {
        try {
            ReactNativeHaptic.generate('selection');
            await AsyncStorage.removeItem(oldkey)
            await AsyncStorage.removeItem(logskey)
            await AsyncStorage.multiRemove([namekey, key, genderkey, weightkey, breakkey, breakdatekey, autobreakkey, happyhourkey,
                limitkey, autobreakthresholdkey, autobreakminkey, drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey,
                hhhourkey, indefbreakkey, limithourkey, pacerkey, pacertimekey, limitdatekey, lastcallkey, maxreckey])
            this.props.navigation.navigate("Login")
        } catch (error) {
            console.log(error)
        }
    }

    confirmLogout() {
        try {
            ReactNativeHaptic.generate('notificationWarning')
            Alert.alert('Are you sure you want to logout? All user data will be deleted.', 'Please confirm.', [{ text: 'Yes', onPress: () => { this.LogOut() } }, { text: 'No' }], { cancelable: false });
        } catch (error) {
            console.log(error)
        }
    }

    async handleSwitches(statename, keyvalue, setstatename) {
        try {
            if (Platform.OS === "android") { ReactNativeHaptic.generate('selection') }
            if (statename === "custombreak" && this.state.custombreak === true) {
                this.setState({ setcustombreak: true })
                if (this.state.indefbreak === true || this.state.break === true) {
                    this.setState({ indefbreak: false, break: false, breakdate: "" })
                    await AsyncStorage.multiSet([[indefbreakkey, JSON.stringify(false)], [breakkey, JSON.stringify(false)]])
                    await AsyncStorage.removeItem(breakdatekey)
                }
            }
            if (statename === "limit" && this.state.limit === true) { this.setState({ setlimit: true }) }
            if (statename === "lastcall" && this.state.lastcall === true) { this.saveValues("limithour", limithourkey) }
            if (statename === "happyhour" && this.state.happyhour === true) { this.setState({ sethappyhour: true }) }
            this.setState(prevState => ({ [statename]: !prevState[statename] }), () => this.saveSwitches(this.state[statename], keyvalue))
            this.setState(prevState => ({ [setstatename]: !prevState[setstatename] }))
        } catch (error) {
            console.log(error)
        }
    }

    async saveSwitches(statevalue, keyvalue) {
        try {
            await AsyncStorage.setItem(keyvalue, JSON.stringify(statevalue))
        } catch (error) {
            console.log(error)
        }
    }

    async saveValues(statename, keyvalue) {
        try {
            ReactNativeHaptic.generate('selection')
            await AsyncStorage.setItem(keyvalue, JSON.stringify(this.state[statename]))
            if (statename === "limithour") {
                if (this.state.limithour !== 0) {
                    var lastCall = new Date().setHours(this.state.limithour, 0, 0, 0)
                    await AsyncStorage.setItem(limitdatekey, JSON.stringify(lastCall))
                } else {
                    var midnight = new Date()
                    midnight.setDate(midnight.getDate() + 1)
                    midnight.setHours(0, 0, 0, 0)
                    await AsyncStorage.setItem(limitdatekey, JSON.stringify(midnight))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    showHideSetting(statename) {
        try {
            ReactNativeHaptic.generate('selection')
            this.setState(prevState => ({ [statename]: !prevState[statename] }))
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 10 }}><FontIcon name="user" color="#4db6ac" size={(loginButtonText + 3)} /><Text style={{ color: "#000000", fontSize: (loginButtonText + 3), textAlign: "center", paddingBottom: 10 }}>  {this.state.name}  -  {this.state.gender === "Male" ? <Icon name="gender-male" color="#4db6ac" size={(loginButtonText + 1)} /> : <Icon name="gender-female" color="#4db6ac" size={(loginButtonText + 1)} />} {this.state.gender}</Text></View>
                        <Text style={{ color: "#000000", textAlign: "center", color: "#bdbdbd", paddingBottom: 10 }}>_________________________________________</Text>
                        <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 5 }}>Canceled Breaks: {this.state.cancelbreaks && this.state.cancelbreaks}</Text>
                    </View>
                    <View style={styles.profileCards}>
                        <View style={addButtonSize === "tablet" ? styles.centerView : styles.endView}>
                            <Text style={[{ color: "#000000", fontSize: loginButtonText }, styles.profileCardText]}>Happy Hour</Text>
                            <View style={{ marginLeft: 5, marginRight: 5, padding: addButtonSize === "tablet" ? 10 : 0 }}>
                                <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} accessibilityLabel="hhswitch" trackColor={{ true: "#26a69a" }} value={this.state.happyhour} onChange={() => this.handleSwitches("happyhour", happyhourkey, "sethappyhour")} /></View>
                            {this.state.happyhour === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Icon name="settings" color="#e0f2f1" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>
                                : <TouchableOpacity style={[styles.dropShadow, styles.profileSetting]} onPress={() => this.showHideSetting("sethappyhour")}>
                                    <Icon name="settings" color="#ffffff" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>}
                        </View>
                        {this.state.happyhour === true && this.state.sethappyhour && <View>
                            <Text style={{ color: "#000000", textAlign: "center", color: "#bdbdbd", paddingBottom: 5 }}>_________________________________________</Text>
                            <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 10 }}>Set Daily Break</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5 }}>
                                <TouchableOpacity style={[styles.dropShadow, this.state.hhhour === 16 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ hhhour: 16 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 8 : abvText, color: this.state.hhhour === 16 ? "#5A5A5A" : "#ffffff" }}>4PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.hhhour === 17 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ hhhour: 17 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 8 : abvText, color: this.state.hhhour === 17 ? "#5A5A5A" : "#ffffff" }}>5PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.hhhour === 18 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ hhhour: 18 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 8 : abvText, color: this.state.hhhour === 18 ? "#5A5A5A" : "#ffffff" }}>6PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.hhhour === 19 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ hhhour: 19 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 8 : abvText, color: this.state.hhhour === 19 ? "#5A5A5A" : "#ffffff" }}>7PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.hhhour === 20 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ hhhour: 20 }, () => this.saveValues("hhhour", hhhourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 8 : abvText, color: this.state.hhhour === 20 ? "#5A5A5A" : "#ffffff" }}>8PM</Text></View></TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.showHideSetting("sethappyhour")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={addButtonSize === "tablet" ? styles.centerView : styles.endView}>
                            <Text style={[{ color: "#000000", fontSize: loginButtonText }, styles.profileCardText]}>Custom Break</Text>
                            <View style={{ marginLeft: 5, marginRight: 5, padding: addButtonSize === "tablet" ? 10 : 0 }}>
                                <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} trackColor={{ true: "#26a69a" }} value={this.state.custombreak} onChange={() => this.handleSwitches("custombreak", custombreakkey, "setcustombreak")} /></View>
                            {this.state.custombreak === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Icon name="settings" color="#e0f2f1" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>
                                : <TouchableOpacity style={[styles.dropShadow, styles.profileSetting]} onPress={() => this.showHideSetting("setcustombreak")}>
                                    <Icon name="settings" color="#ffffff" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>}
                        </View>
                        {this.state.custombreak === true && this.state.setcustombreak === true && <View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            {this.state.indefbreak === false && <View>
                                <View style={styles.spaceAroundView}>
                                    <View>
                                        <Text style={addButtonSize === "tablet" ? styles.largeproNumericText : styles.proNumericText}>Hours</Text>
                                        <NumericInput minValue={0} maxValue={24} initValue={this.state.hours} value={this.state.hours}
                                            onChange={(hours) => this.state.days >= 1 && hours === 0 ?
                                                setTimeout(() => { this.setState({ hours: 23, days: this.state.days - 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                hours === 24 ? setTimeout(() => { this.setState({ hours: 0, days: this.state.days + 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                    this.setState({ hours }, () => this.takeAbreak())} step={1}
                                            totalWidth={addButtonSize === "tablet" ? 250 : numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                    <View>
                                        <Text style={addButtonSize === "tablet" ? styles.largeproNumericText : styles.proNumericText}>Days</Text>
                                        <NumericInput minValue={0} maxValue={7} initValue={this.state.days} value={this.state.days}
                                            onChange={(days) => this.state.weeks >= 1 && days === 0 ?
                                                setTimeout(() => { this.setState({ days: 6, weeks: this.state.weeks - 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                days === 7 ? setTimeout(() => { this.setState({ days: 0, weeks: this.state.weeks + 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                    this.setState({ days }, () => this.takeAbreak())} step={1}
                                            totalWidth={addButtonSize === "tablet" ? 250 : numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                </View>
                                <View style={styles.spaceAroundView}>
                                    <View>
                                        <Text style={addButtonSize === "tablet" ? styles.largeproNumericText : styles.proNumericText}>Weeks</Text>
                                        <NumericInput minValue={0} maxValue={4} initValue={this.state.weeks} value={this.state.weeks}
                                            onChange={(weeks) => this.state.months >= 1 && weeks === 0 ?
                                                setTimeout(() => { this.setState({ weeks: 3, months: this.state.months - 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                weeks === 4 ? setTimeout(() => { this.setState({ weeks: 0, months: this.state.months + 1 }, () => setTimeout(() => { this.takeAbreak() }, 50)) }, 25) :
                                                    this.setState({ weeks }, () => this.takeAbreak())} step={1}
                                            totalWidth={addButtonSize === "tablet" ? 250 : numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                    <View>
                                        <Text style={addButtonSize === "tablet" ? styles.largeproNumericText : styles.proNumericText}>Months</Text>
                                        <NumericInput minValue={0} maxValue={12} initValue={this.state.months} value={this.state.months}
                                            onChange={(months) => this.setState({ months }, () => this.takeAbreak())} step={1}
                                            totalWidth={addButtonSize === "tablet" ? 250 : numberInputSize} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                            rightButtonBackgroundColor='#00897b' leftButtonBackgroundColor='#00897b' />
                                    </View>
                                </View>
                            </View>}
                            {this.state.indefbreak === true && <View>
                                <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 10 }}>You are taking an indefinite break.</Text>
                                <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.showHideSetting("setcustombreak")}>
                                    <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text></TouchableOpacity>
                            </View>}
                            {this.state.break === false && <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 15 }}>
                                <Text style={[{ color: "#000000", fontSize: loginButtonText }, styles.profileCardText]}>Indefinite Break</Text>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: addButtonSize === "tablet" ? 10 : 0 }}>
                                    <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} trackColor={{ true: "#26a69a" }} value={this.state.indefbreak} onChange={() => this.handleSwitches("indefbreak", indefbreakkey)} /></View></View>}
                            {this.state.break === true && <View>
                                <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 10 }}>You are taking a break until:</Text>
                                <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 5, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text>
                                <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 5 }}> Keep up the good work!</Text>
                                <View style={styles.spaceAroundView}>
                                    <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.stopBreak("all")}>
                                        <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Cancel</Text></TouchableOpacity>
                                    <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.showHideSetting("setcustombreak")}>
                                        <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text></TouchableOpacity>
                                </View>
                            </View>}
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={addButtonSize === "tablet" ? styles.centerView : styles.endView}>
                            <Text style={[{ color: "#000000", fontSize: loginButtonText }, styles.profileCardText]}>Drink Limits</Text>
                            <View style={{ marginLeft: 5, marginRight: 5, padding: addButtonSize === "tablet" ? 10 : 0 }}>
                                <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} trackColor={{ true: "#26a69a" }} value={this.state.limit} onChange={() => this.handleSwitches("limit", limitkey, "setlimit")} /></View>
                            {this.state.limit === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Icon name="settings" color="#e0f2f1" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>
                                : <TouchableOpacity style={[styles.dropShadow, styles.profileSetting]} onPress={() => this.showHideSetting("setlimit")}>
                                    <Icon name="settings" color="#ffffff" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>}
                        </View>
                        {this.state.limit === true && this.state.setlimit === true && <View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 10 }}>Total Drink Limit</Text>
                            <View style={{ alignSelf: "center" }}>
                                <NumericInput minValue={1} maxValue={8} initValue={this.state.drinks} value={this.state.drinks}
                                    onChange={(drinks) => this.setState({ drinks }, () => this.saveValues("drinks", drinkskey))}
                                    totalWidth={addButtonSize === "tablet" ? 250 : numberInputSize} step={1} rounded textColor='#103900' iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor={this.state.drinks === 8 ? "#AE0000" : "#00897b"}
                                    leftButtonBackgroundColor={this.state.drinks === 1 ? "#AE0000" : "#00897b"} />
                            </View>
                            <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.showHideSetting("setlimit")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text></TouchableOpacity>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={addButtonSize === "tablet" ? styles.centerView : styles.endView}>
                            <Text style={[{ color: "#000000", fontSize: loginButtonText }, styles.profileCardText]}>Last Call</Text>
                            <View style={{ marginLeft: 5, marginRight: 5, padding: addButtonSize === "tablet" ? 10 : 0 }}>
                                <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} trackColor={{ true: "#26a69a" }} value={this.state.lastcall} onChange={() => this.handleSwitches("lastcall", lastcallkey, "setlastcall")} /></View>
                            {this.state.lastcall === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Icon name="settings" color="#e0f2f1" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>
                                : <TouchableOpacity style={[styles.dropShadow, styles.profileSetting]} onPress={() => this.showHideSetting("setlastcall")}>
                                    <Icon name="settings" color="#ffffff" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>}
                        </View>
                        {this.state.lastcall === true && this.state.setlastcall === true && <View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 5 }}>Set Last Call</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5 }}>
                                <TouchableOpacity style={[styles.dropShadow, this.state.limithour === 19 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ limithour: 19 }, () => this.saveValues("limithour", limithourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 15 : abvText - 4, color: this.state.limithour === 19 ? "#5A5A5A" : "#ffffff" }}>7PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.limithour === 20 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ limithour: 20 }, () => this.saveValues("limithour", limithourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 15 : abvText - 4, color: this.state.limithour === 20 ? "#5A5A5A" : "#ffffff" }}>8PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.limithour === 21 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ limithour: 21 }, () => this.saveValues("limithour", limithourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 15 : abvText - 4, color: this.state.limithour === 21 ? "#5A5A5A" : "#ffffff" }}>9PM</Text></View></TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5 }}>
                                <TouchableOpacity style={[styles.dropShadow, this.state.limithour === 22 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ limithour: 22 }, () => this.saveValues("limithour", limithourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 15 : abvText - 6, color: this.state.limithour === 22 ? "#5A5A5A" : "#ffffff" }}>10PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.limithour === 23 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ limithour: 23 }, () => this.saveValues("limithour", limithourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 15 : abvText - 6, color: this.state.limithour === 23 ? "#5A5A5A" : "#ffffff" }}>11PM</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, this.state.limithour === 0 ? addButtonSize === "tablet" ? styles.largeselectedPlusMinusButton : styles.selectedPlusMinusButton : addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.setState({ limithour: 0 }, () => this.saveValues("limithour", limithourkey))}>
                                    <View><Text style={{ fontSize: addButtonSize === "tablet" ? abvText - 15 : abvText - 6, color: this.state.limithour === 0 ? "#5A5A5A" : "#ffffff" }}>12AM</Text></View></TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.showHideSetting("setlastcall")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text></TouchableOpacity>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <View style={addButtonSize === "tablet" ? styles.centerView : styles.endView}>
                            <Text style={[{ color: "#000000", fontSize: loginButtonText - 2 }, styles.profileCardText]}>Max Recommended</Text>
                            <View style={{ marginLeft: 5, marginRight: 5, padding: addButtonSize === "tablet" ? 10 : 0 }}>
                                <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} trackColor={{ true: "#26a69a" }} value={this.state.maxrec} onChange={() => this.handleSwitches("maxrec", maxreckey, "setmaxrec")} /></View>
                            {this.state.maxrec === false ? <TouchableOpacity style={styles.profileSettingHidden}>
                                <Icon name="settings" color="#e0f2f1" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>
                                : <TouchableOpacity style={[styles.dropShadow, styles.profileSetting]} onPress={() => this.showHideSetting("setmaxrec")}>
                                    <Icon name="settings" color="#ffffff" size={loginButtonText - 3} style={{ padding: 3.5 }} /></TouchableOpacity>}
                        </View>
                        {this.state.maxrec === true && this.state.setmaxrec === true && <View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 10 }}>Max Recommneded Weekly Limit: {this.state.gender === "Male" ? "14" : "7"}</Text>
                            <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 10 }}>Max Recommneded Monthly Limit: {this.state.gender === "Male" ? "56" : "28"}</Text>
                            <Text style={{ fontSize: addButtonSize === "tablet" ? 24 : 12, color: "#AE0000", textAlign: "center", paddingTop: addButtonSize === "tablet" ? 20 : 5 }}>*Based on CDC Guidelines</Text>
                            <TouchableOpacity style={[styles.profilebreakbutton, styles.dropShadow1]} onPress={() => this.showHideSetting("setmaxrec")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Done</Text></TouchableOpacity>
                        </View>}
                    </View>
                    <View style={styles.profileCards}>
                        <TouchableOpacity style={[styles.profilebutton, styles.dropShadow1]} onPress={() => this.confirmLogout()}><View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Logout   </Text><Icon name="logout" color="#ffffff" size={loginButtonText} style={{ paddingTop: 2 }} /></View></TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default ProfileScreen;