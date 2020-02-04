import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Platform, Switch, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import _ from 'lodash'
import MultiSwitch from "react-native-multi-switch";
import { NavigationEvents } from "react-navigation";
import { BarChart, Grid, XAxis, LineChart } from 'react-native-svg-charts'
import { Text as TextSVG, G, Line } from "react-native-svg";
import * as scale from 'd3-scale'
import { Functions } from "./Functions";
import styles from "./Styles"
import CalendarPicker from 'react-native-calendar-picker';
import ReactNativeHaptic from 'react-native-haptic';
import Micon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    key, oldkey, loginTitle, loginButtonText, abvText, genderkey, barChartWidth, scrollToAmt, shotsStyle, alcTypeSize, alcValues,
    multiSwitchMargin, alcTypeText, abvSize, beerActive, abvLiquorSize, abvLiquorText, activeStyle, addButtonSize, addButtonText,
    abvWineSize, abvWineText, screenHeight, screenWidth
} from "./Variables";

var values;
(async () => { values = await Functions.maxRecDrinks() })();

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null, oldbuzzes: null, timesince: null, showHideBuzzes: false, showHideOldBuzzes: false, gender: "",
            chartswitch: false, oldmodal: false, buzzmodal: false, alctype: "Beer", abv: 0.05, oz: 12, selectedOldBuzz: "", obid: "",
            selectedBuzz: "", buzzduration: 30, position: "", oldposition: "", addoldmodal: false, addoldbuzzes: [], selectedStartDate: null,
            drinkadd: false, metric: "oz"
        }
    };

    async componentDidMount() {
        values = await Functions.maxRecDrinks()
        await AsyncStorage.getItem(key, (error, result) => { result !== null && result !== "[]" ? this.setState({ buzzes: JSON.parse(result) }) : this.setState({ buzzes: null }) })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) })
                setTimeout(() => {
                    var durations = Functions.timeSince(this.state.oldbuzzes[0][0].dateCreated, "timesince")
                    this.setState({ timesince: `${durations[0]} ${durations[0] === 1 ? "day" : "days"}, ${durations[1]} ${durations[1] === 1 ? "hour" : "hours"}, ${durations[2]} ${durations[2] === 1 ? "minute" : "minutes"}, and ${durations[3]} ${durations[3] === 1 ? "second" : "seconds"}` })
                }, 200);
            } else { this.setState({ oldbuzzes: null }) }
        })
        await AsyncStorage.getItem(genderkey, (error, result) => { this.setState({ gender: JSON.parse(result) }) })
    }

    async refreshVals() {
        values = await Functions.maxRecDrinks();
        await AsyncStorage.getItem(oldkey, (error, result) => { this.setState({ oldbuzzes: JSON.parse(result) }) })
    }

    showHideBuzzes(statename) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }), () => setTimeout(() => { this.state[statename] === true ? this.scrolltop.scrollTo({ y: 400, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true }) }, 500));
        ReactNativeHaptic.generate('selection')
    }

    chartSwitch() {
        if (Platform.OS === "android") { ReactNativeHaptic.generate('selection') }
        this.setState(prevState => ({ chartswitch: !prevState.chartswitch }))
        this.state.chartswitch === true ? this.sidescroll.scrollTo({ x: 0 }) : this.sidescroll.scrollTo({ x: scrollToAmt })
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

    buzzDuration(incdec) {
        ReactNativeHaptic.generate('selection')
        if (incdec === "up" && this.state.buzzduration >= 15 && this.state.buzzduration < 240) { this.setState({ buzzduration: this.state.buzzduration + 15 }) }
        else if (incdec === "down" && this.state.buzzduration > 15 && this.state.buzzduration <= 240) { this.setState({ buzzduration: this.state.buzzduration - 15 }) }
    }

    addOldBuzzState() {
        ReactNativeHaptic.generate('selection')
        addoldbuzzes = this.state.addoldbuzzes
        var oldbuzzdate = new Date(this.state.selectedStartDate);
        oldbuzzdate.setHours(0, 0, 0, 0);
        addoldbuzzes.unshift({ drinkType: this.state.alctype, dateCreated: oldbuzzdate, oz: this.state.oz, abv: this.state.abv })
        this.setState({ addoldbuzzes: addoldbuzzes })
    }

    async addOldDrink() {
        var oldbuzzes;
        ReactNativeHaptic.generate('selection')
        var olddrinkdate = new Date();
        var addolddrinks = [{ drinkType: this.state.alctype, dateCreated: olddrinkdate, oz: this.state.oz, abv: this.state.abv }]
        this.state.oldbuzzes === null ? oldbuzzes = [] : oldbuzzes = this.state.oldbuzzes
        if (oldbuzzes.length !== 0) {
            if (new Date(Date.parse(oldbuzzes[0][oldbuzzes[0].length - 1].dateCreated)).getDate() === olddrinkdate.getDate() && new Date(Date.parse(oldbuzzes[0][oldbuzzes[0].length - 1].dateCreated)).getMonth() === olddrinkdate.getMonth()) {
                var combined = [].concat({ drinkType: this.state.alctype, dateCreated: olddrinkdate, oz: this.state.oz, abv: this.state.abv }, oldbuzzes[0]);
                oldbuzzes.shift();
                oldbuzzes.unshift(combined);
            } else {
                oldbuzzes.unshift(addolddrinks);
            }
        } else {
            oldbuzzes.unshift(addolddrinks);
        }
        oldbuzzes.sort((a, b) => new Date(Date.parse(b[0].dateCreated)).getTime() - new Date(Date.parse(a[0].dateCreated)).getTime());
        await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzes), () => { this.setState({ oldbuzzes: oldbuzzes }) })
        this.refreshVals()
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

    async undoLastDrink() {
        if (Functions.singleDuration(this.state.oldbuzzes[0][0].dateCreated) < 0.0333333) {
            ReactNativeHaptic.generate('selection')
            var undobuzz;
            await AsyncStorage.getItem(oldkey, (error, result) => {
                if (result !== null && result !== "[]") {
                    undobuzz = JSON.parse(result);
                    if (undobuzz.length === 1 && undobuzz[0].length === 1) {
                        undobuzz = null
                    } else {
                        undobuzz[0].shift();
                    }
                    this.setState({ oldbuzzes: undobuzz })
                }
            })
            undobuzz === null ? await AsyncStorage.removeItem(oldkey) : await AsyncStorage.setItem(oldkey, JSON.stringify(undobuzz))
        }
        this.refreshVals()
    }

    checkLastDrink() {
        if (Functions.singleDuration(this.state.oldbuzzes[0][0].dateCreated) < 0.0333333) { return true }
        else { return false }
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
        const LabelWeek = ({ x, y, bandwidth, data }) => (data.map((value, index) => (
            <G key={index}><TextSVG x={x(index) + (bandwidth / 2)} y={y(value) - (addButtonSize === "tablet" ? 20 : 10)} fontSize={addButtonSize === "tablet" ? 40 : 20} fill={'black'}
                alignmentBaseline={'middle'} textAnchor={'middle'}>{value}</TextSVG>
                {(this.state.gender === "Male" && value > 10 || this.state.gender === "Female") &&
                    <Line x1={x(index) + 3} y1={y(this.state.gender === "Male" ? 14 : 7)} x2={bandwidth + 13} y2={y(this.state.gender === "Male" ? 14 : 7)}
                        strokeWidth={3} strokeOpacity={0.3} strokeDasharray={[8, 6]} strokeLinecap={"round"} stroke={"#000000"} />}</G>)))
        const LabelMonth = ({ x, y, bandwidth, data }) => (data.map((value, index) => (
            <G key={index}><TextSVG x={x(index) + (bandwidth / 2)} y={y(value) - (addButtonSize === "tablet" ? 20 : 10)} fontSize={addButtonSize === "tablet" ? 40 : 20} fill={'black'}
                alignmentBaseline={'middle'} textAnchor={'middle'}>{value}</TextSVG>
                {(this.state.gender === "Male" && value > 45 || this.state.gender === "Female" && value > 17) &&
                    <Line x1={x(index) + 3} y1={y(this.state.gender === "Male" ? 56 : 28)} x2={bandwidth + 13} y2={y(this.state.gender === "Male" ? 56 : 28)}
                        strokeWidth={3} strokeOpacity={0.3} strokeDasharray={[8, 6]} strokeLinecap={"round"} stroke={"#000000"} />}</G>)))
        const WeeksLabels = ({ x, y, data }) => (data.map((value, index) => (
            <TextSVG key={index} x={x(index)} y={y(value) - (addButtonSize === "tablet" ? 30 : 20)} fontSize={addButtonSize === "tablet" ? 32 : 18} fill={'black'} alignmentBaseline={'middle'}
                textAnchor={'middle'}>{value}</TextSVG>)))
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} onDidFocus={() => ReactNativeHaptic.generate('impactLight')} />
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
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <ScrollView horizontal={true} ref={(ref) => { this.sidescroll = ref }}>
                        <View style={styles.scrollCard}>
                            <Text style={{ fontSize: 20, fontWeight: "400", textAlign: "center", color: "#000000" }}>Standard Drinks</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                <View style={{ flexDirection: 'column', paddingLeft: 10, paddingBottom: 10, paddingRight: 10 }}>
                                    <BarChart style={{ flex: 1, paddingLeft: 10, paddingBottom: 10, paddingRight: 10, height: addButtonSize === "tablet" ? 400 : 160, width: barChartWidth }} data={values[5]}
                                        svg={{ fill: values[3][0], fillOpacity: values[3][0] === "#ffeb00" ? 0.5 : 0.8 }} spacing={addButtonSize === "tablet" ? 4 : 2} gridMin={0}
                                        contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }} gridMax={values[5][0] + 3} animate={true} animationDuration={1500}>
                                        <XAxis style={{ marginTop: 10 }} data={values[5]} scale={scale.scaleBand} formatLabel={() => ""} />
                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                        <LabelWeek />
                                    </BarChart>
                                    <Text style={{ color: "#000000", fontSize: abvText - 2, textAlign: "center" }}>Total Last Week</Text>
                                </View>
                                <View style={{ flexDirection: 'column', paddingLeft: 5, paddingRight: 10, paddingBottom: 10 }}>
                                    <BarChart style={{ flex: 1, paddingLeft: 10, paddingBottom: 10, paddingRight: 10, height: addButtonSize === "tablet" ? 400 : 160, width: barChartWidth }} data={values[6]}
                                        svg={{ fill: values[4][0], fillOpacity: values[4][0] === "#ffeb00" ? 0.5 : 0.8 }} spacing={addButtonSize === "tablet" ? 4 : 2} gridMin={0}
                                        contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }} gridMax={values[6][0] + 10}>
                                        <XAxis style={{ marginTop: 10 }} data={values[6]} scale={scale.scaleBand} formatLabel={() => ""} />
                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                        <LabelMonth />
                                    </BarChart>
                                    <Text style={{ color: "#000000", fontSize: abvText - 2, textAlign: "center" }}>Total Last Month</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                <Text style={{ color: "#000000", fontSize: abvText - 3, textAlign: "left", paddingLeft: 10, paddingRight: 10, paddingTop: addButtonSize === "tablet" ? 10 : 0 }}>
                                    <Text style={{ color: "#000000", color: values[3][0], fontWeight: "bold", fontSize: addButtonSize === "tablet" ? 40 : 25, opacity: values[3][0] === "#ffeb00" ? 0.5 : 0.8 }}>■ </Text>
                                    {values[3][1]}  <Text style={{ color: "#000000", color: values[4][0], fontWeight: "bold", fontSize: addButtonSize === "tablet" ? 40 : 25, opacity: values[4][0] === "#ffeb00" ? 0.5 : 0.8 }}>■ </Text>
                                    {values[4][1]}</Text>
                            </View>
                            <Text style={{ fontSize: addButtonSize === "tablet" ? 24 : 12, color: "#AE0000", textAlign: "center", paddingTop: addButtonSize === "tablet" ? 20 : 5 }}>*Based on CDC Maximum Recommended</Text>
                            <Text style={{ fontSize: addButtonSize === "tablet" ? 24 : 12, color: "#AE0000", textAlign: "center", paddingTop: addButtonSize === "tablet" ? 10 : 2 }}>and NIH Standard Drink Guidelines</Text>
                        </View>
                        {values[0].length > 1 &&
                            <View style={styles.scrollCard}>
                                <View style={{ flexDirection: 'column', padding: 10 }}>
                                    <LineChart style={{ height: addButtonSize === "tablet" ? 400 : 180, width: values[0].length * (addButtonSize === "tablet" ? 200 : 130) }} data={values[0]} gridMax={Math.max(...values[0]) + 6}
                                        svg={{ stroke: '#00897b', strokeWidth: 4, strokeOpacity: 0.8, strokeLinecap: "round" }}
                                        contentInset={{ top: 25, bottom: 10, left: 20, right: 20 }} numberOfTicks={8} gridMin={0} horizontal={true}>
                                        <XAxis style={{ height: 30, width: values[0].length * (addButtonSize === "tablet" ? 200 : 130) }} data={values[0]} contentInset={{ left: 30, right: 40 }}
                                            formatLabel={(index) => index === 0 ? "Last Week" : index === 1 ? "1 Week Ago" : (index) + " Weeks Ago"}
                                            svg={{ fontSize: 12 }} belowChart={true} ticks={4} />
                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                        <WeeksLabels />
                                    </LineChart>
                                    <LineChart
                                        style={{ position: "absolute", height: addButtonSize === "tablet" ? 400 : 200, width: values[0].length * (addButtonSize === "tablet" ? 200 : 130), left: 10, top: 10 }} gridMin={0}
                                        data={values[1]} contentInset={{ top: 25, bottom: 10, left: 5, right: 5 }} numberOfTicks={values[0].length}
                                        svg={{ stroke: "#AE0000", strokeWidth: 3, strokeOpacity: 0.3, strokeDasharray: [8, 6], strokeLinecap: "round" }}
                                        gridMax={Math.max(...values[0]) + 6} horizontal={true}>
                                    </LineChart>
                                    <LineChart
                                        style={{ position: "absolute", height: addButtonSize === "tablet" ? 400 : 200, width: values[0].length * (addButtonSize === "tablet" ? 200 : 130), left: 10, top: 10 }} gridMin={0}
                                        data={values[9]} contentInset={{ top: 25, bottom: 10, left: 5, right: 5 }} numberOfTicks={values[0].length}
                                        svg={{ stroke: "#000000", strokeWidth: 3, strokeOpacity: 0.3, strokeDasharray: [16, 8], strokeLinecap: "round" }}
                                        gridMax={Math.max(...values[0]) + 6} horizontal={true}>
                                    </LineChart>
                                    <Text style={{ color: "#000000", fontSize: addButtonSize === "tablet" ? 28 : 14, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#000000", color: "#00897b", fontWeight: "bold", fontSize: addButtonSize === "tablet" ? 40 : 25, opacity: 0.8 }}>- </Text>Historical Weekly Totals</Text>
                                    <Text style={{ color: "#000000", fontSize: addButtonSize === "tablet" ? 28 : 14, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#000000", color: "#AE0000", fontWeight: "bold", fontSize: addButtonSize === "tablet" ? 40 : 25, opacity: 0.3 }}>- </Text>CDC Max Recommended - {this.state.oldbuzzes !== null && values[2]} ({this.state.gender})</Text>
                                    <Text style={{ color: "#000000", fontSize: addButtonSize === "tablet" ? 28 : 14, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#000000", color: "#000000", fontWeight: "bold", fontSize: addButtonSize === "tablet" ? 40 : 25, opacity: 0.3 }}>- </Text>Weekly Average - {this.state.oldbuzzes !== null && values[9][0].toFixed(1)} Drinks</Text>
                                </View>
                            </View>}
                    </ScrollView>
                    {values[0].length > 1 && <View style={[styles.buzzInfo, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                        <Text style={{ color: "#000000", fontSize: loginButtonText }}>Week/Month</Text>
                        <View style={{ padding: addButtonSize === "tablet" ? 10 : 0 }}>
                            {/* Add Android scale sizing */}
                            <Switch style={addButtonSize === "tablet" ? { transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] } : { padding: 0 }} ios_backgroundColor={"#4db6ac"} trackColor={{ true: "#4db6ac", false: "#4db6ac" }} value={this.state.chartswitch} onChange={() => this.chartSwitch()} />
                        </View>
                        <Text style={{ color: "#000000", fontSize: loginButtonText }}>Cumulative</Text>
                    </View>}
                    <View style={styles.cardView}>
                        <View style={[styles.multiSwitchViews, { paddingBottom: 13, flexDirection: "row", justifyContent: "space-between" }]}>
                            <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.alcswitch = ref }}
                                containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value, this.state.metric)[0], oz: Functions.setAlcType(alcValues[number].value, this.state.metric)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
                                <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍺</Text>
                                <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍷</Text>
                                <Text style={{ color: "#000000", fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                <Text style={{ color: "#000000", fontSize: alcTypeText }}>🍹</Text>
                            </MultiSwitch>
                            {this.state.oldbuzzes !== null && this.state.oldbuzzes[0].length >= 1 && this.checkLastDrink() === true &&
                                <TouchableOpacity style={[styles.dropShadow, addButtonSize === true ? styles.smallUndoButton : addButtonSize === false ? styles.undoButton : styles.largeUndoButton]} onPress={() => this.undoLastDrink()}>
                                    <View><Text style={{ color: "#000000", fontSize: alcTypeText === 40 ? 35 : alcTypeText }}>↩️</Text></View></TouchableOpacity>}
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
                            <TouchableOpacity onPress={() => this.addOldDrink()} style={addButtonSize === true ? [styles.dropShadow2, styles.smallAddButton] : addButtonSize === false ? [styles.dropShadow2, styles.addButton] : addButtonSize === "tablet" && screenWidth === 2048 && screenHeight === 2732 ? [styles.dropShadow2, styles.xlargeAddButton] : [styles.dropShadow2, styles.largeAddButton]}>
                                <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                        </View>
                    </View>
                    {this.state.oldbuzzes !== null && <View style={styles.buzzCard}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10, padding: 5 }}>
                            <Text style={{ color: "#000000", fontSize: loginTitle, textAlign: "center", padding: 10 }}>Drink History</Text>
                            <TouchableOpacity style={[styles.dropShadow1, styles.buzzbutton]} onPress={() => this.showHideBuzzes("showHideOldBuzzes")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showHideOldBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.dropShadow, addButtonSize === "tablet" ? styles.largeplusminusButton : styles.plusMinusButtons, { marginTop: 5 }]} onPress={() => this.addOldModal()}><Text style={addButtonSize === "tablet" ? styles.largeButtonText : styles.buttonText}>+</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideOldBuzzes === true && <View>{oldbuzzes}</View>}
                    </View>}
                    {this.state.oldbuzzes === null && <View style={styles.buzzInfo}>
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

export default BuzzScreen;