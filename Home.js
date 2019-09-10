// imports to be used within the HomeScreen
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Alert,
    Modal,
    Platform
} from 'react-native';
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
    gaugeLabels, warnText, dangerText, autobreakthresholdkey, cutoffbackey, cutoffkey, drinkskey, cancelbreakskey,
    showcutoffkey, abovePoint10, custombreakkey, hhhourkey
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
            name: "",
            gender: "",
            weight: "",
            bac: 0.0,
            buzzes: [],
            oldbuzzes: [],
            alctype: "Beer",
            oz: 12,
            abv: 0.05,
            countdown: false,
            timer: "",
            break: "",
            breakdate: "",
            autobreak: "",
            focus: false,
            modal1: false,
            modal2: false,
            flashwarning: "#AE0000",
            flashtext: "",
            flashtimer: "",
            happyhour: "",
            happyhourtime: "",
            threshold: "",
            cutoff: "",
            cutoffbac: "",
            drinks: "",
            showcutoff: false,
            hhhour: ""
        }
    };

    // componentDidMount runs when HomeScreen completes loading 
    // This function/method is also run when navigating to the HomeScreen
    async componentDidMount() {
        var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, cancelbreakskey, cutoffbackey, cutoffkey, drinkskey,
            happyhourkey, autobreakthresholdkey, namekey, genderkey, weightkey, hhhourkey])
        this.setState({
            autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), cancelbreaks: JSON.parse(values[2][1]),
            cutoffbac: JSON.parse(values[3][1]), cutoff: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
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
                    var date1 = Date.parse(this.state.breakdate)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = Functions.getDayHourMin(date2, date1);
                    var days = dayHourMin[0], hours = dayHourMin[1], minutes = dayHourMin[2], seconds = dayHourMin[3];
                    if (days + hours + minutes + seconds < 0) {
                        if (this.state.autobreak === true) {
                            var stopBreak5pm = moment(new Date()).local().hours()
                            if (stopBreak5pm >= 17) {
                                this.stopBreak("break")
                            }
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
            result !== null && result !== "[]" ? this.setState({ oldbuzzes: JSON.parse(result) }, () => this.checkBac()) :
                this.setState({ oldbuzzes: [] }, () => this.checkBac())
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
        setTimeout(() => {
            this.setState({ focus: true }, () => this.checkBac())
        }, 1050);
        if (this.state.happyhour === true) {
            var happyHour = moment(new Date()).local().hours()
            happyHour < this.state.hhhour ? this.setState({ happyhourtime: happyHour }) : this.setState({ happyhourtime: "" })
        } else if (this.state.happyhour === false) { this.setState({ happyhourtime: "" }) }
    }

    // componentWillUnmount runs when the HomeScreen is navigated away from
    // copilot events are turned off to prevent errors, the current timer (used to auto calculate the bac) is stopped
    componentWillUnmount() {
        this.props.copilotEvents.off('stop');
        clearInterval(this.state.timer)
        clearInterval(this.state.flashtimer)
    }

    handleModal(number) {
        Vibration.vibrate();
        this.setState({ [number]: !this.state[number] });
    }

    // handleStepChange defines the copilot steps (intro walkthrough), what happens when each step/order is triggered
    // This method programatically demos the app for the users when they initially login
    handleStepChange = (step) => {
        // Adds and clears drinks every second
        if (step.order === 1 || step.order === 2 || step.order === 3 || step.order === 7) {
            var timerAdd = setInterval(() => this.addDrink(), 1000);
            setTimeout(() => { clearInterval(timerAdd) }, 2100);
            if (step.order === 1 || step.order === 2 || step.order === 3) {
                setTimeout(() => { this.clearDrinks() }, 3000);
            }
        }
        // Runs through the different alcohol types every second
        if (step.order === 4) {
            setTimeout(() => { this.setState({ alctype: "Wine" }) }, 1000);
            setTimeout(() => { this.setState({ alctype: "Liquor" }) }, 2000);
            setTimeout(() => { this.setState({ alctype: "Beer" }) }, 3000);
        }
        // Selects the different ABV values every second
        if (step.order === 5) {
            setTimeout(() => { this.setState({ abv: 0.08 }) }, 1000);
            setTimeout(() => { this.setState({ abv: 0.04 }) }, 2000);
            setTimeout(() => { this.setState({ abv: 0.05 }) }, 3000);
        }
        // Selects the different ounce size values every second
        if (step.order === 6) {
            setTimeout(() => { this.setState({ oz: 16 }) }, 1000);
            setTimeout(() => { this.setState({ oz: 20 }) }, 2000);
            setTimeout(() => { this.setState({ oz: 12 }) }, 3000);
        }
        // Demos the undo button, clears all drinks
        if (step.order === 8) {
            setTimeout(() => { this.undoLastDrink() }, 1000);
            setTimeout(() => { this.clearDrinks() }, 2000);
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
            if (this.state.bac > 0.04 && this.state.bac < 0.06) {
                AlertHelper.show("success", "Optimal Buzz!", "You are in the Optimal Buzz Zone! Please drink some water.");
            }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) {
                AlertHelper.show("warn", "Slow Down", "You might want to take a break or drink some water.");
            }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) {
                AlertHelper.show("error", "Drunk", "Please drink some water or take a break from drinking.");
            }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { this.handleModal("modal1") }
            if (this.state.bac > 0.10) { this.handleModal("modal2") }
        }, 200);
    }

    // saveBuzz writes the current state of buzzes to device storage (asyncstorage)  
    async saveBuzz() {
        await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
        if (this.state.bac > this.state.threshold) { await AsyncStorage.setItem(autobreakminkey, JSON.stringify(true)) }
        if (this.state.cutoff === true) {
            if (this.state.bac > this.state.cutoffbac || this.state.buzzes.length >= this.state.drinks) {
                this.setState({ showcutoff: true })
                await AsyncStorage.setItem(showcutoffkey, JSON.stringify(true))
            }
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
            this.setState({ timer: bacTimer })
        } else if (this.state.countdown === false) {
            clearInterval(this.state.timer)
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
            if (result !== null && result !== "[]") {
                setTimeout(() => { this.setState({ oldbuzzes: JSON.parse(result) }) }, 200);
            }
        })
        if (this.state.autobreak === true && autobreakcheck === true) {
            var autoBreakDate = new Date();
            autoBreakDate.setDate(autoBreakDate.getDate() + 1);
            autoBreakDate.setHours(autoBreakDate.getHours() + Math.round(autoBreakDate.getMinutes() / 60))
            autoBreakDate.setMinutes(0, 0, 0)
            this.setState({ break: true, breakdate: autoBreakDate })
            await AsyncStorage.multiSet([[breakkey, JSON.stringify(true)], [breakdatekey, JSON.stringify(autoBreakDate)],
            [autobreakminkey, JSON.stringify(false)]], () => this.componentDidMount())
        }
        if (this.state.showcutoff === true) {
            this.setState({ showcutoff: false, cutoff: false, cutoffbac: "", drinks: "" })
            await AsyncStorage.multiSet([[cutoffkey, JSON.stringify(false)], [showcutoffkey, JSON.stringify(false)]])
        }
    }

    // The clearDrinks method clears buzzes from device storage, sets this.state.buzzes to an empty array, and bac to 0.0
    // This method is only called programatically from the copilot walkthrough intro, users cannot clear all drinks 
    async clearDrinks() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(key, () => { this.setState({ buzzes: [], bac: 0.0 }) })
        clearInterval(this.state.flashtimer)
        this.setState({ flashtext: false, flashtimer: "", flashtext: "" })
    }

    // The undoLastDrink method calculates the time elapsed for the last drink added, if less than 2 minutes have passed
    // the last drink is popped (removed) from the buzzes device storage array.  The new array is written to state and 
    // device storage.  After the checkBac function is called to recheck the new bac value.    
    async undoLastDrink() {
        var lastDrinkTime = Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated), undobuzz;
        if (lastDrinkTime < 0.0333333) {
            Vibration.vibrate();
            await AsyncStorage.getItem(key, (error, result) => {
                if (result !== null) { undobuzz = JSON.parse(result), undobuzz.pop(), this.setState({ buzzes: undobuzz }) }
            })
            await AsyncStorage.setItem(key, JSON.stringify(undobuzz), () => { this.checkBac() })
        }
    }

    // the checkLastDrink function is used to determine if the last drink in the buzz array was added less than two minutes ago.
    // Returns true if less than 2 mins, false if more than 2 mins.  This boolean is used to conditionally display the undo button.
    checkLastDrink() {
        var lastDrinkTime = Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) { return true }
        else { return false }
    }

    cancelAlert(typealert) {
        Vibration.vibrate();
        Alert.alert('Are you sure?', typealert === "hh" ? 'Click Yes to cancel Happy Hour, No to continue Happy Hour' :
            typealert === "co" ? 'Click Yes to cancel Cut Off, No to continue Cut Off' : 'Click Yes to cancel break, No to continue break',
            [
                { text: 'Yes', onPress: () => typealert === "hh" ? this.stopModeration("hh") : typealert === "co" ? this.stopModeration("co") : this.stopModeration("break") },
                { text: 'No' },
            ],
            { cancelable: false },
        );
    }

    async stopModeration(stoptype) {
        Vibration.vibrate();
        this.setState(stoptype === "break" ? { break: false } : stoptype === "hh" ? { happyhour: false, happyhourtime: "" } :
            { showcutoff: false, cutoff: false, cutoffbac: "", drinks: "" })
        if (stoptype === "break") { await AsyncStorage.removeItem(breakdatekey) }
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet(stoptype === "break" ? [[breakkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)],
        [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
            stoptype === "hh" ? [[happyhourkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
                [[cutoffkey, JSON.stringify(false)], [showcutoffkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1]
        return (
            <View>
                {/* The first Modal (yellow warning) is triggered when the users bac is greater than 0.08 but less than 0.10 */}
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal1}>
                    <ScrollView style={{ backgroundColor: "#ffff8d", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        {warnText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.warnOkButton}
                                onPress={() => { this.handleModal("modal1") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {/* The second modal (red danger) is triggered when the users bac is above 0.10 */}
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal2}>
                    <ScrollView style={{ backgroundColor: "#ff5252", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        {dangerText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.dangerOkButton}
                                onPress={() => { this.handleModal("modal2") }}>
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
                        {/* All CopilotStep and CopilotView tags are part of the initial walkthrough, the order based on the number.*/}
                        <CopilotStep text="These tick marks show the optimal buzz range." order={3} name="ticks">
                            <CopilotView>
                                {this.state.bac > 0.06 ?
                                    <Text style={{ fontWeight: "bold", textAlign: "center", color: this.state.flashwarning }}>WARNING              STOP              DRINKING</Text>
                                    :
                                    <Text style={{ fontWeight: "bold", textAlign: "center", color: "#00bfa5" }}>|                          |</Text>}
                            </CopilotView>
                        </CopilotStep>
                        <CopilotStep text="This gauge displays your BAC." order={1} name="gauge">
                            <CopilotView style={{ alignSelf: "center" }}>
                                <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                            </CopilotView>
                        </CopilotStep>
                        {/* This conditional and all the ones below render the BAC readout based on the current calculated BAC level.
                        Emojis, different background colors, and text colors are also rendered based on the current bac. */}
                        {(this.state.bac === 0 || this.state.bac === undefined) && (
                            <CopilotStep text="This readout automatically calculates your current BAC." order={2} name="bac">
                                <CopilotView>
                                    <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></View>
                                </CopilotView>
                            </CopilotStep>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😊" : "🙂"}</Text></View>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "☺️" : "😊"}</Text></View>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😀" : "☺️"}</Text></View>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😃</Text></View>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😄</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😆</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😝</Text></View>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😜</Text></View>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😋" : "🤪"}</Text></View>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😅" : "🥴"}</Text></View>)}
                        {this.state.bac >= 0.10 && (
                            <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😵" : "🤮"}</Text></View>)}
                    </View>
                    {/* This conditional checks to see if there is an active break or if its happy hour or if users bac is above 0.10 or if cutoff is true, if so this entire drink action view is hidden and the break
                    card view is show instead. */}
                    {(this.state.break === "" || this.state.break === false) && this.state.happyhourtime === "" && this.state.bac < 0.10 && this.state.showcutoff === false &&
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                {/* Based on this.state.alctype, a different multiswitch is rendered with the selected default alctype selected */}
                                {this.state.alctype === "Beer" &&
                                    <CopilotStep text="Press each icon to change drink type." order={4} name="drink">
                                        <CopilotView>
                                            <MultiSwitch choiceSize={alcTypeSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
                                                active={0}>
                                                <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                                <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                                <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                            </MultiSwitch>
                                        </CopilotView>
                                    </CopilotStep>}
                                {/* Based on this.state.alctype, a different multiswitch is rendered with the selected default alctype selected */}
                                {this.state.alctype === "Wine" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
                                        active={1}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                {/* Based on this.state.alctype, a different multiswitch is rendered with the selected default alctype selected */}
                                {this.state.alctype === "Liquor" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
                                        active={2}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                <CopilotStep text="Press to undo last drink." order={8} name="clear">
                                    <CopilotView>
                                        {/* Conditionally renders the undo button if the last drink added is less than 2 minutes old */}
                                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                            <TouchableOpacity
                                                style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                                onPress={() => this.undoLastDrink()}>
                                                <View>
                                                    <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                                </View>
                                            </TouchableOpacity>}
                                    </CopilotView>
                                </CopilotStep>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                    <View style={{ paddingBottom: 15 }}>
                                        <View style={styles.multiSwitchViews}>
                                            {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                            {this.state.alctype === "Beer" &&
                                                <CopilotStep text="Press each percent to change drink ABV." order={5} name="abv">
                                                    <CopilotView>
                                                        {/* To programatically show the changing of the abv in the copilot intro walkthrough, all multiswitch 
                                                        versions for beer have to be shown with the selected beer abv */}
                                                        {this.state.abv === 0.05 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                                active={1}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                                        {this.state.abv === 0.06 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                                active={2}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                                        {this.state.abv === 0.07 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                                active={3}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                                        {this.state.abv === 0.08 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                                active={4}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                                        {this.state.abv === 0.04 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                                active={0}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                    </CopilotView>
                                                </CopilotStep>}
                                        </View>
                                        <View style={styles.multiSwitchViews}>
                                            {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                            {this.state.alctype === "Wine" &&
                                                <MultiSwitch choiceSize={abvWineSize}
                                                    activeItemStyle={activeStyle}
                                                    layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                    active={1}>
                                                    <Text style={{ fontSize: abvWineText }}>11%</Text>
                                                    <Text style={{ fontSize: abvWineText }}>12%</Text>
                                                    <Text style={{ fontSize: abvWineText }}>13%</Text>
                                                </MultiSwitch>}
                                        </View>
                                        <View style={styles.multiSwitchViews}>
                                            {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                            {this.state.alctype === "Liquor" &&
                                                <MultiSwitch choiceSize={abvLiquorSize}
                                                    activeItemStyle={activeStyle}
                                                    layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                    active={1}>
                                                    <Text style={{ fontSize: abvLiquorText }}>30%</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>40%</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>50%</Text>
                                                </MultiSwitch>}
                                        </View>
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {/* To programatically show the changing of the ounce size in the copilot intro walkthrough, all multiswitch 
                                        versions for beer have to be shown with the selected beer oz */}
                                        {this.state.alctype === "Beer" &&
                                            <CopilotStep text="Press each number to change drink size." order={6} name="oz">
                                                <CopilotView>
                                                    {/* Based on this.state.oz, a different multiswitch is rendered with the selected ounce size */}
                                                    {this.state.oz === 12 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                            active={0}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                    {/* Based on this.state.oz, a different multiswitch is rendered with the selected ounce size */}
                                                    {this.state.oz === 16 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                            active={1}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                    {/* Based on this.state.oz, a different multiswitch is rendered with the selected ounce size */}
                                                    {this.state.oz === 20 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                            active={2}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                </CopilotView>
                                            </CopilotStep>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {/* Based on this.state.oz, a different multiswitch is rendered with the selected ounce size */}
                                        {this.state.alctype === "Wine" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>5oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>8oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {/* Based on this.state.oz, a different multiswitch is rendered with the selected ounce size */}
                                        {this.state.alctype === "Liquor" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>1.5oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>3oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>6oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                </View>
                                {/* Add drink button with alcohol type icons shown for selected type, tiggers addDrink function and adds selected drink type,
                                drink ounces, and drink abv to the buzz array */}
                                {this.state.alctype === "Beer" &&
                                    <CopilotStep text="Press to add drink with selected options." order={7} name="add">
                                        <CopilotView>
                                            <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                                <Text style={{ fontSize: addButtonText, color: "white" }}>+🍺</Text></TouchableOpacity>
                                        </CopilotView>
                                    </CopilotStep>}
                                {/* Add drink button with alcohol type icons shown for selected type , tiggers addDrink function and adds selected drink type,
                                drink ounces, and drink abv to the buzz array */}
                                {this.state.alctype === "Wine" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>+🍷</Text></TouchableOpacity>}
                                {this.state.alctype === "Liquor" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>{Platform.OS === 'android' && Platform.Version < 24 ? "+🍸" : "+🥃"}</Text></TouchableOpacity>}
                            </View>
                        </View>}
                    {/* If the user is on a break, this card view is shown instead of the drink action card.  It displays the current calculated 
                        remaining break time and a cancel break button.  If the cancel break button is pressed, the break is cleared (from state and 
                        device storage) and the drink action card will be rendered.*/}
                    {this.state.break === true &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                            {this.state.autobreak === true ?
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY')}, 5:00 pm</Text> :
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text>}
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
                    {this.state.bac > 0.10 &&
                        <View style={styles.cardView}>
                            {abovePoint10}
                            {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity
                                        style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                        onPress={() => this.undoLastDrink()}>
                                        <View>
                                            <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                        </View>}
                    {this.state.showcutoff === true &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You have been cut off. You have had too many drinks or your BAC is too high. Until then, stop drinking and have some water.</Text>
                            {this.state.buzzes.length >= 1 && this.checkLastDrink() === true ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity
                                        style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                        onPress={() => { this.undoLastDrink(), this.setState({ showcutoff: false }) }}>
                                        <View>
                                            <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> : <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("co")}>
                                    <Text style={styles.buttonText}>Cancel Cut Off</Text>
                                </TouchableOpacity>}
                        </View>}
                </ScrollView>
            </View>
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);
