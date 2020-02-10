import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Modal, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { AlertHelper } from './AlertHelper';
import { NavigationEvents } from "react-navigation";
import moment from "moment";
import { Functions } from "./Functions";
import styles from "./Styles"
import ReactNativeHaptic from 'react-native-haptic';
import MatIcon from "react-native-vector-icons/MaterialIcons"
import Micon from 'react-native-vector-icons/MaterialCommunityIcons'
import CalendarPicker from 'react-native-calendar-picker';
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText,
    abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, namekey,
    genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakminkey,
    gaugeLabels, warnText, dangerText, autobreakthresholdkey, limitbackey, limitkey, drinkskey, cancelbreakskey,
    showlimitkey, abovePoint10, custombreakkey, hhhourkey, indefbreakkey, loginButtonText, limitdatekey, pacerkey,
    pacertimekey, shotsStyle, loginTitle, lastcallkey, limithourkey, maxreckey, warnTitleButton, warnBody, warningkey,
    screenHeight, screenWidth
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
            metric: "oz", showHideOldBuzzes: false, oldmodal: false, selectedOldBuzz: "", obid: "", position: "",
            oldposition: "", addoldmodal: false, addoldbuzzes: [], selectedStartDate: null, drinkadd: false
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
                this.setState({ oldbuzzes: JSON.parse(result) })
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
            } else { this.setState({ oldbuzzes: [] }) }
        })
        setTimeout(() => { this.setState({ focus: true }) }, 800);
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
        clearInterval(this.state.flashtimer);
    }

    handleModal(number) {
        ReactNativeHaptic.generate('selection')
        this.setState({ [number]: !this.state[number] });
    }

    async deleteOldBuzz(obid, oldbuzz) {
        ReactNativeHaptic.generate('selection')
        var filtered = this.state.oldbuzzes.map((oldbuzzes) => { return oldbuzzes.filter(buzz => buzz !== oldbuzz) })
        await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => { this.setState({ oldbuzzes: filtered, selectedOldBuzz: filtered[obid], obid: [obid] }) })
        values = await Functions.maxRecDrinks()
    }

    async editOldBuzz(obid) {
        ReactNativeHaptic.generate('selection')
        var obnormal = this.state.oldbuzzes
        var lastTime = new Date(Date.parse(obnormal[obid][0].dateCreated))
        lastTime.setHours(0, 0, 0, 0)
        obnormal[obid].unshift({ drinkType: this.state.alctype, dateCreated: lastTime, oz: this.state.oz, abv: this.state.abv })
        await AsyncStorage.setItem(oldkey, JSON.stringify(obnormal), () => { this.setState({ oldbuzzes: obnormal, selectedOldBuzz: obnormal[obid], obid: [obid] }) })
        values = await Functions.maxRecDrinks()
    }

    oldModal(buzz, obid) {
        ReactNativeHaptic.generate('selection')
        this.setState({ oldmodal: !this.state.oldmodal, selectedOldBuzz: buzz === "a" ? "" : buzz, obid: obid === "z" ? "" : obid });
    }

    addOldModal() {
        ReactNativeHaptic.generate('selection')
        this.setState({ addoldmodal: !this.state.addoldmodal, selectedStartDate: null, drinkadd: false, addoldbuzzes: [] });
    }

    addOldBuzzState() {
        ReactNativeHaptic.generate('selection')
        addoldbuzzes = this.state.addoldbuzzes
        var oldbuzzdate = new Date(this.state.selectedStartDate);
        oldbuzzdate.setHours(0, 0, 0, 0);
        addoldbuzzes.unshift({ drinkType: this.state.alctype, dateCreated: oldbuzzdate, oz: this.state.oz, abv: this.state.abv })
        this.setState({ addoldbuzzes: addoldbuzzes })
    }

    deleteAddOldBuzz(oldbuzz) {
        ReactNativeHaptic.generate('selection')
        var delfilter = this.state.addoldbuzzes.filter(deleted => deleted !== oldbuzz)
        this.setState({ addoldbuzzes: delfilter })
    }

    async addOldBuzz() {
        var oldbuzzes;
        ReactNativeHaptic.generate('selection')
        var oldbuzzadd = this.state.addoldbuzzes;
        this.state.oldbuzzes === null ? oldbuzzes = [] : oldbuzzes = this.state.oldbuzzes
        oldbuzzes.unshift(oldbuzzadd);
        oldbuzzes.sort((a, b) => new Date(Date.parse(b[0].dateCreated)).getTime() - new Date(Date.parse(a[0].dateCreated)).getTime());
        await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzes), () => { this.setState({ oldbuzzes: oldbuzzes }, () => { this.addOldModal() }) })
        if (this.state.showHideOldBuzzes === false) { this.showHideBuzzes("showHideOldBuzzes") }
        this.componentDidMount()
    }

    async deleteWholeOldBuzz() {
        var filtered = _.pull(this.state.oldbuzzes, this.state.oldbuzzes[this.state.obid]);
        await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => { this.setState({ oldbuzzes: filtered }) })
        this.oldModal("a", "z")
        if (this.state.oldbuzzes.length === 0) { this.setState({ timesince: null }, () => { this.showHideBuzzes("showHideOldBuzzes") }) }
        this.componentDidMount()
    }

    confirmDelete() {
        ReactNativeHaptic.generate('notificationWarning')
        Alert.alert('Are you sure you want to delete this entire session?', 'Please confirm.', [{ text: 'Yes', onPress: () => { this.deleteWholeOldBuzz() } }, { text: 'No' }], { cancelable: false });
    }

    showHideBuzzes(statename) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }), () => setTimeout(() => { this.state[statename] === true ? this.scrolltop.scrollTo({ y: 400, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true }) }, 500));
        ReactNativeHaptic.generate('selection')
    }

    async addDrink() {
        ReactNativeHaptic.generate('selection')
        var drinkDate = new Date();
        this.setState(prevState => ({ buzzes: [{ drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }, ...prevState.buzzes] }))
        setTimeout(() => {
            this.saveBuzz();
            this.flashWarning();
            if (this.state.bac > 0.04 && this.state.bac < 0.06) { ReactNativeHaptic.generate('notification'); AlertHelper.show("success", "Buzzed", "You are now buzzed, drink water.") }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) { ReactNativeHaptic.generate('notificationSuccess'); AlertHelper.show("warn", "Slow Down", "Please take a break and drink some water.") }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) { ReactNativeHaptic.generate('notificationWarning'); AlertHelper.show("error", "Drunk", "Stop drinking and drink water.") }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { ReactNativeHaptic.generate('notificationError'); this.handleModal("modal1") }
            if (this.state.bac > 0.10) { ReactNativeHaptic.generate('notificationError'); this.handleModal("modal2") }
            setTimeout(() => this.state.buzzes.length === 1 ? this.scrolltop.scrollToEnd({ animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true }), 4000)
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
        let oldbuzzes, selectedoldbuzz, oldbuzztoadd;
        var oldbuzzmonth;
        var monthOld = new Date()
        monthOld.setMonth(monthOld.getMonth() - 2)
        this.state.oldbuzzes !== null && (oldbuzzmonth = this.state.oldbuzzes.map(buzz => { return buzz.filter(oldbuzz => Date.parse(oldbuzz.dateCreated) > monthOld) }))
        this.state.oldbuzzes !== null && (oldbuzzes = oldbuzzmonth.map((buzz, obid) => {
            return buzz.map((oldbuzz, id) => {
                return (<View key={id}>
                    {id === 0 && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}><Text style={{ color: "#000000", fontSize: abvText, padding: 10, textAlign: "center", marginRight: 30 }}>{moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY')}</Text><TouchableOpacity style={[styles.dropShadow, addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons]} onPress={() => this.oldModal(buzz, obid)}><Micon name="file-document-edit-outline" color="#ffffff" size={addButtonSize === "tablet" ? 40 : 21} /></TouchableOpacity></View>}
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                        <View style={addButtonSize === "tablet" ? [styles.dropShadow3, styles.largebuzzheaderButton] : [styles.dropShadow3, styles.buzzheaderButton]}><Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{oldbuzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></View>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ color: "#000000", fontSize: abvText, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                            <Text style={{ color: "#000000", fontSize: abvText - 2, padding: 5 }}>{new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ?
                                moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY') : moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}{new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ? ", old entry" : ""}</Text></View>
                    </View></View>
                )
            })
        }))
        this.state.selectedOldBuzz !== "" && (selectedoldbuzz = this.state.selectedOldBuzz.map((oldbuzz, id) => {
            return (<View key={id}>
                {id === 0 && <Text style={{ color: "#000000", fontSize: abvText, padding: 10, textAlign: "center" }}>Session Date: {moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY')}</Text>}
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <View style={addButtonSize === "tablet" ? [styles.dropShadow3, styles.largebuzzheaderButton] : [styles.dropShadow3, styles.buzzheaderButton]}><Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{oldbuzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#000000", fontSize: abvText, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                        <Text style={{ color: "#000000", fontSize: abvText - 2, padding: 5 }}>
                            {new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ?
                                moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY') : moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}{new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ? ", old entry" : ""}</Text></View>
                    {this.state.selectedOldBuzz.length >= 2 && <TouchableOpacity style={[styles.dropShadow3, addButtonSize === "tablet" ? styles.largebuzzheaderButton : styles.buzzheaderButton]} onPress={() => this.deleteOldBuzz(this.state.obid, oldbuzz)}><Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>}</View>
            </View>
            )
        }))
        this.state.addoldbuzzes !== null && (oldbuzztoadd = this.state.addoldbuzzes.map((oldbuzz, id) => {
            return (<View key={id}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <View style={addButtonSize === "tablet" ? [styles.dropShadow3, styles.largebuzzheaderButton] : [styles.dropShadow3, styles.buzzheaderButton]}><Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{oldbuzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#000000", fontSize: abvText, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                        <Text style={{ color: "#000000", fontSize: abvText - 2, padding: 5 }}>
                            {new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ?
                                moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY') : moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}{new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ? ", old entry" : ""}</Text></View>
                    <TouchableOpacity style={[styles.dropShadow3, addButtonSize === "tablet" ? styles.largebuzzheaderButton : styles.buzzheaderButton]} onPress={() => this.deleteAddOldBuzz(oldbuzz)}><Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity></View>
            </View>
            )
        }))
        return (
            <View>
                <Modal animationType="slide" transparent={false} visible={this.state.addoldmodal}>
                    <ScrollView>
                        <View style={[styles.cardView, { marginTop: 30 }]}>
                            <Text style={{ color: "#000000", textAlign: "center", fontSize: addButtonSize === "tablet" ? 40 : 20, fontWeight: "500", padding: 10 }}>Add Drinks</Text>
                            {this.state.selectedStartDate !== null ? <Text style={{ color: "#000000", fontSize: abvText, padding: 10, textAlign: "center" }}>Session Date: {moment(this.state.selectedStartDate).format('ddd MMM Do YYYY')}</Text> : <Text style={{ color: "#000000", fontSize: abvText, padding: 10, textAlign: "center" }}>Select Date</Text>}
                            {oldbuzztoadd}
                        </View>
                        <View style={[styles.cardView, { padding: 10 }]}>
                            {this.state.drinkadd === false && <View>
                                <CalendarPicker onDateChange={(date) => { this.setState({ selectedStartDate: date }); ReactNativeHaptic.generate('selection') }} maxDate={new Date()} minDate={monthOld} scaleFactor={400} selectedDayColor={"#1de9b6"} />
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 5 }}>
                                    <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton, { backgroundColor: "#AE0000", borderColor: "#AE0000" }]} onPress={() => this.addOldModal()}>
                                        <Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    {this.state.selectedStartDate !== null &&
                                        <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton]} onPress={() => { ReactNativeHaptic.generate('selection'); this.setState({ drinkadd: true }) }}>
                                            <Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>Add Drinks</Text>
                                        </TouchableOpacity>}
                                </View>
                            </View>}
                            {this.state.drinkadd === true && <View>
                                <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                    <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.addoldmodalalcswitch = ref }}
                                        containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value, this.state.metric)[0], oz: Functions.setAlcType(alcValues[number].value, this.state.metric)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
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
                                                        onActivate={(number) => { this.setState({ metric: number === 0 ? "oz" : "ml", oz: Functions.setAlcType(this.state.alctype, number === 0 ? "oz" : "ml")[1] }, () => { ReactNativeHaptic.generate('selection') }) }} active={this.state.metric === "oz" ? 0 : 1}>
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
                                    <TouchableOpacity onPress={() => this.addOldBuzzState()} style={addButtonSize === true ? [styles.dropShadow2, styles.smallAddButton] : addButtonSize === false ? [styles.dropShadow2, styles.addButton] : addButtonSize === "tablet" && screenWidth === 2048 && screenHeight === 2732 ? [styles.dropShadow2, styles.xlargeAddButton] : [styles.dropShadow2, styles.largeAddButton]}>
                                        <Text style={{ color: "#000000", fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                                </View>
                                <Text style={styles.profileLine}>_________________________________________</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 5, paddingBottom: 5 }}>
                                    <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton, { backgroundColor: "#AE0000", borderColor: "#AE0000" }]} onPress={() => this.addOldModal()}>
                                        <Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    {this.state.addoldbuzzes.length > 0 && <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton]} onPress={() => this.addOldBuzz()}>
                                        <Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>Submit</Text>
                                    </TouchableOpacity>}</View>
                            </View>}
                        </View>
                    </ScrollView>
                </Modal>
                <Modal animationType="slide" transparent={false} visible={this.state.oldmodal}>
                    <ScrollView>
                        <View style={[styles.cardView, { marginTop: 30 }]}>
                            <Text style={{ color: "#000000", textAlign: "center", fontSize: addButtonSize === "tablet" ? 40 : 20, fontWeight: "500" }}>Edit Old Drinks</Text>
                            {selectedoldbuzz}
                        </View>
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.editoldmodalalcswitch = ref }}
                                    containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                    onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value, this.state.metric)[0], oz: Functions.setAlcType(alcValues[number].value, this.state.metric)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
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
                                                    onActivate={(number) => { this.setState({ metric: number === 0 ? "oz" : "ml", oz: Functions.setAlcType(this.state.alctype, number === 0 ? "oz" : "ml")[1] }, () => { ReactNativeHaptic.generate('selection') }) }} active={this.state.metric === "oz" ? 0 : 1}>
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
                                <TouchableOpacity onPress={() => this.editOldBuzz(this.state.obid)} style={addButtonSize === true ? [styles.dropShadow2, styles.smallAddButton] : addButtonSize === false ? [styles.dropShadow2, styles.addButton] : addButtonSize === "tablet" && screenWidth === 2048 && screenHeight === 2732 ? [styles.dropShadow2, styles.xlargeAddButton] : [styles.dropShadow2, styles.largeAddButton]}>
                                    <Text style={{ color: "#000000", fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                            </View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton, { margin: 10, backgroundColor: "#AE0000", borderColor: "#AE0000" }]} onPress={() => { this.confirmDelete() }}>
                                    <Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton, { margin: 10 }]} onPress={() => this.oldModal("a", "z")}>
                                    <Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>Done</Text>
                                </TouchableOpacity></View>
                        </View>
                    </ScrollView>
                </Modal>
                {this.state.focus === true && <NavigationEvents onWillFocus={() => { ReactNativeHaptic.generate('impactLight'); this.componentDidMount() }} />}
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    {this.state.oldbuzzes.length !== 0 && <View style={[styles.buzzCard, { marginTop: 10 }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10, padding: 5 }}>
                            <Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 10 }}>Drink History</Text>
                            <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton]} onPress={() => this.showHideBuzzes("showHideOldBuzzes")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showHideOldBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.dropShadow, addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons, { marginTop: 5 }]} onPress={() => this.addOldModal()}><Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>+</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideOldBuzzes === true && <View>{oldbuzzes}</View>}
                    </View>}
                    {this.state.oldbuzzes.length === 0 && <View style={[styles.buzzCard, { marginTop: 10 }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 10 }}>Drink History</Text>
                            <TouchableOpacity style={[styles.dropShadow, addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons, { marginTop: 5 }]} onPress={() => this.addOldModal()}><Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>+</Text></TouchableOpacity>
                        </View>
                    </View>}
                </ScrollView>
            </View >
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);