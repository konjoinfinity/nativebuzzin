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
import { Functions } from "./Functions";
import styles from "./Styles"
import CountDown from 'react-native-countdown-component';
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText,
    abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, namekey,
    genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakminkey,
    gaugeLabels, warnText, dangerText, autobreakthresholdkey, limitbackey, limitkey, drinkskey, cancelbreakskey,
    showlimitkey, abovePoint10, custombreakkey, hhhourkey, indefbreakkey, loginButtonText, limitdatekey, pacerkey,
    pacertimekey, shotsStyle, loginTitle
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
            selectedBuzz: "", buzzmodal: false, buzzduration: 30
        }
    };

    async componentDidMount() {
        var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, indefbreakkey, limitbackey, limitkey, drinkskey,
            happyhourkey, autobreakthresholdkey, namekey, genderkey, weightkey, hhhourkey, pacertimekey])
        this.setState({
            autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), indefbreak: JSON.parse(values[2][1]),
            limitbac: JSON.parse(values[3][1]), limit: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
            happyhour: JSON.parse(values[6][1]), threshold: JSON.parse(values[7][1]), name: JSON.parse(values[8][1]),
            gender: JSON.parse(values[9][1]), weight: JSON.parse(values[10][1]), hhhour: JSON.parse(values[11][1]),
            pacertime: JSON.parse(values[12][1])
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
                if (this.checkLastCall() === true) { this.setState({ showlimit: true }) }
            } else { this.setState({ showlimit: false, limitdate: "" }) }
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
        await AsyncStorage.getItem(key, (error, result) => {
            result !== null && result !== "[]" ? this.setState({ buzzes: JSON.parse(result) }) : this.setState({ buzzes: [] })
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) }, () => this.checkBac())
                setTimeout(() => {
                    var durations = Functions.timeSince(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes[this.state.oldbuzzes.length - 1].length - 1].dateCreated, "timesince")
                    this.setState({ timesince: `${durations[0]} ${durations[0] === 1 ? "day" : "days"}, ${durations[1]} ${durations[1] === 1 ? "hour" : "hours"}, ${durations[2]} ${durations[2] === 1 ? "minute" : "minutes"}, and ${durations[3]} ${durations[3] === 1 ? "second" : "seconds"}` })
                }, 200);
            } else { this.setState({ oldbuzzes: [] }, () => this.checkBac()) }
        })
        const login = this.props.navigation.getParam('login');
        if (login === true) {
            this.props.copilotEvents.on('stepChange', this.handleStepChange);
            setTimeout(() => {
                this.props.start();
                this.props.navigation.setParams({ login: false });
            }, 1000);
        }
        setTimeout(() => { this.setState({ focus: true }, () => this.checkBac()) }, 1050);
        if (this.state.happyhour === true) {
            var happyHour = moment(new Date()).local().hours()
            happyHour < this.state.hhhour ? this.setState({ happyhourtime: happyHour }) : this.setState({ happyhourtime: "" })
        } else if (this.state.happyhour === false) { this.setState({ happyhourtime: "" }) }
        if (this.state.pacer === true && this.state.buzzes.length >= 1 && this.state.showpacer === false) {
            var drinkPacerTime = Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated)
            drinkPacerTime = drinkPacerTime * 3600
            if (drinkPacerTime < this.state.pacertime) {
                this.setState({ pacertime: this.state.pacertime - drinkPacerTime }, () => this.setState({ showpacer: true }))
            }
        }
    }

    componentWillUnmount() {
        this.props.copilotEvents.off('stop');
        clearInterval(this.state.timer);
        clearInterval(this.state.flashtimer);
    }

    handleModal(number) {
        Vibration.vibrate();
        this.setState({ [number]: !this.state[number] });
    }

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

    async saveBuzz() {
        await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
        if (this.state.bac > this.state.threshold) { await AsyncStorage.setItem(autobreakminkey, JSON.stringify(true)) }
        if (this.state.limit === true) {
            if (this.state.bac > this.state.limitbac || this.state.buzzes.length >= this.state.drinks) {
                this.setState({ showlimit: true }), await AsyncStorage.setItem(showlimitkey, JSON.stringify(true))
            }
        }
        if (this.state.pacer === true) { this.setState({ showpacer: true }) }
    }

    async checkBac() {
        if (this.state.buzzes.length >= 1) {
            var duration = Functions.singleDuration(this.state.buzzes[0].dateCreated)
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
                    var flashTimer = setInterval(() => {
                        this.setState(this.state.flashwarning === "#00bfa5" ? { flashwarning: "#AE0000" } : { flashwarning: "#00bfa5" })
                    }, 800);
                    this.setState({ flashtimer: flashTimer })
                }
            }, 200);
        }
    }

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

    async moveToOld() {
        var autobreakcheck, oldbuzzarray = this.state.oldbuzzes, newbuzzarray = this.state.buzzes;
        await AsyncStorage.getItem(autobreakminkey, (error, result) => { autobreakcheck = JSON.parse(result) })
        if (new Date(Date.parse(oldbuzzarray[oldbuzzarray.length - 1][0].dateCreated)).getDate() === new Date(Date.parse(newbuzzarray[0].dateCreated)).getDate() && new Date(Date.parse(oldbuzzarray[oldbuzzarray.length - 1][0].dateCreated)).getMonth() === new Date(Date.parse(newbuzzarray[0].dateCreated)).getMonth()) {
            var combined = [].concat(oldbuzzarray[oldbuzzarray.length - 1], newbuzzarray);
            oldbuzzarray.pop();
            oldbuzzarray.push(combined);
        } else {
            oldbuzzarray.push(newbuzzarray);
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
        if (this.state.pacer === true && this.state.showpacer === true) {
            this.setState({ showpacer: false })
        }
    }

    async clearDrinks() {
        Vibration.vibrate();
        clearInterval(this.state.flashtimer);
        this.setState({ buzzes: [], bac: 0.0, flashtext: false, flashtimer: "", flashtext: "" })
        await AsyncStorage.removeItem(key);
    }

    async undoLastDrink() {
        if (Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated) < 0.0333333) {
            Vibration.vibrate();
            var undobuzz;
            await AsyncStorage.getItem(key, (error, result) => {
                if (result !== null) { undobuzz = JSON.parse(result); undobuzz.pop(); this.setState({ buzzes: undobuzz }) }
            })
            await AsyncStorage.setItem(key, JSON.stringify(undobuzz), () => { this.checkBac() })
        }
        if (this.state.showlimit === true && this.state.bac < this.state.limitbac) {
            this.setState({ showlimit: false })
        }
    }

    checkLastDrink() {
        if (Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated) < 0.0333333) { return true }
        else { return false }
    }

    cancelAlert(typealert) {
        Vibration.vibrate();
        Alert.alert('Are you sure you want to start drinking now?', typealert === "hh" ? 'Maybe you should hold off.' :
            typealert === "sl" ? 'Consider waiting it out.' : typealert === "br" ? 'Think about sticking to your break.' :
                typealert === "ib" ? 'Consider keeping up your streak.' : "Drink pacer helps reduce drinking too quickly.",
            [{ text: 'Yes', onPress: () => typealert === "hh" ? this.stopModeration("hh") : typealert === "sl" ? this.stopModeration("sl") : typealert === "br" ? this.stopModeration("break") : typealert === "ib" ? this.stopModeration("ib") : this.stopModeration("pc") }, { text: 'No' }],
            { cancelable: false },
        );
    }

    async stopModeration(stoptype) {
        Vibration.vibrate();
        this.setState(stoptype === "break" ? { break: false } : stoptype === "hh" ? { happyhour: false, happyhourtime: "" } :
            stoptype === "sl" ? { showlimit: false, limit: false, limitbac: "", drinks: "", limitdate: "" } :
                stoptype === "ib" ? { indefbreak: false } : { showpacer: false, pacer: false })
        if (stoptype === "break") { await AsyncStorage.removeItem(breakdatekey) }
        if (stoptype === "sl") { await AsyncStorage.removeItem(limitdatekey) }
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet(stoptype === "break" ? [[breakkey, JSON.stringify(false)], [custombreakkey, JSON.stringify(false)],
        [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
            stoptype === "hh" ? [[happyhourkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] :
                stoptype === "sl" ? [[limitkey, JSON.stringify(false)], [showlimitkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] : stoptype === "ib" ? [[indefbreakkey, JSON.stringify(false)],
                [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]] : [[pacerkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    checkLastCall() {
        lastCall = Functions.getDayHourMin(this.state.limitdate, new Date)
        if (lastCall[0] + lastCall[1] + lastCall[2] + lastCall[3] > 0) { return true }
        else { return false }
    }

    buzzModal() {
        Vibration.vibrate();
        this.setState({ buzzmodal: !this.state.buzzmodal, selectedBuzz: this.state.buzzes });
    }

    closeBuzzModal() {
        Vibration.vibrate();
        this.setState({ buzzmodal: !this.state.buzzmodal, selectedBuzz: "" },
            () => { setTimeout(() => { this.scrolltop.scrollTo({ y: 0, animated: true }) }, 750) })
    }

    buzzDuration(incdec) {
        if (incdec === "up" && this.state.buzzduration >= 15 && this.state.buzzduration < 240) {
            this.setState({ buzzduration: this.state.buzzduration + 15 })
        } else if (incdec === "down" && this.state.buzzduration > 15 && this.state.buzzduration <= 240) {
            this.setState({ buzzduration: this.state.buzzduration - 15 })
        }
    }

    async deleteBuzz(buzz) {
        Vibration.vibrate();
        var filtered = Functions.reverseArray(this.state.buzzes).filter(deleted => deleted !== buzz)
        var reordered = Functions.reverseArray(filtered).map((buzz) => { return buzz })
        await AsyncStorage.setItem(key, JSON.stringify(reordered), () => { this.setState({ buzzes: reordered }) })
        this.setState({ selectedBuzz: filtered })
    }

    async editBuzz() {
        Vibration.vibrate();
        var delayTime = new Date();
        delayTime.setMinutes(delayTime.getMinutes() - this.state.buzzduration)
        var breverse = Functions.reverseArray(this.state.buzzes)
        breverse.unshift({ drinkType: this.state.alctype, dateCreated: delayTime, oz: this.state.oz, abv: this.state.abv })
        breverse.sort((a, b) => new Date(Date.parse(a.dateCreated)).getTime() - new Date(Date.parse(b.dateCreated)).getTime());
        var buzznormal = Functions.reverseArray(breverse)
        await AsyncStorage.setItem(key, JSON.stringify(buzznormal), () => { this.setState({ buzzes: buzznormal }) })
        this.setState({ selectedBuzz: breverse })
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1]
        let buzzes, selectedbuzz;
        this.state.buzzes && this.state.buzzes.length !== 0 && (buzzes = Functions.reverseArray(this.state.buzzes).map((buzz, id) => {
            return (<View key={id}>
                {id === 0 && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}><Text style={{ fontSize: 26, textAlign: "center" }}>Current Buzz</Text><TouchableOpacity style={[styles.plusMinusButtons, { marginLeft: 45 }]} onPress={() => this.buzzModal(buzz, id)}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>}
                <View style={styles.buzzMap}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: 16, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                </View></View>
            )
        }))
        this.state.selectedBuzz !== "" && (selectedbuzz = Functions.reverseArray(this.state.selectedBuzz).map((buzz, id) => {
            return (<View key={id}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: 16, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    {this.state.selectedBuzz.length >= 2 && <TouchableOpacity style={styles.buzzheaderButton} onPress={() => this.deleteBuzz(buzz)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>}</View>
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
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500", padding: 2 }}>Edit Current Buzz</Text>
                            {selectedbuzz}
                        </View>
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.alcswitch = ref }}
                                    containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                    onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
                                    <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                    <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                    <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    <Text style={{ fontSize: alcTypeText }}>🍹</Text>
                                </MultiSwitch>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                    <View style={{ paddingBottom: 15 }}>
                                        {this.state.alctype === "Beer" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvSize} activeItemStyle={beerActive} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.abvswitch = ref }}
                                                    containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={1}>
                                                    <Text style={{ fontSize: abvText }}>4%</Text>
                                                    <Text style={{ fontSize: abvText }}>5%</Text>
                                                    <Text style={{ fontSize: abvText }}>6%</Text>
                                                    <Text style={{ fontSize: abvText }}>7%</Text>
                                                    <Text style={{ fontSize: abvText }}>8%</Text>
                                                </MultiSwitch>
                                            </View>}
                                        {this.state.alctype !== "Beer" && this.state.alctype !== "Cocktail" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvWineSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={1}>
                                                    <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "11%" : "30%"}</Text>
                                                    <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "12%" : "40%"}</Text>
                                                    <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "13%" : "50%"}</Text>
                                                </MultiSwitch>
                                            </View>}
                                        {this.state.alctype === "Cocktail" &&
                                            <View style={[styles.numberofshots, { backgroundColor: "#e0f2f1" }]}>
                                                <Text style={{ fontSize: abvWineText }}>Number of Shots</Text>
                                            </View>}
                                    </View>
                                    {this.state.alctype !== "Cocktail" &&
                                        <View style={styles.multiSwitchViews}>
                                            <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }} active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "12oz" : this.state.alctype === "Wine" ? "5oz" : "1.5oz"}</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "16oz" : this.state.alctype === "Wine" ? "8oz" : "3oz"}</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "20oz" : this.state.alctype === "Wine" ? "12oz" : "6oz"}</Text>
                                            </MultiSwitch>
                                        </View>}
                                    {this.state.alctype === "Cocktail" &&
                                        <View style={styles.multiSwitchViews}>
                                            <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }} active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>1</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>2</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>3</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>4</Text>
                                            </MultiSwitch>
                                        </View>}
                                </View>
                                <TouchableOpacity onPress={() => this.editBuzz()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                    <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 10 }}>How Long Ago?</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5, marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.buzzduration === 0 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.buzzDuration("down")}>
                                    <View><Text style={{ fontSize: 20, color: "#ffffff" }}>-</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.smallbac, { backgroundColor: "#e0f2f1" }]}>
                                    <View><Text style={{ fontSize: 22 }}>{this.state.buzzduration} Minutes</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.buzzduration === 240 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.buzzDuration("up")}>
                                    <View><Text style={{ fontSize: 20, color: "#ffffff" }}>+</Text></View></TouchableOpacity>
                            </View>
                            <Text style={styles.profileLine}>___________________________________________</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={styles.buzzbutton} onPress={() => this.closeBuzzModal()}>
                                    <Text style={styles.buttonText}>Done</Text>
                                </TouchableOpacity></View>
                        </View>
                    </ScrollView>
                </Modal>
                {this.state.focus === true && <NavigationEvents onWillFocus={() => this.componentDidMount()} />}
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <CopilotStep text="This gauge displays your current BAC.  The tick marks show the optimal buzz range.  Check the readout for your current BAC." order={1} name="gauge">
                            <CopilotView style={{ alignSelf: "center" }}>
                                {this.state.bac > 0.06 ? <Text style={{ fontWeight: "bold", textAlign: "center", color: this.state.flashwarning }}>WARNING              STOP              DRINKING</Text>
                                    : maxRecValues[5] > maxRecValues[7] || maxRecValues[6] > maxRecValues[8] ? <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>  CUT        </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>        BACK</Text></Text>
                                        : <Text style={{ fontWeight: "bold", textAlign: "center", color: "#00bfa5" }}>|                          |</Text>}
                                <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                                {(this.state.bac === 0 || this.state.bac === undefined) &&
                                    <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></View>}
                                {this.state.bac > 0.00 && (this.state.bac > 0.04 && this.state.bac < 0.06 ?
                                    <View style={styles.spaceAroundView}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                                        <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                            <Text style={{ fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>
                                    : <View style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View>)}
                            </CopilotView>
                        </CopilotStep>
                    </View>
                    {this.state.indefbreak === false && (this.state.break === "" || this.state.break === false) && this.state.happyhourtime === "" && this.state.bac < 0.10 && this.state.showlimit === false && this.state.showpacer === false &&
                        <CopilotStep text="Press to each to change drink type, abv, and ounces." order={2} name="drink">
                            <CopilotView><View style={styles.cardView}>
                                <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                    <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.alcswitch = ref }}
                                        containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍹</Text>
                                    </MultiSwitch>
                                    {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                        <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.undoLastDrink()}>
                                            <View><Text style={{ fontSize: alcTypeText }}>↩️</Text></View></TouchableOpacity>}
                                </View>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                        <View style={{ paddingBottom: 15 }}>
                                            {this.state.alctype === "Beer" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <MultiSwitch choiceSize={abvSize} activeItemStyle={beerActive} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.abvswitch = ref }}
                                                        containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={1}>
                                                        <Text style={{ fontSize: abvText }}>4%</Text>
                                                        <Text style={{ fontSize: abvText }}>5%</Text>
                                                        <Text style={{ fontSize: abvText }}>6%</Text>
                                                        <Text style={{ fontSize: abvText }}>7%</Text>
                                                        <Text style={{ fontSize: abvText }}>8%</Text>
                                                    </MultiSwitch>
                                                </View>}
                                            {this.state.alctype !== "Beer" && this.state.alctype !== "Cocktail" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <MultiSwitch choiceSize={abvWineSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }}
                                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                        onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }} active={1}>
                                                        <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "11%" : "30%"}</Text>
                                                        <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "12%" : "40%"}</Text>
                                                        <Text style={{ fontSize: abvWineText }}>{this.state.alctype === "Wine" ? "13%" : "50%"}</Text>
                                                    </MultiSwitch>
                                                </View>}
                                            {this.state.alctype === "Cocktail" &&
                                                <View style={[styles.numberofshots, { backgroundColor: "#e0f2f1" }]}>
                                                    <Text style={{ fontSize: abvWineText }}>Number of Shots</Text>
                                                </View>}
                                        </View>
                                        {this.state.alctype !== "Cocktail" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={activeStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }} active={0}>
                                                    <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "12oz" : this.state.alctype === "Wine" ? "5oz" : "1.5oz"}</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "16oz" : this.state.alctype === "Wine" ? "8oz" : "3oz"}</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>{this.state.alctype === "Beer" ? "20oz" : this.state.alctype === "Wine" ? "12oz" : "6oz"}</Text>
                                                </MultiSwitch>
                                            </View>}
                                        {this.state.alctype === "Cocktail" &&
                                            <View style={styles.multiSwitchViews}>
                                                <MultiSwitch choiceSize={abvLiquorSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.ozswitch = ref }}
                                                    containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }} active={0}>
                                                    <Text style={{ fontSize: abvLiquorText }}>1</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>2</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>3</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>4</Text>
                                                </MultiSwitch>
                                            </View>}
                                    </View>
                                    <CopilotStep text="Press to add drink with selected options." order={3} name="add">
                                        <CopilotView>
                                            <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                                <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                                        </CopilotView>
                                    </CopilotStep>
                                </View>
                            </View></CopilotView>
                        </CopilotStep>}
                    {this.state.break === true && <View style={styles.cardView}>
                        {this.state.autobreak === true ?
                            <View><Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break. It's been:</Text>{this.state.timesince !== null && this.state.bac === 0 &&
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5 }}><Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink.</Text>}</View> :
                            <View><Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                                <Text style={styles.breakDateText}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text></View>}
                        <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("br")}>
                            <Text style={styles.buttonText}>Cancel Break</Text>
                        </TouchableOpacity>
                    </View>}
                    {this.state.indefbreak === false && (this.state.break === "" || this.state.break === false) && this.state.happyhour === true && this.state.happyhourtime !== "" &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>Happy Hour at {this.state.hhhour === 16 ? "4pm" : this.state.hhhour === 17 ? "5pm" : this.state.hhhour === 18 ? "6pm" : this.state.hhhour === 19 ? "7pm" : "8pm"}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("hh")}>
                                <Text style={styles.buttonText}>Cancel Happy Hour</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.indefbreak === true &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5 }}>You are taking a break, It's been:</Text>
                            {this.state.timesince !== null && this.state.bac === 0 &&
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", padding: 5 }}><Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink. Keep up the good work!</Text>}
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("ib")}>
                                <Text style={styles.buttonText}>Cancel Break</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.bac > 0.10 && <View style={styles.cardView}>
                        {abovePoint10}
                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.undoLastDrink()}>
                                    <View><Text style={{ fontSize: alcTypeText }}>↩️</Text></View>
                                </TouchableOpacity>
                            </View>}
                    </View>}
                    {this.state.showlimit === true && (this.state.bac > this.state.limitbac || this.state.buzzes.length >= this.state.drinks || this.checkLastCall() === true) && this.state.bac < 0.10 && this.state.showpacer === false && <View style={styles.cardView}>
                        {this.checkLastCall() === false ?
                            <View>
                                <Text style={{ fontSize: 18, textAlign: "center", padding: 5 }}>You have reached your:</Text>
                                {this.state.bac > this.state.limitbac && <Text style={{ fontSize: 20, textAlign: "center", padding: 2, fontWeight: "bold" }}>BAC Limit - {this.state.limitbac}</Text>}
                                {this.state.buzzes.length >= this.state.drinks && <Text style={{ fontSize: 20, textAlign: "center", padding: 2, fontWeight: "bold" }}>{this.state.bac > this.state.limitbac && this.state.buzzes.length >= this.state.drinks && "& "} Set Drink Limit - {this.state.drinks}</Text>}
                                <Text style={{ fontSize: 18, textAlign: "center", padding: 5 }}>Until your BAC reaches 0.0, stop drinking and have some water.</Text>
                                {this.state.buzzes.length >= 1 && this.checkLastDrink() === true ?
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                        <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => { this.undoLastDrink(), this.setState({ showlimit: false }) }}>
                                            <View><Text style={{ fontSize: alcTypeText }}>↩️</Text></View>
                                        </TouchableOpacity>
                                    </View> : <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("sl")}>
                                        <Text style={styles.buttonText}>Cancel Set Limit</Text>
                                    </TouchableOpacity>}
                            </View> : <View>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>It is now last call.</Text>
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>Drink water and get home safely.</Text>
                                <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("sl")}>
                                    <Text style={styles.buttonText}>Cancel Last Call</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>}
                    {this.state.buzzes.length >= 1 && this.state.showpacer === true && <View style={styles.cardView}>
                        <Text style={{ fontSize: 22, textAlign: "center", padding: 15 }}>Drink Pacer</Text>
                        <CountDown size={28} until={this.state.pacertime} onFinish={() => this.setState({ showpacer: false }, () => Vibration.vibrate())}
                            digitStyle={{ backgroundColor: "#e0f2f1", borderWidth: 2, borderColor: "#00897b" }}
                            digitTxtStyle={{ color: "#00897b" }} separatorStyle={{ color: "#00897b" }}
                            timeToShow={this.state.pacertime === 3600 ? ['H', 'M', 'S'] : ['M', 'S']} timeLabels={{ m: null, s: null }} showSeparator />
                        {this.checkLastDrink() === true ?
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => { this.undoLastDrink(), this.setState({ showpacer: false }) }}>
                                    <View><Text style={{ fontSize: alcTypeText }}>↩️</Text></View>
                                </TouchableOpacity>
                            </View> : <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("pc")}>
                                <Text style={styles.buttonText}>Cancel Pacer</Text>
                            </TouchableOpacity>}
                    </View>}
                    {(this.state.buzzes && this.state.buzzes.length > 0) && <View style={styles.buzzCard}>
                        {buzzes}
                    </View>}
                </ScrollView>
            </View>
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);