// imports to be used within the HomeScreen
import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Vibration, Alert, Modal, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { AlertHelper } from './AlertHelper';
import { NavigationEvents } from "react-navigation";
import RNSpeedometer from 'react-native-speedometer'
import moment from "moment";
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText,
    abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, namekey,
    genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakminkey,
    gaugeLabels, warnText, dangerText, autobreakthresholdkey, limitbackey, limitkey, drinkskey, cancelbreakskey,
    showlimitkey, abovePoint10, custombreakkey, hhhourkey, indefbreakkey, loginButtonText
} from "./Variables";
import { Functions } from "./Functions";
import styles from "./Styles"

const CopilotView = walkthroughable(View);

// Main HomeScreen component, this.state is a temporary local storage for the app within HomeScreen
// Used to access, manipulate, and render data 
class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "", weight: "", bac: 0.0, buzzes: [], oldbuzzes: [], alctype: "Beer", oz: 12, abv: 0.05, countdown: false,
            timer: "", break: "", breakdate: "", autobreak: "", focus: false, modal1: false, modal2: false, flashwarning: "#AE0000",
            flashtext: "", flashtimer: "", happyhour: "", happyhourtime: "", threshold: "", limit: "", limitbac: "", drinks: "",
            showlimit: false, hhhour: "", indefbreak: false, timesince: null
        }
    };

    // componentDidMount runs when HomeScreen completes loading 
    // This function/method is also run when navigating to the HomeScreen
    async componentDidMount() {
        var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, indefbreakkey, limitbackey, limitkey, drinkskey,
            happyhourkey, autobreakthresholdkey, namekey, genderkey, weightkey, hhhourkey])
        this.setState({
            autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), indefbreak: JSON.parse(values[2][1]),
            limitbac: JSON.parse(values[3][1]), limit: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
            happyhour: JSON.parse(values[6][1]), threshold: JSON.parse(values[7][1]), name: JSON.parse(values[8][1]),
            gender: JSON.parse(values[9][1]), weight: JSON.parse(values[10][1]), hhhour: JSON.parse(values[11][1])
        })
        await AsyncStorage.getItem(breakkey, (error, result) => {
            if (result !== null) { this.setState({ break: JSON.parse(result) }) }
        })
        // All AsyncStorage methods are reading data from device storage and writing the values to the HomeScreen state 
        await AsyncStorage.getItem(breakdatekey, (error, result) => {
            if (result !== null) {
                this.setState({ breakdate: JSON.parse(result) })
                // Checking the current break time using the timestamp and setting the breaktime state
                setTimeout(() => {
                    var breaktime = Functions.timeSince(this.state.breakdate, "break")
                    if (breaktime[0] + breaktime[1] + breaktime[2] + breaktime[3] < 0) {
                        if (this.state.autobreak === true) {
                            var stopBreak5pm = moment(new Date()).local().hours()
                            if (stopBreak5pm >= 17) { this.stopBreak("break") }
                        } else if (this.state.autobreak === false) { this.stopBreak("break") }
                    }
                }, 100);
            }
        })
        // To seed data, comment out just this function and add data to the buzz array
        await AsyncStorage.getItem(key, (error, result) => {
            result !== null && result !== "[]" ? this.setState({ buzzes: JSON.parse(result) }) : this.setState({ buzzes: [] })
        })
        // All AsyncStorage methods are reading data from device storage and writing the values to the HomeScreen state 
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) }, () => this.checkBac())
                setTimeout(() => {
                    var durations = Functions.timeSince(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes[this.state.oldbuzzes.length - 1].length - 1].dateCreated, "timesince")
                    this.setState({ timesince: `${durations[0]} ${durations[0] === 1 ? "day" : "days"}, ${durations[1]} ${durations[1] === 1 ? "hour" : "hours"}, ${durations[2]} ${durations[2] === 1 ? "minute" : "minutes"}, and ${durations[3]} ${durations[3] === 1 ? "second" : "seconds"}` })
                }, 200);
            } else { this.setState({ oldbuzzes: [] }, () => this.checkBac()) }
        })
        // Checks to see if the 'login' param is set to true (passed from the login screen), then starts the copilot walkthrough
        // Then sets the param to false, copilot only renders once upon initial login
        const login = this.props.navigation.getParam('login');
        if (login === true) {
            this.props.copilotEvents.on('stepChange', this.handleStepChange);
            setTimeout(() => {
                this.props.start();
                this.props.navigation.setParams({ login: false });
            }, 1000);
        }
        // this.state.focus is a conditional so that the HomeScreen will fire componentDidMount when navigating to it
        // to ensure a fresh copy of the data from the local device
        setTimeout(() => { this.setState({ focus: true }, () => this.checkBac()) }, 1050);
        if (this.state.happyhour === true) {
            var happyHour = moment(new Date()).local().hours()
            happyHour < this.state.hhhour ? this.setState({ happyhourtime: happyHour }) : this.setState({ happyhourtime: "" })
        } else if (this.state.happyhour === false) { this.setState({ happyhourtime: "" }) }
    }

    // componentWillUnmount runs when the HomeScreen is navigated away from
    // copilot events are turned off to prevent errors, the current timer (used to auto calculate the bac) is stopped
    componentWillUnmount() {
        this.props.copilotEvents.off('stop');
        clearInterval(this.state.timer);
        clearInterval(this.state.flashtimer);
    }

    handleModal(number) {
        Vibration.vibrate();
        this.setState({ [number]: !this.state[number] });
    }

    // handleStepChange defines the copilot steps (intro walkthrough), what happens when each step/order is triggered
    // This method programatically demos the app for the users when they initially login
    handleStepChange = (step) => {
        if (step.order === 1 || step.order === 3) {
            var timerAdd = setInterval(() => this.addDrink(), 1000);
            setTimeout(() => { clearInterval(timerAdd) }, 2100);
            setTimeout(() => { this.clearDrinks() }, 3000);
        }
        if (step.order === 2) {
            setTimeout(() => { this.alcswitch.setActive(1); this.setState({ alctype: "Wine" }) }, 1000);
            setTimeout(() => { this.alcswitch.setActive(2); this.setState({ alctype: "Liquor" }) }, 1500);
            setTimeout(() => { this.alcswitch.setActive(0); this.setState({ alctype: "Beer" }) }, 2000);
            setTimeout(() => { this.abvswitch.setActive(4); this.setState({ abv: 0.07 }) }, 2500);
            setTimeout(() => { this.abvswitch.setActive(1); this.setState({ abv: 0.05 }) }, 3000);
            setTimeout(() => { this.ozswitch.setActive(2); this.setState({ oz: 20 }) }, 3500);
            setTimeout(() => { this.ozswitch.setActive(0); this.setState({ oz: 12 }) }, 4000);
        }
    }

    // The addDrink method creates a new drink object {drinkType (Beer, Wine, Liquor), dateCreated (Current Timestamp),
    // oz (number of ounces), and abv (alcoholic content)}  The drink object is added to the buzz array
    // The checkBac method is called as the callback to the setstate function, saveBuzz is then called to write the 
    // new current buzz state to device storage. Dropdown conditionals are triggered if bac is 0.04-0.08. A full
    // screen modal is triggered if the bac is above 0.08 (yellow warning) and when the bac is above 0.10 a (red danger) modal is
    // triggered.
    async addDrink() {
        Vibration.vibrate();
        var drinkDate = new Date();
        this.setState(prevState => ({ buzzes: [...prevState.buzzes, { drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }] }), () => this.checkBac())
        setTimeout(() => {
            this.saveBuzz();
            this.flashWarning();
            if (this.state.bac > 0.04 && this.state.bac < 0.06) { AlertHelper.show("success", "Optimal Buzz", "You are in the Optimal Buzz Zone, drink water.") }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) { AlertHelper.show("warn", "Slow Down", "Please take a break and drink some water.") }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) { AlertHelper.show("error", "Drunk", "Stop drinking and drink water.") }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { this.handleModal("modal1") }
            if (this.state.bac > 0.10) { this.handleModal("modal2") }
        }, 200);
    }

    // saveBuzz writes the current state of buzzes to device storage (asyncstorage)  
    async saveBuzz() {
        await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
        if (this.state.bac > this.state.threshold) { await AsyncStorage.setItem(autobreakminkey, JSON.stringify(true)) }
        if (this.state.limit === true && this.state.bac > this.state.limitbac || this.state.buzzes.length >= this.state.drinks) {
            this.setState({ showlimit: true }), await AsyncStorage.setItem(showlimitkey, JSON.stringify(true))
        }
    }

    // checkBac is the main function which continually checks the users bac if the countdown is running
    // first checks to see if the length of buzzes is greater than or equal to one, then runs the single duration
    // method/function passing in the first drink's dateCreated in the buzz array, the value is assigned to variable duration  
    async checkBac() {
        if (this.state.buzzes.length >= 1) {
            var duration = Functions.singleDuration(this.state.buzzes[0].dateCreated);
            var totalBac = Functions.varGetBAC(this.state.weight, this.state.gender, duration, this.state.buzzes)
            if (totalBac > 0) {
                totalBac = parseFloat(totalBac.toFixed(6));
                this.setState({ bac: totalBac })
                if (totalBac < 0.06 && this.state.flashtext === true) {
                    clearInterval(this.state.flashtimer)
                    this.setState({ flashtext: false, flashtimer: "", flashtext: "" })
                }
                if (this.state.countdown === false) { this.setState({ countdown: true }, () => this.countdownBac()) }
            } else {
                this.setState({ countdown: false }, () => clearInterval(this.state.timer))
                setTimeout(() => this.setState({ timer: "" }, () => this.moveToOld()), 200);
            }
            // If length of buzzes is equal to 0, countdown is set to false and the and the countdown timer is cleared.
            // Lastly, this.state.timer is cleared.
        } else if (this.state.buzzes.length === 0) {
            this.setState({ bac: 0.0, countdown: false }, () => clearInterval(this.state.timer))
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    flashWarning() {
        if (this.state.bac > 0.06) {
            this.setState({ flashtext: true })
            setTimeout(() => {
                if (this.state.flashtimer === "") {
                    var flashTimer = setInterval(() => {
                        this.setState(this.state.flashwarning === "#00bfa5" ? { flashwarning: "#AE0000" } : { flashwarning: "#00bfa5" })
                    }, 800);
                    this.setState({ flashtimer: flashTimer })
                }
            }, 200);
        }
    }

    // The countdownBac method starts the setInterval (countdown), to continually check the users BAC every half second (500 ms)
    // if this.state.timer is set to false, the countdown is cleared  
    countdownBac() {
        let bacTimer;
        if (this.state.countdown === true) {
            bacTimer = setInterval(() => this.checkBac(), 500);
            this.setState({ timer: bacTimer });
        } else if (this.state.countdown === false) {
            clearInterval(this.state.timer);
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    // The moveToOld method takes the current states of buzzes and the current state of oldbuzzes, assigns them to oldbuzzarray and
    // newbuzzarray respectively.  The expired buzzes (newbuzzarray) is then pushed into the oldbuzz array.  The oldbuzzarray is then
    // written to device storage.  Current buzzes are deleted from device storage and this.state is set to buzzes: [], bac: 0.0, 
    // oldbuzzes: []. this.state.oldbuzzes is then set to oldbuzz device storage.
    async moveToOld() {
        var autobreakcheck, oldbuzzarray = this.state.oldbuzzes, newbuzzarray = this.state.buzzes;
        await AsyncStorage.getItem(autobreakminkey, (error, result) => { autobreakcheck = JSON.parse(result) })
        oldbuzzarray.push(newbuzzarray);
        await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzarray))
        await AsyncStorage.removeItem(key, () => { this.setState({ buzzes: [], bac: 0.0, oldbuzzes: [] }) })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") { setTimeout(() => { this.setState({ oldbuzzes: JSON.parse(result) }) }, 200) }
        })
        if (this.state.autobreak === true && autobreakcheck === true) {
            var autoBreakDate = Functions.zeroDate();
            autoBreakDate.setDate(autoBreakDate.getDate() + 1);
            this.setState({ break: true, breakdate: autoBreakDate })
            await AsyncStorage.multiSet([[breakkey, JSON.stringify(true)], [breakdatekey, JSON.stringify(autoBreakDate)],
            [autobreakminkey, JSON.stringify(false)]], () => this.componentDidMount())
        }
        if (this.state.showlimit === true) {
            await AsyncStorage.multiSet([[limitkey, JSON.stringify(false)], [showlimitkey, JSON.stringify(false)]], () => this.setState({ showlimit: false, limit: false, limitbac: "", drinks: "" }))
        }
    }

    // The clearDrinks method clears buzzes from device storage, sets this.state.buzzes to an empty array, and bac to 0.0
    // This method is only called programatically from the copilot walkthrough intro, users cannot clear all drinks 
    async clearDrinks() {
        Vibration.vibrate();
        clearInterval(this.state.flashtimer);
        await AsyncStorage.removeItem(key, () => { this.setState({ buzzes: [], bac: 0.0, flashtext: false, flashtimer: "", flashtext: "" }) });
    }

    // The undoLastDrink method calculates the time elapsed for the last drink added, if less than 2 minutes have passed
    // the last drink is popped (removed) from the buzzes device storage array.  The new array is written to state and 
    // device storage.  After the checkBac function is called to recheck the new bac value.    
    async undoLastDrink() {
        if (Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated) < 0.0333333) {
            Vibration.vibrate();
            var undobuzz;
            await AsyncStorage.getItem(key, (error, result) => {
                if (result !== null) { undobuzz = JSON.parse(result); undobuzz.pop(); this.setState({ buzzes: undobuzz }) }
            })
            await AsyncStorage.setItem(key, JSON.stringify(undobuzz), () => { this.checkBac() })
        }
    }

    // the checkLastDrink function is used to determine if the last drink in the buzz array was added less than two minutes ago.
    // Returns true if less than 2 mins, false if more than 2 mins.  This boolean is used to conditionally display the undo button.
    checkLastDrink() {
        if (Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated) < 0.0333333) { return true }
        else { return false }
    }

    cancelAlert(typealert) {
        Vibration.vibrate();
        Alert.alert('Are you sure you want to start drinking now?', typealert === "hh" ? 'Maybe you should hold off.' :
            typealert === "sl" ? 'Consider waiting it out.' : typealert === "br" ? 'Think about sticking to your break.' : 'Consider keeping up your streak.',
            [{ text: 'Yes', onPress: () => typealert === "hh" ? this.stopModeration("hh") : typealert === "sl" ? this.stopModeration("sl") : typealert === "br" ? this.stopModeration("break") : this.stopModeration("ib") }, { text: 'No' }],
            { cancelable: false },
        );
    }

    async stopModeration(stoptype) {
        Vibration.vibrate();
        this.setState(stoptype === "break" ? { break: false } : stoptype === "hh" ? { happyhour: false, happyhourtime: "" } :
            stoptype === "sl" ? { showlimit: false, limit: false, limitbac: "", drinks: "" } : { indefbreak: false })
        if (stoptype === "break") { await AsyncStorage.removeItem(breakdatekey) }
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet(stoptype === "break" ? [[breakkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)],
        [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
            stoptype === "hh" ? [[happyhourkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
                stoptype === "sl" ? [[limitkey, JSON.stringify(false)], [showlimitkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] : [[indefbreakkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1]
        return (
            <View>
                {/* The first Modal (yellow warning) is triggered when the users bac is greater than 0.08 but less than 0.10 */}
                <Modal animationType="slide" transparent={false} visible={this.state.modal1}>
                    <ScrollView style={styles.modal1Card}>
                        {warnText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.warnOkButton} onPress={() => { this.handleModal("modal1") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {/* The second modal (red danger) is triggered when the users bac is above 0.10 */}
                <Modal animationType="slide" transparent={false} visible={this.state.modal2}>
                    <ScrollView style={styles.modal2Card}>
                        {dangerText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.dangerOkButton} onPress={() => { this.handleModal("modal2") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {/* When this.state.focus is true, componentDidMount triggers so the screen has a fresh copy of data to render.
                Before adding this conditional, this was triggering the function a second time making duplicated entries in the 
                device storage.  It now triggers once on initial app startup and once each time when navigating to the HomeScreen */}
                {this.state.focus === true && <NavigationEvents onWillFocus={() => this.componentDidMount()} />}
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <CopilotStep text="This gauge displays your current BAC.  The tick marks show the optimal buzz range.  Check the readout for your current BAC." order={1} name="gauge">
                            <CopilotView style={{ alignSelf: "center" }}>
                                {this.state.bac > 0.06 ? <Text style={{ fontWeight: "bold", textAlign: "center", color: this.state.flashwarning }}>WARNING              STOP              DRINKING</Text>
                                    : <Text style={{ fontWeight: "bold", textAlign: "center", color: "#00bfa5" }}>|                          |</Text>}
                                <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                                {(this.state.bac === 0 || this.state.bac === undefined) &&
                                    <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></View>}
                                {/* This conditional and all the ones below render the BAC readout based on the current calculated BAC level.
                        Emojis, different background colors, and text colors are also rendered based on the current bac. */}
                                {this.state.bac > 0.00 && (this.state.bac > 0.04 && this.state.bac < 0.06 ?
                                    <View style={styles.spaceAroundView}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                                        <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                            <Text style={{ fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>
                                    : <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View>)}
                            </CopilotView>
                        </CopilotStep>
                    </View>
                    {/* This conditional checks to see if there is an active break or if its happy hour or if users bac is above 0.10 or if cutoff is true, if so this entire drink action view is hidden and the break
                    card view is show instead. */}
                    {this.state.indefbreak === false && (this.state.break === "" || this.state.break === false) && this.state.happyhourtime === "" && this.state.bac < 0.10 && this.state.showlimit === false &&
                        <CopilotStep text="Press to each to change drink type, abv, and ounces." order={2} name="drink">
                            {/* To programatically show the changing of the abv in the copilot intro walkthrough, all multiswitch 
                                                        versions for beer have to be shown with the selected beer abv */}
                            <CopilotView>
                                <View style={styles.cardView}>
                                    <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                        {/* Based on this.state.alctype, a different multiswitch is rendered with the selected default alctype selected */}
                                        <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.alcswitch = ref }}
                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                            onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }} active={0}>
                                            <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                            <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                            <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                        </MultiSwitch>
                                        {/* Conditionally renders the undo button if the last drink added is less than 2 minutes old */}
                                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                            <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.undoLastDrink()}>
                                                <View>
                                                    <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                                </View>
                                            </TouchableOpacity>}
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                            <View style={{ paddingBottom: 15 }}>
                                                <View style={styles.multiSwitchViews}>
                                                    {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                                    {this.state.alctype === "Beer" &&
                                                        <MultiSwitch choiceSize={abvSize} activeItemStyle={beerActive} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.abvswitch = ref }}
                                                            containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={1}>
                                                            <Text style={{ fontSize: abvText }}>4%</Text>
                                                            <Text style={{ fontSize: abvText }}>5%</Text>
                                                            <Text style={{ fontSize: abvText }}>6%</Text>
                                                            <Text style={{ fontSize: abvText }}>7%</Text>
                                                            <Text style={{ fontSize: abvText }}>8%</Text>
                                                        </MultiSwitch>}
                                                </View>
                                                <View style={styles.multiSwitchViews}>
                                                    {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                                    {this.state.alctype !== "Beer" &&
                                                        <MultiSwitch choiceSize={abvWineSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={1}>
                                                            <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "11%" : "30%"}</Text>
                                                            <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "12%" : "40%"}</Text>
                                                            <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "13%" : "50%"}</Text>
                                                        </MultiSwitch>}
                                                </View>
                                            </View>
                                            <View style={styles.multiSwitchViews}>
                                                {/* Based on this.state.oz, a different multiswitch is rendered with the selected ounce size */}
                                                <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }} active={0}>
                                                    <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "12oz" : this.state.alctype === "Wine" ? "5oz" : "1.5oz"}</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "16oz" : this.state.alctype === "Wine" ? "8oz" : "3oz"}</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "20oz" : this.state.alctype === "Wine" ? "12oz" : "6oz"}</Text>
                                                </MultiSwitch>
                                            </View>
                                        </View>
                                        <CopilotStep text="Press to add drink with selected options." order={3} name="add">
                                            <CopilotView>
                                                {/* Add drink button with alcohol type icons shown for selected type, tiggers addDrink function and adds selected drink type,
                                drink ounces, and drink abv to the buzz array */}
                                                <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                                    <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text></TouchableOpacity>
                                            </CopilotView>
                                        </CopilotStep>
                                    </View>
                                </View></CopilotView>
                        </CopilotStep>}
                    {/* If the user is on a break, this card view is shown instead of the drink action card.  It displays the current calculated 
                        remaining break time and a cancel break button.  If the cancel break button is pressed, the break is cleared (from state and 
                        device storage) and the drink action card will be rendered.*/}
                    {this.state.break === true && <View style={styles.cardView}>
                        <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                        {this.state.autobreak === true ?
                            <Text style={styles.breakDateText}>{moment(this.state.breakdate).format('ddd MMM Do YYYY')}, 5:00 pm</Text> :
                            <Text style={styles.breakDateText}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text>}
                        <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}> Keep up the good work!</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("br")}>
                            <Text style={styles.buttonText}>Cancel Break</Text>
                        </TouchableOpacity>
                    </View>}
                    {(this.state.break === "" || this.state.break === false) && this.state.happyhour === true && this.state.happyhourtime !== "" &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>Happy Hour at {this.state.hhhour === 16 ? "4pm" : this.state.hhhour === 17 ? "5pm" : this.state.hhhour === 18 ? "6pm" : this.state.hhhour === 19 ? "7pm" : "8pm"}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("hh")}>
                                <Text style={styles.buttonText}>Cancel Happy Hour</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.indefbreak === true && (this.state.break === "" || this.state.break === false) && this.state.happyhour === false && this.state.happyhourtime === "" &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5 }}>You are taking an indefinite break.</Text>
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5 }}>It's been: <Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink. Keep up the good work!</Text>}
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("ib")}>
                                <Text style={styles.buttonText}>Cancel Break</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.bac > 0.10 && <View style={styles.cardView}>
                        {abovePoint10}
                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.undoLastDrink()}>
                                    <View>
                                        <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>}
                    </View>}
                    {this.state.showlimit === true && <View style={styles.cardView}>
                        <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You have reached your {this.state.bac > this.state.limitbac && "BAC limit"}{this.state.bac > this.state.limitbac && this.state.buzzes.length >= this.state.drinks && " and "}{this.state.buzzes.length >= this.state.drinks && "set drink limit"}. Until your BAC is 0.0, stop drinking and have some water.</Text>
                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true ?
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => { this.undoLastDrink(), this.setState({ showlimit: false }) }}>
                                    <View>
                                        <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("sl")}>
                                <Text style={styles.buttonText}>Cancel Set Limit</Text>
                            </TouchableOpacity>}
                    </View>}

                </ScrollView>
            </View>
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);
