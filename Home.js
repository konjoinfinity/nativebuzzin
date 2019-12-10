import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Modal, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { AlertHelper } from './AlertHelper';
import { NavigationEvents } from "react-navigation";
import RNSpeedometer from 'react-native-speedometer'
import moment from "moment";
import { Functions } from "./Functions";
import styles from "./Styles"
import CountDown from 'react-native-countdown-component';
import ReactNativeHaptic from 'react-native-haptic';
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText,
    abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, namekey,
    genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakminkey,
    gaugeLabels, warnText, dangerText, autobreakthresholdkey, limitbackey, limitkey, drinkskey, cancelbreakskey,
    showlimitkey, abovePoint10, custombreakkey, hhhourkey, indefbreakkey, loginButtonText, limitdatekey, pacerkey,
    pacertimekey, shotsStyle, loginTitle, lastcallkey, limithourkey, maxreckey, warnTitleButton, warnBody, warningkey
} from "./Variables";

const CopilotView = walkthroughable(View);

var maxRecValues;
(async () => { maxRecValues = await Functions.maxRecDrinks() })();

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "", weight: "", bac: 0.0, buzzes: [], oldbuzzes: [], alctype: "Beer", oz: 12, abv: 0.05, countdown: false,
            timer: "", break: "", breakdate: "", autobreak: "", focus: false, modal1: false, modal2: false, flashwarning: "#AE0000",
            flashtext: "", flashtimer: "", happyhour: "", happyhourtime: "", threshold: "", limit: "", limitbac: "", drinks: "",
            showlimit: false, hhhour: "", indefbreak: false, timesince: null, limitdate: "", pacer: "", pacertime: "", showpacer: false,
            selectedBuzz: "", buzzmodal: false, buzzduration: 30, lastcall: "", showlastcall: false, limithour: "", maxrec: "", warn: "",
            metric: "oz"
        }
    };

    async componentDidMount() {
        var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, indefbreakkey, limitbackey, limitkey, drinkskey, happyhourkey,
            autobreakthresholdkey, namekey, genderkey, weightkey, hhhourkey, pacertimekey, lastcallkey, limithourkey, maxreckey, warningkey])
        this.setState({
            autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), indefbreak: JSON.parse(values[2][1]),
            limitbac: JSON.parse(values[3][1]), limit: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
            happyhour: JSON.parse(values[6][1]), threshold: JSON.parse(values[7][1]), name: JSON.parse(values[8][1]),
            gender: JSON.parse(values[9][1]), weight: JSON.parse(values[10][1]), hhhour: JSON.parse(values[11][1]),
            pacertime: JSON.parse(values[12][1]), lastcall: JSON.parse(values[13][1]), limithour: JSON.parse(values[14][1]),
            maxrec: JSON.parse(values[15][1]), warn: JSON.parse(values[16][1])
        })
        await AsyncStorage.getItem(breakkey, (error, result) => {
            if (result !== null) { this.setState({ break: JSON.parse(result) }) }
        })
        await AsyncStorage.getItem(pacerkey, (error, result) => {
            if (result === "true") {
                this.setState({ pacer: JSON.parse(result) })
            } else { this.setState({ pacer: JSON.parse(result), showpacer: false }) }
        })
        await AsyncStorage.getItem(limitdatekey, (error, result) => {
            if (result !== null) {
                this.setState({ limitdate: JSON.parse(result) })
                if (this.state.lastcall === true) { this.checkLastCall() }
            }
        })
        await AsyncStorage.getItem(breakdatekey, (error, result) => {
            if (result !== null) {
                this.setState({ breakdate: JSON.parse(result) })
                setTimeout(() => {
                    var breaktime = Functions.timeSince(this.state.breakdate, "break")
                    if (breaktime[0] + breaktime[1] + breaktime[2] + breaktime[3] < 0) {
                        if (this.state.autobreak === false) { this.stopBreak("break") }
                    }
                }, 100);
            }
        })
        await AsyncStorage.getItem(key, (error, result) => { result !== null && result !== "[]" ? this.setState({ buzzes: JSON.parse(result) }) : this.setState({ buzzes: [] }) })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) }, () => this.checkBac())
                setTimeout(() => {
                    var durations = Functions.timeSince(this.state.oldbuzzes[0][0].dateCreated, "timesince")
                    this.setState({ timesince: `${durations[0]} ${durations[0] === 1 ? "day" : "days"}, ${durations[1]} ${durations[1] === 1 ? "hour" : "hours"}, ${durations[2]} ${durations[2] === 1 ? "minute" : "minutes"}, and ${durations[3]} ${durations[3] === 1 ? "second" : "seconds"}` })
                    if (JSON.stringify(this.state.buzzes) === "[]") {
                        var warning = Functions.getDayHourMin(new Date(this.state.oldbuzzes[0][0].dateCreated), new Date)
                        if (warning[0] === 0) {
                            if (warning[3] >= 0 && warning[1] < 12) { (async () => { await AsyncStorage.setItem(warningkey, JSON.stringify(false)) })(); this.setState({ warn: false }) }
                        } else { (async () => { await AsyncStorage.setItem(warningkey, JSON.stringify(true)) })(); this.setState({ warn: true }) }
                    }
                }, 50);
            } else { this.setState({ oldbuzzes: [] }, () => this.checkBac()) }
        })
        const login = this.props.navigation.getParam('login');
        if (login === true) {
            this.props.copilotEvents.on('stepChange', this.handleStepChange);
            setTimeout(() => {
                this.props.start();
                this.props.navigation.setParams({ login: false });
            }, 100);
        }
        setTimeout(() => { this.setState({ focus: true }, () => this.checkBac()) }, 800);
        if (this.state.happyhour === true) {
            var happyHour = moment(new Date()).local().hours()
            happyHour < this.state.hhhour ? this.setState({ happyhourtime: happyHour }) : this.setState({ happyhourtime: "" })
        } else if (this.state.happyhour === false) { this.setState({ happyhourtime: "" }) }
        if (this.state.pacer === true && this.state.buzzes.length >= 1 && this.state.showpacer === false) {
            var drinkPacerTime = Functions.singleDuration(this.state.buzzes[0].dateCreated)
            drinkPacerTime = drinkPacerTime * 3600
            if (drinkPacerTime < this.state.pacertime) { this.setState({ pacertime: this.state.pacertime - drinkPacerTime }, () => this.setState({ showpacer: true })) }
        }
        maxRecValues = await Functions.maxRecDrinks()
    }

    componentWillUnmount() {
        this.props.copilotEvents.off('stop');
        clearInterval(this.state.timer);
        clearInterval(this.state.flashtimer);
    }

    handleModal(number) {
        ReactNativeHaptic.generate('selection')
        this.setState({ [number]: !this.state[number] });
    }

    handleStepChange = (step) => {
        if (step.order === 1 || step.order === 3) {
            setTimeout(() => { this.addDrink() }, 1000);
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
            setTimeout(() => { this.metricswitch.setActive(1); this.setState({ metric: "ml" }) }, 4500);
            setTimeout(() => { this.metricswitch.setActive(0); this.setState({ metric: "oz" }) }, 5000);
        }
    }

    async addDrink() {
        ReactNativeHaptic.generate('selection')
        var drinkDate = new Date();
        this.setState(prevState => ({ buzzes: [{ drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }, ...prevState.buzzes] }), () => this.checkBac())
        setTimeout(() => {
            this.saveBuzz();
            this.flashWarning();
            // check haptics
            if (this.state.bac > 0.04 && this.state.bac < 0.06) { ReactNativeHaptic.generate('notification'); AlertHelper.show("success", "Optimal Buzz", "You are in the Optimal Buzz Zone, drink water.") }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) { ReactNativeHaptic.generate('notificationSuccess'); AlertHelper.show("warn", "Slow Down", "Please take a break and drink some water.") }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) { ReactNativeHaptic.generate('notificationWarning'); AlertHelper.show("error", "Drunk", "Stop drinking and drink water.") }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { ReactNativeHaptic.generate('notificationError'); this.handleModal("modal1") }
            if (this.state.bac > 0.10) { ReactNativeHaptic.generate('notificationError'); this.handleModal("modal2") }
        }, 200);
    }

    async saveBuzz() {
        await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
        if (this.state.bac > this.state.threshold) { await AsyncStorage.setItem(autobreakminkey, JSON.stringify(true)) }
        if (this.state.limit === true) {
            if (this.state.bac > this.state.limitbac || this.state.buzzes.length >= this.state.drinks) {
                this.setState({ showlimit: true })
                await AsyncStorage.setItem(showlimitkey, JSON.stringify(true))
            }
        }
        if (this.state.pacer === true) { this.setState({ showpacer: true }) }
        maxRecValues = await Functions.maxRecDrinks()
    }

    async checkBac() {
        if (this.state.buzzes.length >= 1) {
            var duration = Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated)
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
                    var flashTimer = setInterval(() => { this.setState(this.state.flashwarning === "#00bfa5" ? { flashwarning: "#AE0000" } : { flashwarning: "#00bfa5" }) }, 800);
                    this.setState({ flashtimer: flashTimer })
                }
            }, 200);
        }
    }

    countdownBac() {
        let bacTimer;
        if (this.state.countdown === true) {
            bacTimer = setInterval(() => this.checkBac(), 800);
            this.setState({ timer: bacTimer });
        } else if (this.state.countdown === false) {
            clearInterval(this.state.timer);
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    async moveToOld() {
        var autobreakcheck, oldbuzzarray, newbuzzarray = this.state.buzzes;
        this.state.oldbuzzes.length !== 0 ? oldbuzzarray = this.state.oldbuzzes : oldbuzzarray = []
        await AsyncStorage.getItem(autobreakminkey, (error, result) => { autobreakcheck = JSON.parse(result) })
        if (oldbuzzarray.length !== 0) {
            if (new Date(Date.parse(oldbuzzarray[0][oldbuzzarray[0].length - 1].dateCreated)).getDate() === new Date(Date.parse(newbuzzarray[newbuzzarray.length - 1].dateCreated)).getDate() && new Date(Date.parse(oldbuzzarray[0][oldbuzzarray[0].length - 1].dateCreated)).getMonth() === new Date(Date.parse(newbuzzarray[newbuzzarray.length - 1].dateCreated)).getMonth()) {
                var combined = [].concat(newbuzzarray, oldbuzzarray[0]);
                oldbuzzarray.shift();
                oldbuzzarray.unshift(combined);
            } else {
                oldbuzzarray.unshift(newbuzzarray);
            }
        } else {
            oldbuzzarray.unshift(newbuzzarray);
        }
        await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzarray))
        await AsyncStorage.removeItem(key, () => { this.setState({ buzzes: [], bac: 0.0, oldbuzzes: [] }) })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") { setTimeout(() => { this.setState({ oldbuzzes: JSON.parse(result) }) }, 200) }
        })
        if (this.state.autobreak === true && autobreakcheck === true) {
            this.setState({ break: true })
            await AsyncStorage.multiSet([[breakkey, JSON.stringify(true)],
            [autobreakminkey, JSON.stringify(false)]], () => this.componentDidMount())
        }
        if (this.state.showlimit === true) {
            await AsyncStorage.multiSet([[limitkey, JSON.stringify(false)], [showlimitkey, JSON.stringify(false)]], () => this.setState({ showlimit: false, limit: false, limitbac: "", drinks: "" }))
        }
        if (this.state.pacer === true && this.state.showpacer === true) { this.setState({ showpacer: false }) }
        maxRecValues = await Functions.maxRecDrinks()
    }

    async clearDrinks() {
        ReactNativeHaptic.generate('selection')
        clearInterval(this.state.flashtimer);
        this.setState({ buzzes: [], bac: 0.0, flashtext: false, flashtimer: "", flashtext: "" })
        await AsyncStorage.removeItem(key);
    }

    async undoLastDrink() {
        if (Functions.singleDuration(this.state.buzzes[0].dateCreated) < 0.0333333) {
            ReactNativeHaptic.generate('selection')
            var undobuzz;
            await AsyncStorage.getItem(key, (error, result) => {
                if (result !== null) {
                    undobuzz = JSON.parse(result);
                    undobuzz.shift();
                    this.setState({ buzzes: undobuzz })
                }
            })
            await AsyncStorage.setItem(key, JSON.stringify(undobuzz), () => { this.checkBac() })
        }
        if (this.state.showlimit === true && this.state.bac < this.state.limitbac) { this.setState({ showlimit: false }) }
        maxRecValues = await Functions.maxRecDrinks()
    }

    checkLastDrink() {
        if (Functions.singleDuration(this.state.buzzes[0].dateCreated) < 0.0333333) { return true }
        else { return false }
    }

    cancelAlert(typealert) {
        ReactNativeHaptic.generate('notificationWarning');
        Alert.alert('Are you sure you want to start drinking now?', typealert === "hh" ? 'Maybe you should hold off.' :
            typealert === "sl" ? 'Consider waiting it out.' : typealert === "br" ? 'Think about sticking to your break.' :
                typealert === "ib" ? 'Consider keeping up your streak.' : typealert === "lc" ? "It's after last call, consider going home." :
                    "Drink pacer helps reduce drinking too quickly.",
            [{ text: 'Yes', onPress: () => typealert === "hh" ? this.stopModeration("hh") : typealert === "sl" ? this.stopModeration("sl") : typealert === "br" ? this.stopModeration("break") : typealert === "ib" ? this.stopModeration("ib") : typealert === "lc" ? this.stopModeration("lc") : this.stopModeration("pc") }, { text: 'No' }],
            { cancelable: false },
        );
    }

    async stopModeration(stoptype) {
        ReactNativeHaptic.generate('selection');
        this.setState(stoptype === "break" ? { break: false } : stoptype === "hh" ? { happyhour: false, happyhourtime: "" } :
            stoptype === "sl" ? { showlimit: false, limit: false, limitbac: "", drinks: "" } :
                stoptype === "ib" ? { indefbreak: false } : stoptype === "lc" ? { limitdate: "", showlastcall: false, lastcall: false } : { showpacer: false, pacer: false })
        if (stoptype === "break") { await AsyncStorage.removeItem(breakdatekey) }
        if (stoptype === "lc") { await AsyncStorage.removeItem(limitdatekey) }
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet(stoptype === "break" ? [[breakkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)],
        [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
            stoptype === "hh" ? [[happyhourkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
                stoptype === "sl" ? [[limitkey, JSON.stringify(false)], [showlimitkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] : stoptype === "ib" ? [[indefbreakkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] : stoptype === "lc" ? [[lastcallkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] : [[pacerkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    async checkLastCall() {
        var lastCall = Functions.getDayHourMin(new Date(this.state.limitdate), new Date)
        if (lastCall[3] < 0) { this.setState({ showlastcall: false }) }
        if (lastCall[3] >= 0 && lastCall[1] < 12) { this.setState({ showlastcall: true }) }
        if (lastCall[1] >= 12) {
            this.setState({ showlastcall: false })
            if (this.state.limithour !== 0) {
                var beforeMidnight = new Date().setHours(this.state.limithour, 0, 0, 0)
                await AsyncStorage.setItem(limitdatekey, JSON.stringify(beforeMidnight))
                this.setState({ limitdate: beforeMidnight })
            } else {
                var midnight = new Date()
                midnight.setDate(midnight.getDate() + 1)
                midnight.setHours(0, 0, 0, 0)
                await AsyncStorage.setItem(limitdatekey, JSON.stringify(midnight))
                this.setState({ limitdate: midnight })
            }
        }
    }

    buzzModal() {
        ReactNativeHaptic.generate('selection')
        this.setState({ buzzmodal: !this.state.buzzmodal, selectedBuzz: this.state.buzzes });
    }

    closeBuzzModal() {
        ReactNativeHaptic.generate('selection')
        this.setState({ buzzmodal: !this.state.buzzmodal, selectedBuzz: "" }, () => { setTimeout(() => { this.scrolltop.scrollTo({ y: 0, animated: true }) }, 750) })
    }

    buzzDuration(incdec) {
        ReactNativeHaptic.generate('selection')
        if (incdec === "up" && this.state.buzzduration >= 5 && this.state.buzzduration < 120) { this.setState({ buzzduration: this.state.buzzduration + 5 }) }
        else if (incdec === "down" && this.state.buzzduration > 5 && this.state.buzzduration <= 120) { this.setState({ buzzduration: this.state.buzzduration - 5 }) }
    }

    async deleteBuzz(buzz) {
        ReactNativeHaptic.generate('selection')
        var filtered = this.state.buzzes.filter(deleted => deleted !== buzz)
        await AsyncStorage.setItem(key, JSON.stringify(filtered), () => { this.setState({ buzzes: filtered, selectedBuzz: filtered }) })
    }

    async editBuzz() {
        ReactNativeHaptic.generate('selection')
        var delayTime = new Date();
        delayTime.setMinutes(delayTime.getMinutes() - this.state.buzzduration)
        var editbuzzes = this.state.buzzes
        editbuzzes.unshift({ drinkType: this.state.alctype, dateCreated: delayTime, oz: this.state.oz, abv: this.state.abv })
        editbuzzes.sort((a, b) => new Date(Date.parse(b.dateCreated)).getTime() - new Date(Date.parse(a.dateCreated)).getTime());
        await AsyncStorage.setItem(key, JSON.stringify(editbuzzes), () => { this.setState({ buzzes: editbuzzes, selectedBuzz: editbuzzes }) })
    }

    countDownFinished() {
        setTimeout(() => { this.setState({ showpacer: false }) }, 100)
        ReactNativeHaptic.generate('notificationSuccess')
    }

    showLastCall() {
        if (this.state.showlastcall === true) { return true }
        else { return false }
    }

    checkMaxRec() {
        if (this.state.maxrec === true) {
            if (maxRecValues[5] > maxRecValues[7] || maxRecValues[6] > maxRecValues[8] === true) { return true }
            else { return false }
        } else { return false }
    }

    async warnCardHandle() {
        ReactNativeHaptic.generate('selection')
        this.setState({ warn: false })
        await AsyncStorage.setItem(warningkey, JSON.stringify(false))
    }

    render() {
        // fix altype switch not updating from modal switch
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1]
        let buzzes, selectedbuzz;
        this.state.buzzes && this.state.buzzes.length !== 0 && (buzzes = this.state.buzzes.map((buzz, id) => {
            return (<View key={id}>
                {id === 0 && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}><Text style={{ color: "#000000", fontSize: 26, textAlign: "center", paddingRight: 45, paddingTop: 5 }}>Current Buzz</Text><TouchableOpacity style={[styles.dropShadow, styles.plusMinusButtons, { marginRight: 5 }]} onPress={() => this.buzzModal(buzz, id)}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>}
                <View style={styles.buzzMap}>
                    <View style={styles.buzzheaderButton}><Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#000000", fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ color: "#000000", fontSize: abvText - 2, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                </View></View>
            )
        }))
        this.state.selectedBuzz !== "" && (selectedbuzz = this.state.selectedBuzz.map((buzz, id) => {
            return (<View key={id}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <View style={styles.buzzheaderButton}><Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#000000", fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ color: "#000000", fontSize: abvText - 2, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    {this.state.selectedBuzz.length >= 2 && <TouchableOpacity style={styles.buzzheaderButton} onPress={() => this.deleteBuzz(buzz)}><Text style={styles.buttonText}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>}</View>
            </View>
            )
        }))
        return (
            <View>
                <Modal animationType="slide" transparent={false} visible={this.state.modal1}>
                    <ScrollView style={styles.modal1Card}>{warnText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.warnOkButton} onPress={() => { this.handleModal("modal1") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity></View></ScrollView></Modal>
                <Modal animationType="slide" transparent={false} visible={this.state.modal2}>
                    <ScrollView style={styles.modal2Card}>{dangerText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.dangerOkButton} onPress={() => { this.handleModal("modal2") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity></View></ScrollView></Modal>
                <Modal animationType="slide" transparent={false} visible={this.state.buzzmodal}>
                    <ScrollView>
                        <View style={[styles.cardView, { marginTop: 30 }]}>
                            <Text style={{ color: "#000000", textAlign: "center", fontSize: 20, fontWeight: "500", padding: 2 }}>Edit Current Buzz</Text>
                            {selectedbuzz}
                        </View>
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.modalalcswitch = ref }}
                                    containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                    onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value, this.state.metric)[0], oz: Functions.setAlcType(alcValues[number].value, this.state.metric)[1] }, () => { this.alcswitch.setActive(number) }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
                                    <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍺</Text>
                                    <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍷</Text>
                                    <Text style={{ color: "#000000", fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍹</Text>
                                </MultiSwitch>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                    <View style={{ paddingBottom: 15 }}>
                                        {this.state.alctype === "Beer" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvSize} activeItemStyle={beerActive} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.abvswitch = ref }}
                                                    containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={this.state.abv === 0.04 ? 0 : this.state.abv === 0.05 ? 1 : this.state.abv === 0.06 ? 2 : this.state.abv === 0.07 ? 3 : 4}>
                                                    <Text style={{ color: "#000000", fontSize: abvText }}>4%</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvText }}>5%</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvText }}>6%</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvText }}>7%</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvText }}>8%</Text>
                                                </MultiSwitch>
                                            </View>}
                                        {this.state.alctype !== "Beer" && this.state.alctype !== "Cocktail" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvWineSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={this.state.abv === 0.13 || this.state.abv === 0.5 ? 2 : this.state.abv === 0.12 || this.state.abv === 0.4 ? 1 : 0}>
                                                    <Text style={{ color: "#000000", fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "11%" : "30%"}</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "12%" : "40%"}</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "13%" : "50%"}</Text>
                                                </MultiSwitch>
                                            </View>}
                                        {this.state.alctype === "Cocktail" &&
                                            <View style={[styles.dropShadow2, styles.numberofshots, { backgroundColor: "#e0f2f1" }]}>
                                                <Text style={{ color: "#000000", fontSize: abvWineText }}>Number of Shots</Text>
                                            </View>}
                                    </View>
                                    {this.state.alctype !== "Cocktail" &&
                                        <View style={{ flexDirection: "row" }}>
                                            {this.state.metric === "oz" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype, this.state.metric) }) }} active={this.state.oz === 11.15 || this.state.oz === 5.91 || this.state.oz === 0.84 || this.state.oz === 12 || this.state.oz === 5 || this.state.oz === 1.5 ? 0 : this.state.oz === 25.36 || this.state.oz === 8.45 || this.state.oz === 1.18 || this.state.oz === 16 || this.state.oz === 8 || this.state.oz === 3 ? 1 : 2}>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "12" : this.state.alctype === "Wine" ? "5" : "1.5"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "16" : this.state.alctype === "Wine" ? "8" : "3"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "20" : this.state.alctype === "Wine" ? "12" : "6"}</Text>
                                                    </MultiSwitch>
                                                </View>}
                                            {this.state.metric === "ml" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.mlswitch = ref }}
                                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype, this.state.metric) }) }} active={this.state.oz === 11.15 || this.state.oz === 5.91 || this.state.oz === 0.84 || this.state.oz === 12 || this.state.oz === 5 || this.state.oz === 1.5 ? 0 : this.state.oz === 25.36 || this.state.oz === 8.45 || this.state.oz === 1.18 || this.state.oz === 16 || this.state.oz === 8 || this.state.oz === 3 ? 1 : 2}>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "330" : this.state.alctype === "Wine" ? "175" : "25"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "500" : this.state.alctype === "Wine" ? "250" : "35"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "750" : this.state.alctype === "Wine" ? "375" : "50"}</Text>
                                                    </MultiSwitch>
                                                </View>}
                                            <View style={[styles.multiSwitchViews, { paddingLeft: 10 }]}>
                                                <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.metricswitch = ref }}
                                                    containerStyles={_.times(2, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ metric: number === 0 ? "oz" : "ml", oz: Functions.setAlcType(this.state.alctype, number === 0 ? "oz" : "ml")[1] }) }} active={this.state.metric === "oz" ? 0 : 1}>
                                                    <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{"oz"}</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{"ml"}</Text>
                                                </MultiSwitch>
                                            </View>
                                        </View>}
                                    {this.state.alctype === "Cocktail" &&
                                        <View style={styles.multiSwitchViews}>
                                            <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype, this.state.metric) }) }} active={this.state.oz === 1.7 || this.state.oz === 1.5 ? 0 : this.state.oz === 3.4 || this.state.oz === 3 ? 1 : this.state.oz === 5.1 || this.state.oz === 4.5 ? 2 : 3}>
                                                <Text style={{ color: "#000000", fontSize: abvLiquorText }}>1</Text>
                                                <Text style={{ color: "#000000", fontSize: abvLiquorText }}>2</Text>
                                                <Text style={{ color: "#000000", fontSize: abvLiquorText }}>3</Text>
                                                <Text style={{ color: "#000000", fontSize: abvLiquorText }}>4</Text>
                                            </MultiSwitch>
                                        </View>}
                                </View>
                                <TouchableOpacity onPress={() => this.editBuzz()} style={addButtonSize === true ? [styles.dropShadow2, styles.smallAddButton] : [styles.dropShadow2, styles.addButton]}>
                                    <Text style={{ color: "#000000", fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                            </View>
                            <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 10 }}>How Long Ago?</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5, marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={[styles.dropShadow, styles.plusMinusButtons, this.state.buzzduration === 5 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.buzzDuration("down")}>
                                    <View><Text style={{ fontSize: 20, color: "#ffffff" }}>-</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.smallbac, styles.dropShadow2, { backgroundColor: "#e0f2f1" }]}>
                                    <View><Text style={{ color: "#000000", fontSize: abvText }}>{this.state.buzzduration} Minutes</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow, styles.plusMinusButtons, this.state.buzzduration === 120 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.buzzDuration("up")}>
                                    <View><Text style={{ fontSize: 20, color: "#ffffff" }}>+</Text></View></TouchableOpacity>
                            </View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton]} onPress={() => this.closeBuzzModal()}>
                                    <Text style={styles.buttonText}>Done</Text>
                                </TouchableOpacity></View>
                        </View>
                    </ScrollView>
                </Modal>
                {this.state.focus === true && <NavigationEvents onWillFocus={() => { ReactNativeHaptic.generate('impactLight'); this.componentDidMount() }} />}
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <CopilotStep accessibilityLabel="1ststep" text="This gauge and readout both display your current BAC.  The tick marks show the optimal buzz range." order={1} name="gauge">
                            <CopilotView accessibilityLabel="1ststepview" style={{ alignSelf: "center" }}>
                                {this.state.bac > 0.06 ? <Text style={{ color: "#000000", fontWeight: "bold", textAlign: "center", color: this.state.flashwarning }}>WARNING              STOP              DRINKING</Text>
                                    : maxRecValues[5] > maxRecValues[7] || maxRecValues[6] > maxRecValues[8] ? <Text style={{ color: "#000000", fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#000000", color: "#AE0000" }}>  CUT        </Text><Text style={{ color: "#000000", color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#000000", color: "#AE0000" }}>        BACK</Text></Text>
                                        : <Text style={{ color: "#000000", fontWeight: "bold", textAlign: "center", color: "#00bfa5" }}>|                          |</Text>}
                                <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                                {(this.state.bac === 0 || this.state.bac === undefined) &&
                                    <View style={[styles.dropShadow2, addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ color: "#000000", fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></View>}
                                {this.state.bac > 0.00 && (this.state.bac > 0.04 && this.state.bac < 0.06 ?
                                    <View style={styles.spaceAroundView}><Text style={{ color: "#000000", fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                                        <View style={[styles.dropShadow2, addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                            <Text style={{ color: "#000000", fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View><Text style={{ color: "#000000", fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>
                                    : <View style={[styles.dropShadow2, addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ color: "#000000", fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View>)}
                            </CopilotView>
                        </CopilotStep>
                    </View>
                    {this.state.indefbreak === false && (this.state.break === "" || this.state.break === false) && this.state.happyhourtime === "" && this.state.bac < 0.10 && this.state.showlimit === false && this.state.showpacer === false && this.state.showlastcall === false && this.checkMaxRec() === false && this.state.warn === false &&
                        <CopilotStep accessibilityLabel="2ndstep" text="Press to each to change drink type, abv, size, and metrics." order={2} name="drink">
                            <CopilotView accessibilityLabel="2ndstep"><View style={styles.cardView}>
                                <View style={[styles.multiSwitchViews, { paddingBottom: 13, flexDirection: "row", justifyContent: "space-between" }]}>
                                    <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.alcswitch = ref }}
                                        containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value, this.state.metric)[0], oz: Functions.setAlcType(alcValues[number].value, this.state.metric)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
                                        <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ color: "#000000", fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                        <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍹</Text>
                                    </MultiSwitch>
                                    {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                        <TouchableOpacity style={[styles.dropShadow3, addButtonSize === true ? styles.smallUndoButton : styles.undoButton]} onPress={() => this.undoLastDrink()}>
                                            <View><Text style={{ color: "#000000", fontSize: alcTypeText }}>↩️</Text></View></TouchableOpacity>}
                                </View>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 1, flexDirection: "column" }}>
                                        <View style={{ paddingBottom: 13 }}>
                                            {this.state.alctype === "Beer" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <MultiSwitch choiceSize={abvSize} activeItemStyle={beerActive} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.abvswitch = ref }}
                                                        containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={this.state.abv === 0.04 ? 0 : this.state.abv === 0.05 ? 1 : this.state.abv === 0.06 ? 2 : this.state.abv === 0.07 ? 3 : 4}>
                                                        <Text style={{ color: "#000000", fontSize: abvText }}>4%</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvText }}>5%</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvText }}>6%</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvText }}>7%</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvText }}>8%</Text>
                                                    </MultiSwitch>
                                                </View>}
                                            {this.state.alctype !== "Beer" && this.state.alctype !== "Cocktail" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <MultiSwitch choiceSize={abvWineSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }}
                                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={this.state.abv === 0.13 || this.state.abv === 0.5 ? 2 : this.state.abv === 0.12 || this.state.abv === 0.4 ? 1 : 0}>
                                                        <Text style={{ color: "#000000", fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "11%" : "30%"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "12%" : "40%"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "13%" : "50%"}</Text>
                                                    </MultiSwitch>
                                                </View>}
                                            {this.state.alctype === "Cocktail" &&
                                                <View style={[styles.dropShadow2, styles.numberofshots, { backgroundColor: "#e0f2f1" }]}>
                                                    <Text style={{ color: "#000000", fontSize: abvWineText }}>Number of Shots</Text>
                                                </View>}
                                        </View>
                                        {this.state.alctype !== "Cocktail" &&
                                            <View style={{ flexDirection: "row" }}>
                                                {this.state.metric === "oz" &&
                                                    <View style={styles.multiSwitchViews}>
                                                        <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype, this.state.metric) }) }} active={this.state.oz === 11.15 || this.state.oz === 5.91 || this.state.oz === 0.84 || this.state.oz === 12 || this.state.oz === 5 || this.state.oz === 1.5 ? 0 : this.state.oz === 25.36 || this.state.oz === 8.45 || this.state.oz === 1.18 || this.state.oz === 16 || this.state.oz === 8 || this.state.oz === 3 ? 1 : 2}>
                                                            <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "12" : this.state.alctype === "Wine" ? "5" : "1.5"}</Text>
                                                            <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "16" : this.state.alctype === "Wine" ? "8" : "3"}</Text>
                                                            <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "20" : this.state.alctype === "Wine" ? "12" : "6"}</Text>
                                                        </MultiSwitch>
                                                    </View>}
                                                {this.state.metric === "ml" &&
                                                    <View style={styles.multiSwitchViews}>
                                                        <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.mlswitch = ref }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype, this.state.metric) }) }} active={this.state.oz === 11.15 || this.state.oz === 5.91 || this.state.oz === 0.84 || this.state.oz === 12 || this.state.oz === 5 || this.state.oz === 1.5 ? 0 : this.state.oz === 25.36 || this.state.oz === 8.45 || this.state.oz === 1.18 || this.state.oz === 16 || this.state.oz === 8 || this.state.oz === 3 ? 1 : 2}>
                                                            <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "330" : this.state.alctype === "Wine" ? "175" : "25"}</Text>
                                                            <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "500" : this.state.alctype === "Wine" ? "250" : "35"}</Text>
                                                            <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "750" : this.state.alctype === "Wine" ? "375" : "50"}</Text>
                                                        </MultiSwitch>
                                                    </View>}
                                                <View style={[styles.multiSwitchViews, { paddingLeft: 10 }]}>
                                                    <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.metricswitch = ref }}
                                                        containerStyles={_.times(2, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ metric: number === 0 ? "oz" : "ml" }, () => { ReactNativeHaptic.generate('selection'); this.setState({ oz: Functions.setAlcType(this.state.alctype, this.state.metric)[1] }) }) }} active={this.state.metric === "oz" ? 0 : 1}>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{"oz"}</Text>
                                                        <Text style={{ color: "#000000", fontSize: abvLiquorText }}>{"ml"}</Text>
                                                    </MultiSwitch>
                                                </View>
                                            </View>}
                                        {this.state.alctype === "Cocktail" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                    containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype, this.state.metric) }) }} active={this.state.oz === 1.7 || this.state.oz === 1.5 ? 0 : this.state.oz === 3.4 || this.state.oz === 3 ? 1 : this.state.oz === 5.1 || this.state.oz === 4.5 ? 2 : 3}>
                                                    <Text style={{ color: "#000000", fontSize: abvLiquorText }}>1</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvLiquorText }}>2</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvLiquorText }}>3</Text>
                                                    <Text style={{ color: "#000000", fontSize: abvLiquorText }}>4</Text>
                                                </MultiSwitch>
                                            </View>}
                                    </View>
                                    <CopilotStep accessibilityLabel="3rdstep" text="Tap to add drinks with the selected options." order={3} name="add">
                                        <CopilotView accessibilityLabel="3rdstepview">
                                            <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? [styles.dropShadow2, styles.smallAddButton] : [styles.dropShadow2, styles.addButton]}>
                                                <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                                        </CopilotView>
                                    </CopilotStep>
                                </View>
                            </View></CopilotView>
                        </CopilotStep>}
                    {this.state.break === true && <View style={styles.cardView}>
                        {this.state.autobreak === true ?
                            <View><Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break. {this.state.timesince !== null && this.state.bac === 0 && "It's been:"}</Text>{this.state.timesince !== null && this.state.bac === 0 &&
                                <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 5 }}><Text style={{ color: "#000000", fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink.</Text>}</View> :
                            <View><Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                                <Text style={styles.breakDateText}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text></View>}
                        <TouchableOpacity style={[styles.dropShadow, styles.button]} onPress={() => this.cancelAlert("br")}>
                            <Text style={styles.buttonText}>Cancel Break</Text>
                        </TouchableOpacity>
                    </View>}
                    {this.state.indefbreak === false && (this.state.break === "" || this.state.break === false) && this.state.happyhour === true && this.state.happyhourtime !== "" &&
                        <View style={styles.cardView}>
                            <Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 15 }}>No drinks until:</Text>
                            <Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 15, fontWeight: "bold" }}>Happy Hour at {this.state.hhhour === 16 ? "4pm" : this.state.hhhour === 17 ? "5pm" : this.state.hhhour === 18 ? "6pm" : this.state.hhhour === 19 ? "7pm" : "8pm"}</Text>
                            <TouchableOpacity style={[styles.dropShadow, styles.button]} onPress={() => this.cancelAlert("hh")}>
                                <Text style={styles.buttonText}>Cancel Happy Hour</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.indefbreak === true &&
                        <View style={styles.cardView}>
                            <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 5 }}>You are taking a break. {this.state.timesince !== null && this.state.bac === 0 && "It's been:"}</Text>
                            {this.state.timesince !== null && this.state.bac === 0 &&
                                <Text style={{ color: "#000000", fontSize: loginButtonText, textAlign: "center", padding: 5 }}><Text style={{ color: "#000000", fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink. Keep up the good work!</Text>}
                            <TouchableOpacity style={[styles.dropShadow, styles.button]} onPress={() => this.cancelAlert("ib")}>
                                <Text style={styles.buttonText}>Cancel Break</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.bac > 0.10 && <View style={styles.cardView}>
                        {abovePoint10}
                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={[styles.dropShadow3, addButtonSize === true ? styles.smallUndoButton : styles.undoButton]} onPress={() => this.undoLastDrink()}>
                                    <View><Text style={{ color: "#000000", fontSize: alcTypeText }}>↩️</Text></View>
                                </TouchableOpacity>
                            </View>}
                    </View>}
                    {this.state.showlimit === true && (this.state.bac > this.state.limitbac || this.state.buzzes.length >= this.state.drinks) && this.state.bac < 0.10 && this.state.showpacer === false &&
                        <View style={styles.cardView}>
                            <Text style={{ color: "#000000", fontSize: 18, textAlign: "center", padding: 5 }}>You have reached your:</Text>
                            {this.state.bac > this.state.limitbac && <Text style={{ color: "#000000", fontSize: 20, textAlign: "center", padding: 2, fontWeight: "bold" }}>BAC Limit - {this.state.limitbac}</Text>}
                            {this.state.buzzes.length >= this.state.drinks && <Text style={{ color: "#000000", fontSize: 20, textAlign: "center", padding: 2, fontWeight: "bold" }}>{this.state.bac > this.state.limitbac && this.state.buzzes.length >= this.state.drinks && "& "} Set Drink Limit - {this.state.drinks}</Text>}
                            <Text style={{ color: "#000000", fontSize: 18, textAlign: "center", padding: 5 }}>Until your BAC reaches 0.0, stop drinking and have some water.</Text>
                            {this.state.buzzes.length >= 1 && this.checkLastDrink() === true ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={[styles.dropShadow3, addButtonSize === true ? styles.smallUndoButton : styles.undoButton]} onPress={() => { this.undoLastDrink(), this.setState({ showlimit: false }) }}>
                                        <View><Text style={{ color: "#000000", fontSize: alcTypeText }}>↩️</Text></View>
                                    </TouchableOpacity>
                                </View> : <TouchableOpacity style={[styles.dropShadow, styles.button]} onPress={() => this.cancelAlert("sl")}>
                                    <Text style={styles.buttonText}>Cancel Set Limit</Text>
                                </TouchableOpacity>}
                        </View>}
                    {this.state.lastcall === true && this.showLastCall() === true && this.state.bac < 0.10 && this.state.showpacer === false &&
                        <View style={styles.cardView}>
                            <Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 10 }}>It is now last call.</Text>
                            <Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 10 }}>Drink water and get home safely.</Text>
                            <TouchableOpacity style={[styles.dropShadow, styles.button]} onPress={() => this.cancelAlert("lc")}>
                                <Text style={styles.buttonText}>Cancel Last Call</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.buzzes.length >= 1 && this.state.showpacer === true && <View style={styles.cardView}>
                        <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 15 }}>Drink Pacer</Text>
                        <CountDown size={abvText + 6} until={this.state.pacertime} onFinish={() => this.countDownFinished()}
                            digitStyle={{ backgroundColor: "#e0f2f1", borderWidth: 2, borderColor: "#00897b" }}
                            digitTxtStyle={{ color: "#00897b" }} separatorStyle={{ color: "#00897b" }}
                            timeToShow={this.state.pacertime === 3600 ? ['H', 'M', 'S'] : ['M', 'S']} timeLabels={{ m: null, s: null }} showSeparator />
                        {this.checkLastDrink() === true ?
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={[styles.dropShadow3, addButtonSize === true ? styles.smallUndoButton : styles.undoButton]} onPress={() => { this.undoLastDrink(), this.setState({ showpacer: false }) }}>
                                    <View><Text style={{ color: "#000000", fontSize: alcTypeText }}>↩️</Text></View>
                                </TouchableOpacity>
                            </View> : <TouchableOpacity style={[styles.dropShadow, styles.button]} onPress={() => this.cancelAlert("pc")}>
                                <Text style={styles.buttonText}>Cancel Pacer</Text>
                            </TouchableOpacity>}
                    </View>}
                    {this.checkMaxRec() === true &&
                        <View style={styles.cardView}>
                            <Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 10 }}>You have reached the max recommended {maxRecValues[5] > maxRecValues[7] && maxRecValues[6] > maxRecValues[8] ? "weekly and monthly" : maxRecValues[5] > maxRecValues[7] === true && maxRecValues[6] > maxRecValues[8] === false ? "weekly" : "monthly"} limit.</Text>
                            <Text style={{ color: "#000000", fontSize: 22, textAlign: "center", padding: 10 }}>Please condiser taking a break.</Text>
                            {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={[styles.dropShadow3, addButtonSize === true ? styles.smallUndoButton : styles.undoButton]} onPress={() => this.undoLastDrink()}>
                                        <View><Text style={{ color: "#000000", fontSize: alcTypeText }}>↩️</Text></View>
                                    </TouchableOpacity>
                                </View>}
                        </View>}
                    {this.state.warn === true && this.state.indefbreak === false && (this.state.break === "" || this.state.break === false) && this.state.happyhour === false &&
                        <View style={styles.cardView}>
                            <Text style={{ color: "#000000", fontSize: warnTitleButton, textAlign: "center", padding: 4, fontWeight: "bold" }}>Warning</Text>
                            <Text style={{ color: "#000000", fontSize: warnBody, textAlign: "center", padding: 4 }}>(1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects.</Text>
                            <Text style={{ color: "#000000", fontSize: warnBody, textAlign: "center", padding: 4 }}>(2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems.</Text>
                            <TouchableOpacity style={[styles.dropShadow, styles.warningCard]} onPress={() => this.warnCardHandle()}>
                                <Text style={{ color: "#FFFFFF", fontSize: warnTitleButton, textAlign: "center" }}>Accept</Text>
                            </TouchableOpacity>
                        </View>}
                    {(this.state.buzzes && this.state.buzzes.length > 0) && <View style={styles.buzzCard}>
                        {buzzes}
                    </View>}
                </ScrollView>
            </View >
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);