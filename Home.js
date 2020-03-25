import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Modal, Platform, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { NavigationEvents } from "react-navigation";
import moment from "moment";
import { Functions } from "./Functions";
import styles from "./Styles"
import ReactNativeHaptic from 'react-native-haptic';
import Micon from 'react-native-vector-icons/MaterialCommunityIcons'
import CalendarPicker from 'react-native-calendar-picker';
import Slider from '@react-native-community/slider';
import {
    alcTypeSize, alcTypeText, abvText, abvWineText, abvLiquorText, abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues,
    activeStyle, namekey, genderkey, oldkey, autobreakkey, happyhourkey, autobreakthresholdkey, limitbackey, limitkey, drinkskey, custombreakkey,
    hhhourkey, indefbreakkey, loginButtonText, pacertimekey, shotsStyle, loginTitle, lastcallkey, limithourkey, maxreckey, warningkey, screenHeight,
    screenWidth
} from "./Variables";

const CopilotView = walkthroughable(View);

var maxRecValues;
(async () => { maxRecValues = await Functions.maxRecDrinks() })();

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", gender: "", buzzes: [], oldbuzzes: [], alctype: "Beer", oz: 12, abv: 0.05, countdown: false,
            timer: "", break: "", breakdate: "", autobreak: "", focus: false, modal1: false, modal2: false, flashwarning: "#AE0000",
            flashtext: "", flashtimer: "", happyhour: "", happyhourtime: "", threshold: "", limit: "", limitbac: "", drinks: "",
            showlimit: false, hhhour: "", indefbreak: false, timesince: null, limitdate: "", pacer: "", pacertime: "", showpacer: false,
            selectedBuzz: "", buzzmodal: false, buzzduration: 30, lastcall: "", showlastcall: false, limithour: "", maxrec: "", warn: "",
            metric: "oz", showHideOldBuzzes: false, oldmodal: false, selectedOldBuzz: "", obid: "", position: "",
            oldposition: "", addoldmodal: false, addoldbuzzes: [], selectedStartDate: null, drinkadd: false
        }
    };

    async componentDidMount() {
        try {
            var values = await AsyncStorage.multiGet([autobreakkey, custombreakkey, indefbreakkey, limitbackey, limitkey, drinkskey, happyhourkey,
                autobreakthresholdkey, namekey, genderkey, hhhourkey, pacertimekey, lastcallkey, limithourkey, maxreckey, warningkey])
            this.setState({
                autobreak: JSON.parse(values[0][1]), custombreak: JSON.parse(values[1][1]), indefbreak: JSON.parse(values[2][1]),
                limitbac: JSON.parse(values[3][1]), limit: JSON.parse(values[4][1]), drinks: JSON.parse(values[5][1]),
                happyhour: JSON.parse(values[6][1]), threshold: JSON.parse(values[7][1]), name: JSON.parse(values[8][1]),
                gender: JSON.parse(values[9][1]), hhhour: JSON.parse(values[10][1]), pacertime: JSON.parse(values[11][1]),
                lastcall: JSON.parse(values[12][1]), limithour: JSON.parse(values[13][1]), maxrec: JSON.parse(values[14][1]),
                warn: JSON.parse(values[15][1])
            })
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
            maxRecValues = await Functions.maxRecDrinks()
        } catch (error) {
            console.log(error)
        }
    }

    handleModal(number) {
        try {
            ReactNativeHaptic.generate('selection')
            this.setState({ [number]: !this.state[number] });
        } catch (error) {
            console.log(error)
        }
    }

    async deleteOldBuzz(obid, oldbuzz) {
        try {
            ReactNativeHaptic.generate('selection')
            var filtered = this.state.oldbuzzes.map((oldbuzzes) => { return oldbuzzes.filter(buzz => buzz !== oldbuzz) })
            await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => { this.setState({ oldbuzzes: filtered, selectedOldBuzz: filtered[obid], obid: [obid] }) })
            values = await Functions.maxRecDrinks()
        } catch (error) {
            console.log(error)
        }
    }

    async editOldBuzz(obid) {
        try {
            ReactNativeHaptic.generate('selection')
            var obnormal = this.state.oldbuzzes
            var lastTime = new Date(Date.parse(obnormal[obid][0].dateCreated))
            lastTime.setHours(0, 0, 0, 0)
            obnormal[obid].unshift({ drinkType: this.state.alctype, dateCreated: lastTime, oz: this.state.oz, abv: this.state.abv })
            await AsyncStorage.setItem(oldkey, JSON.stringify(obnormal), () => { this.setState({ oldbuzzes: obnormal, selectedOldBuzz: obnormal[obid], obid: [obid] }) })
            values = await Functions.maxRecDrinks()
        } catch (error) {
            console.log(error)
        }
    }

    oldModal(buzz, obid) {
        try {
            ReactNativeHaptic.generate('selection')
            this.setState({ oldmodal: !this.state.oldmodal, selectedOldBuzz: buzz === "a" ? "" : buzz, obid: obid === "z" ? "" : obid });
        } catch (error) {
            console.log(error)
        }
    }

    addOldModal() {
        try {
            ReactNativeHaptic.generate('selection')
            this.setState({ addoldmodal: !this.state.addoldmodal, selectedStartDate: null, drinkadd: false, addoldbuzzes: [] });
        } catch (error) {
            console.log(error)
        }
    }

    addOldBuzzState() {
        try {
            ReactNativeHaptic.generate('selection')
            addoldbuzzes = this.state.addoldbuzzes
            var oldbuzzdate = new Date(this.state.selectedStartDate);
            oldbuzzdate.setHours(0, 0, 0, 0);
            addoldbuzzes.unshift({ drinkType: this.state.alctype, dateCreated: oldbuzzdate, oz: this.state.oz, abv: this.state.abv })
            this.setState({ addoldbuzzes: addoldbuzzes })
        } catch (error) {
            console.log(error)
        }
    }

    deleteAddOldBuzz(oldbuzz) {
        try {
            ReactNativeHaptic.generate('selection')
            var delfilter = this.state.addoldbuzzes.filter(deleted => deleted !== oldbuzz)
            this.setState({ addoldbuzzes: delfilter })
        } catch (error) {
            console.log(error)
        }
    }

    async addOldBuzz() {
        try {
            var oldbuzzes;
            ReactNativeHaptic.generate('selection')
            var oldbuzzadd = this.state.addoldbuzzes;
            this.state.oldbuzzes === null ? oldbuzzes = [] : oldbuzzes = this.state.oldbuzzes
            oldbuzzes.unshift(oldbuzzadd);
            oldbuzzes.sort((a, b) => new Date(Date.parse(b[0].dateCreated)).getTime() - new Date(Date.parse(a[0].dateCreated)).getTime());
            await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzes), () => { this.setState({ oldbuzzes: oldbuzzes }, () => { this.addOldModal() }) })
            if (this.state.showHideOldBuzzes === false) { this.showHideBuzzes("showHideOldBuzzes") }
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }
    }

    async deleteWholeOldBuzz() {
        try {
            var filtered = _.pull(this.state.oldbuzzes, this.state.oldbuzzes[this.state.obid]);
            await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => { this.setState({ oldbuzzes: filtered }) })
            this.oldModal("a", "z")
            if (this.state.oldbuzzes.length === 0) { this.setState({ timesince: null }, () => { this.showHideBuzzes("showHideOldBuzzes") }) }
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }
    }

    confirmDelete() {
        try {
            ReactNativeHaptic.generate('notificationWarning')
            Alert.alert('Are you sure you want to delete this entire session?', 'Please confirm.', [{ text: 'Yes', onPress: () => { this.deleteWholeOldBuzz() } }, { text: 'No' }], { cancelable: false });
        } catch (error) {
            console.log(error)
        }
    }

    showHideBuzzes(statename) {
        try {
            this.setState(prevState => ({ [statename]: !prevState[statename] }), () => setTimeout(() => { this.state[statename] === true ? this.scrolltop.scrollTo({ y: 400, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true }) }, 500));
            ReactNativeHaptic.generate('selection')
        } catch (error) {
            console.log(error)
        }
    }

    buzzDuration(incdec) {
        try {
            ReactNativeHaptic.generate('selection')
            if (incdec === "up" && this.state.buzzduration >= 5 && this.state.buzzduration < 120) { this.setState({ buzzduration: this.state.buzzduration + 5 }) }
            else if (incdec === "down" && this.state.buzzduration > 5 && this.state.buzzduration <= 120) { this.setState({ buzzduration: this.state.buzzduration - 5 }) }
        } catch (error) {
            console.log(error)
        }
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
                                                    <View style={styles.multiSwitch}>
                                                        {/* Beer */}
                                                        <Text style={{ color: "#000000", fontSize: abvText - 2, alignSelf: "center", fontWeight: "500", paddingTop: 2 }}>{this.state.abv}{this.state.abv === 0.1 ? "0" : ""} % ABV</Text>
                                                        <Slider style={{ width: Dimensions.get('window').width * 0.53, height: Dimensions.get('window').height * 0.065, alignSelf: "center" }}
                                                            minimumValue={0.032} step={0.01} maximumValue={0.18} minimumTrackTintColor="#80cbc4" maximumTrackTintColor="#00897b" value={this.state.abv}
                                                            onValueChange={(number) => { ReactNativeHaptic.generate('selection'); clearTimeout(this.sliderTimeoutId); this.sliderTimeoutId = setTimeout(() => { this.setState({ abv: parseFloat(number.toFixed(2)) }) }, 5) }} />
                                                    </View>
                                                </View>}
                                            {this.state.alctype === "Wine" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <View style={styles.multiSwitch}>
                                                        {/* Wine */}
                                                        <Text style={{ color: "#000000", fontSize: abvText - 2, alignSelf: "center", fontWeight: "500", paddingTop: 2 }}>{this.state.abv}{this.state.abv === 0.1 || this.state.abv === 0.2 ? "0" : ""} % ABV</Text>
                                                        <Slider style={{ width: Dimensions.get('window').width * 0.53, height: Dimensions.get('window').height * 0.065, alignSelf: "center" }}
                                                            minimumValue={0.09} step={0.01} maximumValue={0.25} minimumTrackTintColor="#80cbc4" maximumTrackTintColor="#00897b" value={this.state.abv}
                                                            onValueChange={(number) => { ReactNativeHaptic.generate('selection'); clearTimeout(this.sliderTimeoutId); this.sliderTimeoutId = setTimeout(() => { this.setState({ abv: parseFloat(number.toFixed(2)) }) }, 5) }} />
                                                    </View>
                                                </View>}
                                            {this.state.alctype === "Liquor" &&
                                                <View style={styles.multiSwitchViews}>
                                                    <View style={styles.multiSwitch}>
                                                        {/* Liquor */}
                                                        <Text style={{ color: "#000000", fontSize: abvText - 2, alignSelf: "center", fontWeight: "500", paddingTop: 2 }}>{this.state.abv}{this.state.abv === 0.2 || this.state.abv === 0.3 || this.state.abv === 0.4 || this.state.abv === 0.5 || this.state.abv === 0.6 || this.state.abv === 0.7 || this.state.abv === 0.8 || this.state.abv === 0.9 ? "0" : ""} % ABV</Text>
                                                        <Slider style={{ width: Dimensions.get('window').width * 0.53, height: Dimensions.get('window').height * 0.065, alignSelf: "center" }}
                                                            minimumValue={0.2} step={0.01} maximumValue={0.95} minimumTrackTintColor="#80cbc4" maximumTrackTintColor="#00897b" value={this.state.abv}
                                                            onValueChange={(number) => { ReactNativeHaptic.generate('selection'); clearTimeout(this.sliderTimeoutId); this.sliderTimeoutId = setTimeout(() => { this.setState({ abv: parseFloat(number.toFixed(2)) }) }, 5) }} />
                                                    </View>
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
                                                <View style={styles.multiSwitch}>
                                                    {/* Beer */}
                                                    <Text style={{ color: "#000000", fontSize: abvText - 2, alignSelf: "center", fontWeight: "500", paddingTop: 2 }}>{this.state.abv}{this.state.abv === 0.1 ? "0" : ""} % ABV</Text>
                                                    <Slider style={{ width: Dimensions.get('window').width * 0.53, height: Dimensions.get('window').height * 0.065, alignSelf: "center" }}
                                                        minimumValue={0.032} step={0.01} maximumValue={0.18} minimumTrackTintColor="#80cbc4" maximumTrackTintColor="#00897b" value={this.state.abv}
                                                        onValueChange={(number) => { ReactNativeHaptic.generate('selection'); clearTimeout(this.sliderTimeoutId); this.sliderTimeoutId = setTimeout(() => { this.setState({ abv: parseFloat(number.toFixed(2)) }) }, 5) }} />
                                                </View>
                                            </View>}
                                        {this.state.alctype === "Wine" &&
                                            <View style={styles.multiSwitchViews}>
                                                <View style={styles.multiSwitch}>
                                                    {/* Wine */}
                                                    <Text style={{ color: "#000000", fontSize: abvText - 2, alignSelf: "center", fontWeight: "500", paddingTop: 2 }}>{this.state.abv}{this.state.abv === 0.1 || this.state.abv === 0.2 ? "0" : ""} % ABV</Text>
                                                    <Slider style={{ width: Dimensions.get('window').width * 0.53, height: Dimensions.get('window').height * 0.065, alignSelf: "center" }}
                                                        minimumValue={0.09} step={0.01} maximumValue={0.25} minimumTrackTintColor="#80cbc4" maximumTrackTintColor="#00897b" value={this.state.abv}
                                                        onValueChange={(number) => { ReactNativeHaptic.generate('selection'); clearTimeout(this.sliderTimeoutId); this.sliderTimeoutId = setTimeout(() => { this.setState({ abv: parseFloat(number.toFixed(2)) }) }, 5) }} />
                                                </View>
                                            </View>}
                                        {this.state.alctype === "Liquor" &&
                                            <View style={styles.multiSwitchViews}>
                                                <View style={styles.multiSwitch}>
                                                    {/* Liquor */}
                                                    <Text style={{ color: "#000000", fontSize: abvText - 2, alignSelf: "center", fontWeight: "500", paddingTop: 2 }}>{this.state.abv}{this.state.abv === 0.2 || this.state.abv === 0.3 || this.state.abv === 0.4 || this.state.abv === 0.5 || this.state.abv === 0.6 || this.state.abv === 0.7 || this.state.abv === 0.8 || this.state.abv === 0.9 ? "0" : ""} % ABV</Text>
                                                    <Slider style={{ width: Dimensions.get('window').width * 0.53, height: Dimensions.get('window').height * 0.065, alignSelf: "center" }}
                                                        minimumValue={0.2} step={0.01} maximumValue={0.95} minimumTrackTintColor="#80cbc4" maximumTrackTintColor="#00897b" value={this.state.abv}
                                                        onValueChange={(number) => { ReactNativeHaptic.generate('selection'); clearTimeout(this.sliderTimeoutId); this.sliderTimeoutId = setTimeout(() => { this.setState({ abv: parseFloat(number.toFixed(2)) }) }, 5) }} />
                                                </View>
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
                <NavigationEvents onWillFocus={() => { ReactNativeHaptic.generate('impactLight'); this.componentDidMount() }} />
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