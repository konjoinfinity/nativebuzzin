import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Platform, Switch, Modal, TextInput, Dimensions, Keyboard, Vibration } from 'react-native';
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
import MatCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    key, oldkey, loginTitle, loginButtonText, abvText, genderkey, barChartWidth, scrollToAmt, shotsStyle, alcTypeSize, alcValues,
    multiSwitchMargin, alcTypeText, abvSize, beerActive, abvLiquorSize, abvLiquorText, activeStyle, addButtonSize, addButtonText,
    abvWineSize, abvWineText
} from "./Variables";

var values;
(async () => { values = await Functions.maxRecDrinks() })();

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null, oldbuzzes: null, timesince: null, showHideBuzzes: false, showHideOldBuzzes: false, gender: "",
            chartswitch: false, oldmodal: false, buzzmodal: false, alctype: "Beer", abv: 0.05, oz: 12, selectedOldBuzz: "", obid: "",
            selectedBuzz: "", buzzduration: 30, logmodal: false, log: "", textinputheight: 0, oldlogmodal: false, oldlog: "",
            position: "", oldposition: ""
        }
    };

    async componentDidMount() {
        values = await Functions.maxRecDrinks()
        await AsyncStorage.getItem(key, (error, result) => {
            result !== null && result !== "[]" ? this.setState({ buzzes: JSON.parse(result) }) : this.setState({ buzzes: null })
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) })
                setTimeout(() => {
                    var durations = Functions.timeSince(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes[this.state.oldbuzzes.length - 1].length - 1].dateCreated, "timesince")
                    this.setState({ timesince: `${durations[0]} ${durations[0] === 1 ? "day" : "days"}, ${durations[1]} ${durations[1] === 1 ? "hour" : "hours"}, ${durations[2]} ${durations[2] === 1 ? "minute" : "minutes"}, and ${durations[3]} ${durations[3] === 1 ? "second" : "seconds"}` })
                }, 200);
            } else { this.setState({ oldbuzzes: null }) }
        })
        await AsyncStorage.getItem(genderkey, (error, result) => { this.setState({ gender: JSON.parse(result) }) })
    }

    showHideBuzzes(statename) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }), () => setTimeout(() => {
            this.state[statename] === true ?
                this.scrolltop.scrollTo({ y: 400, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true })
        }, 500));
        Vibration.vibrate()
    }

    chartSwitch() {
        this.setState(prevState => ({ chartswitch: !prevState.chartswitch }))
        this.state.chartswitch === true ? this.sidescroll.scrollTo({ x: 0 }) : this.sidescroll.scrollTo({ x: scrollToAmt })
    }

    async deleteBuzz(buzz) {
        Vibration.vibrate()
        var filtered = this.state.buzzes.filter(deleted => deleted !== buzz)
        var reordered = filtered.map((buzz) => { return buzz })
        await AsyncStorage.setItem(key, JSON.stringify(filtered), () => { this.setState({ buzzes: filtered }) })
        this.setState({ selectedBuzz: reordered })
        values = await Functions.maxRecDrinks()
    }

    async editBuzz() {
        Vibration.vibrate()
        var delayTime = new Date();
        delayTime.setMinutes(delayTime.getMinutes() - this.state.buzzduration)
        var breverse = this.state.buzzes
        breverse.unshift({ drinkType: this.state.alctype, dateCreated: delayTime, oz: this.state.oz, abv: this.state.abv })
        breverse.sort((a, b) => new Date(Date.parse(a.dateCreated)).getTime() - new Date(Date.parse(b.dateCreated)).getTime());
        await AsyncStorage.setItem(key, JSON.stringify(breverse), () => { this.setState({ buzzes: breverse }) })
        this.setState({ selectedBuzz: breverse })
        values = await Functions.maxRecDrinks()
    }

    async deleteOldBuzz(obid, oldbuzz) {
        Vibration.vibrate()
        var filtered = this.state.oldbuzzes.map((oldbuzzes) => { return oldbuzzes.filter(buzz => buzz !== oldbuzz) })
        await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => { this.setState({ oldbuzzes: filtered }) })
        // Will be able to remove Functions.reverseArray after buzz storage has been updated
        var reordered = Functions.reverseArray(filtered).map((buzz) => { return buzz })
        this.setState({ selectedOldBuzz: reordered[obid], obid: [obid] })
        values = await Functions.maxRecDrinks()
    }

    // This method could be cleaner
    async editOldBuzz(obid) {
        Vibration.vibrate()
        // Will be able to remove both Functions.reverseArray methods after buzz storage has been updated
        var obreverse = Functions.reverseArray(this.state.oldbuzzes).map((buzz) => { return Functions.reverseArray(buzz) })
        var lastTime = new Date(Date.parse(obreverse[obid][0].dateCreated))
        lastTime.setHours(0, 0, 0, 0)
        obreverse[obid].unshift({ drinkType: this.state.alctype, dateCreated: lastTime, oz: this.state.oz, abv: this.state.abv })
        // Will be able to remove both Functions.reverseArray methods after buzz storage has been updated
        var obnormal = Functions.reverseArray(obreverse).map((buzz) => { return Functions.reverseArray(buzz) })
        await AsyncStorage.setItem(oldkey, JSON.stringify(obnormal), () => { this.setState({ oldbuzzes: obnormal }) })
        // Will be able to remove Functions.reverseArray after buzz storage has been updated
        var reorder = Functions.reverseArray(obnormal).map((buzz) => { return buzz })
        this.setState({ selectedOldBuzz: reorder[obid], obid: [obid] })
        values = await Functions.maxRecDrinks()
    }

    // combine modal handles to one function
    oldModal(buzz, obid) {
        Vibration.vibrate()
        this.setState({ oldmodal: !this.state.oldmodal, selectedOldBuzz: buzz, obid: obid });
    }

    closeOldModal() {
        Vibration.vibrate()
        this.setState({ oldmodal: !this.state.oldmodal, selectedOldBuzz: "", obid: "" });
    }

    buzzModal() {
        Vibration.vibrate()
        this.setState({ buzzmodal: !this.state.buzzmodal, selectedBuzz: this.state.buzzes });
    }

    closeBuzzModal() {
        Vibration.vibrate()
        this.setState({ buzzmodal: !this.state.buzzmodal, selectedBuzz: "" });
    }

    buzzDuration(incdec) {
        Vibration.vibrate()
        if (incdec === "up" && this.state.buzzduration >= 15 && this.state.buzzduration < 240) {
            this.setState({ buzzduration: this.state.buzzduration + 15 })
        } else if (incdec === "down" && this.state.buzzduration > 15 && this.state.buzzduration <= 240) {
            this.setState({ buzzduration: this.state.buzzduration - 15 })
        }
    }

    async addLog() {
        Vibration.vibrate()
        if (this.state.log !== "") {
            if (this.state.buzzes[0].log) {
                this.state.buzzes[0].log.unshift({ entry: this.state.log })
            } else {
                this.state.buzzes[0].log = [{ entry: this.state.log }]
            }
            this.setState({ log: "", logmodal: false })
            await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
        } else {
            Alert.alert("Please Enter a Note")
        }
    }

    async addOldLog() {
        Vibration.vibrate();
        var oldbuzzes = Functions.reverseArray(this.state.oldbuzzes).map((buzz) => { return Functions.reverseArray(buzz) })
        var position = this.state.position === "" ? 0 : this.state.position
        if (this.state.oldlog !== "") {
            if (oldbuzzes[position][0].log) {
                oldbuzzes[position][0].log.unshift({ entry: this.state.oldlog })
            } else {
                oldbuzzes[position][0].log = [{ entry: this.state.oldlog }]
            }
            this.setState({ oldlog: "", oldlogmodal: false, position: "" })
            oldbuzzes = Functions.reverseArray(oldbuzzes).map((buzz) => { return Functions.reverseArray(buzz) })
            await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzes))
        } else {
            Alert.alert("Please Enter a Note")
        }
    }

    render() {
        let buzzes, oldbuzzes, selectedbuzz, selectedoldbuzz, logentries;
        // Will be able to remove Functions.reverseArray after buzz storage has been updated
        this.state.buzzes !== null && (buzzes = Functions.reverseArray(this.state.buzzes).map((buzz, id) => {
            return (<View key={id}>
                {id === 0 && <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}><TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.setState({ logmodal: true })}><MatCommIcon name="file-document-edit-outline" color="#ffffff" size={18} /></TouchableOpacity><Text style={{ fontSize: abvText, padding: 10, textAlign: "center" }}>Date: {moment(buzz.dateCreated).format('ddd MMM Do YYYY')}</Text><TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.buzzModal(buzz, id)}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>}
                <View style={styles.buzzMap}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                </View></View>
            )
        }))
        // Will be able to remove Functions.reverseArray after buzz storage has been updated
        this.state.oldbuzzes !== null && (oldbuzzes = Functions.reverseArray(this.state.oldbuzzes).map((buzz, obid) => {
            return Functions.reverseArray(buzz).map((oldbuzz, id) => {
                return (<View key={id}>
                    {id === 0 && <View style={{ flexDirection: "row", justifyContent: "space-around" }}><TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.setState({ oldlogmodal: true, position: obid })}><MatCommIcon name="file-document-edit-outline" color="#ffffff" size={18} /></TouchableOpacity><Text style={{ fontSize: abvText, padding: 10, textAlign: "center" }}>Date: {moment(buzz.dateCreated).format('ddd MMM Do YYYY')}</Text><TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.oldModal(buzz, obid)}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>}
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                        <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{oldbuzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: abvText, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: abvText, padding: 5 }}>{new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ?
                                moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY') : moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    </View></View>
                )
            })
        }))
        // Will be able to remove Functions.reverseArray after buzz storage has been updated
        this.state.selectedBuzz !== "" && (selectedbuzz = Functions.reverseArray(this.state.selectedBuzz).map((buzz, id) => {
            return (<View key={id}>
                {id === 0 && <Text style={{ fontSize: abvText, padding: 10, textAlign: "center" }}>Session Date: {moment(buzz.dateCreated).format('ddd MMM Do YYYY')}</Text>}
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: 16, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    {this.state.selectedBuzz.length >= 2 && <TouchableOpacity style={styles.buzzheaderButton} onPress={() => this.deleteBuzz(buzz)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>}</View>
            </View>
            )
        }))
        // Will be able to remove Functions.reverseArray after buzz storage has been updated
        this.state.selectedOldBuzz !== "" && (selectedoldbuzz = Functions.reverseArray(this.state.selectedOldBuzz).map((oldbuzz, id) => {
            return (<View key={id}>
                {id === 0 && <Text style={{ fontSize: abvText, padding: 10, textAlign: "center" }}>Session Date: {moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY')}</Text>}
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{oldbuzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: 16, padding: 5 }}>
                            {new Date(Date.parse(oldbuzz.dateCreated)).getMilliseconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getMinutes() === 0 && new Date(Date.parse(oldbuzz.dateCreated)).getSeconds() === 0 ?
                                moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY') : moment(oldbuzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    {this.state.selectedOldBuzz.length >= 2 && <TouchableOpacity style={styles.buzzheaderButton} onPress={() => this.deleteOldBuzz(this.state.obid, oldbuzz)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>}</View>
            </View>
            )
        }))
        var buzzarr, buzzarrfiltered;
        this.state.oldbuzzes && this.state.oldbuzzes.length > 0 && (buzzarr = this.state.oldbuzzes.reduce((acc, val) => acc.concat(val), []))
        this.state.oldbuzzes && this.state.oldbuzzes.length > 0 && (buzzarrfiltered = Functions.reverseArray(buzzarr).filter(logs => logs.log))
        // Should do the same thing for buzzes, just in case position [0] drink object changes mid session
        this.state.oldbuzzes && this.state.oldbuzzes.length > 0 && buzzarrfiltered.length > 0 && (logentries = buzzarrfiltered.map((buzz, id) => {
            return (<View key={id} style={styles.buzzLog}>
                {buzz.log.map((logs, id) => {
                    return (<Text key={id} style={{ fontSize: 18, textAlign: "center", padding: 10 }}>{logs.entry}</Text>)
                })}
                <Text style={{ fontSize: 14, padding: 2, textAlign: "center" }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY')}</Text>
            </View>
            )
        }))
        const LabelWeek = ({ x, y, bandwidth, data }) => (data.map((value, index) => (
            <G key={index}><TextSVG x={x(index) + (bandwidth / 2)} y={y(value) - 10} fontSize={20} fill={'black'}
                alignmentBaseline={'middle'} textAnchor={'middle'}>{value}</TextSVG>
                {(this.state.gender === "Male" && value > 10 || this.state.gender === "Female") &&
                    <Line x1={x(index) + 3} y1={y(this.state.gender === "Male" ? 14 : 7)} x2={bandwidth + 13} y2={y(this.state.gender === "Male" ? 14 : 7)}
                        strokeWidth={3} strokeOpacity={0.3} strokeDasharray={[8, 6]} strokeLinecap={"round"} stroke={"#000000"} />}</G>)))
        const LabelMonth = ({ x, y, bandwidth, data }) => (data.map((value, index) => (
            <G key={index}><TextSVG x={x(index) + (bandwidth / 2)} y={y(value) - 10} fontSize={20} fill={'black'}
                alignmentBaseline={'middle'} textAnchor={'middle'}>{value}</TextSVG>
                {(this.state.gender === "Male" && value > 45 || this.state.gender === "Female" && value > 17) &&
                    <Line x1={x(index) + 3} y1={y(this.state.gender === "Male" ? 56 : 28)} x2={bandwidth + 13} y2={y(this.state.gender === "Male" ? 56 : 28)}
                        strokeWidth={3} strokeOpacity={0.3} strokeDasharray={[8, 6]} strokeLinecap={"round"} stroke={"#000000"} />}</G>)))
        const WeeksLabels = ({ x, y, data }) => (data.map((value, index) => (
            <TextSVG key={index} x={x(index)} y={y(value) - 20} fontSize={18} fill={'black'} alignmentBaseline={'middle'}
                textAnchor={'middle'}>{value}</TextSVG>)))
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} onDidFocus={() => Vibration.vibrate()} />
                <Modal animationType="fade" transparent={true} visible={this.state.logmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.5 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 10, margin: 10 }}>Add Log Entry</Text>
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "center", fontSize: loginButtonText, height: Math.max(50, this.state.textinputheight) }}
                                placeholder="" autoFocus={true} returnKeyType={"default"} blurOnSubmit={true} value={this.state.log}
                                onChangeText={(log) => this.setState({ log })} onSubmitEditing={() => Keyboard.dismiss()} multiline={true}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.setState({ log: "", logmodal: false })}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.addLog()}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="fade" transparent={true} visible={this.state.oldlogmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.5 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 10, margin: 10 }}>Add Log Entry</Text>
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "center", fontSize: loginButtonText, height: Math.max(50, this.state.textinputheight) }}
                                placeholder="" autoFocus={true} returnKeyType={"default"} blurOnSubmit={true} value={this.state.oldlog}
                                onChangeText={(oldlog) => this.setState({ oldlog })} onSubmitEditing={() => Keyboard.dismiss()} multiline={true}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.setState({ oldlog: "", oldlogmodal: false, position: "" })}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.addOldLog()}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide" transparent={false} visible={this.state.oldmodal}>
                    <ScrollView>
                        <View style={[styles.cardView, { marginTop: 30 }]}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>Edit Old Buzz</Text>
                            {selectedoldbuzz}
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
                                <TouchableOpacity onPress={() => this.editOldBuzz(this.state.obid)} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                    <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                            </View>
                            <Text style={styles.profileLine}>___________________________________________</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={styles.buzzbutton} onPress={() => this.closeOldModal()}>
                                    <Text style={styles.buttonText}>Done</Text>
                                </TouchableOpacity></View>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal animationType="slide" transparent={false} visible={this.state.buzzmodal}>
                    <ScrollView>
                        <View style={[styles.cardView, { marginTop: 30 }]}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>Edit Current Buzz</Text>
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
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.buzzduration === 15 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.buzzDuration("down")}>
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
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <ScrollView horizontal={true} ref={(ref) => { this.sidescroll = ref }}>
                        <View style={styles.scrollCard}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                <View style={{ flexDirection: 'column', padding: 10 }}>
                                    <BarChart style={{ flex: 1, padding: 10, height: 200, width: barChartWidth }} data={values[5]}
                                        svg={{ fill: values[3][0], fillOpacity: values[3][0] === "#ffeb00" ? 0.5 : 0.8 }} spacing={2} gridMin={0}
                                        contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }} gridMax={values[5][0] + 3} animate={true} animationDuration={1500}>
                                        <XAxis style={{ marginTop: 10 }} data={values[5]} scale={scale.scaleBand} formatLabel={() => ""} />
                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                        <LabelWeek />
                                    </BarChart>
                                    <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Total Last Week</Text>
                                </View>
                                <View style={{ flexDirection: 'column', paddingLeft: 5, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
                                    <BarChart style={{ flex: 1, padding: 10, height: 200, width: barChartWidth }} data={values[6]}
                                        svg={{ fill: values[4][0], fillOpacity: values[4][0] === "#ffeb00" ? 0.5 : 0.8 }} spacing={2} gridMin={0}
                                        contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }} gridMax={values[6][0] + 10}>
                                        <XAxis style={{ marginTop: 10 }} data={values[6]} scale={scale.scaleBand} formatLabel={() => ""} />
                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                        <LabelMonth />
                                    </BarChart>
                                    <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Total Last Month</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                <Text style={{ fontSize: abvText, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}>
                                    <Text style={{ color: values[3][0], fontWeight: "bold", fontSize: 25, opacity: values[3][0] === "#ffeb00" ? 0.5 : 0.8 }}>■ </Text>
                                    {values[3][1]}  <Text style={{ color: values[4][0], fontWeight: "bold", fontSize: 25, opacity: values[4][0] === "#ffeb00" ? 0.5 : 0.8 }}>■ </Text>
                                    {values[4][1]}</Text>
                            </View>
                        </View>
                        {values[0].length > 1 &&
                            <View style={styles.scrollCard}>
                                <View style={{ flexDirection: 'column', padding: 10 }}>
                                    <LineChart style={{ height: 200, width: values[0].length * 130 }} data={values[0]} gridMax={Math.max(...values[0]) + 6}
                                        svg={{ stroke: '#00897b', strokeWidth: 4, strokeOpacity: 0.8, strokeLinecap: "round" }}
                                        contentInset={{ top: 25, bottom: 10, left: 20, right: 20 }} numberOfTicks={8} gridMin={0} horizontal={true}>
                                        <XAxis style={{ height: 30, width: values[0].length * 130 }} data={values[0]} contentInset={{ left: 30, right: 40 }}
                                            formatLabel={(index) => index === 0 ? "Last Week" : index === 1 ? "1 Week Ago" : (index) + " Weeks Ago"}
                                            svg={{ fontSize: 12 }} belowChart={true} ticks={4} />
                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                        <WeeksLabels />
                                    </LineChart>
                                    <LineChart
                                        style={{ position: "absolute", height: 200, width: values[0].length * 130, left: 10, top: 10 }} gridMin={0}
                                        data={values[1]} contentInset={{ top: 25, bottom: 10, left: 5, right: 5 }} numberOfTicks={values[0].length}
                                        svg={{ stroke: "#AE0000", strokeWidth: 3, strokeOpacity: 0.3, strokeDasharray: [8, 6], strokeLinecap: "round" }}
                                        gridMax={Math.max(...values[0]) + 6} horizontal={true}>
                                    </LineChart>
                                    <LineChart
                                        style={{ position: "absolute", height: 200, width: values[0].length * 130, left: 10, top: 10 }} gridMin={0}
                                        data={values[9]} contentInset={{ top: 25, bottom: 10, left: 5, right: 5 }} numberOfTicks={values[0].length}
                                        svg={{ stroke: "#000000", strokeWidth: 3, strokeOpacity: 0.3, strokeDasharray: [16, 8], strokeLinecap: "round" }}
                                        gridMax={Math.max(...values[0]) + 6} horizontal={true}>
                                    </LineChart>
                                    <Text style={{ fontSize: 14, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#00897b", fontWeight: "bold", fontSize: 25, opacity: 0.8 }}>- </Text>Historical Weekly Totals</Text>
                                    <Text style={{ fontSize: 14, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#AE0000", fontWeight: "bold", fontSize: 25, opacity: 0.3 }}>- </Text>Max Recommended - {this.state.oldbuzzes !== null && values[2]} ({this.state.gender})</Text>
                                    <Text style={{ fontSize: 14, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#000000", fontWeight: "bold", fontSize: 25, opacity: 0.3 }}>- </Text>Weekly Average - {this.state.oldbuzzes !== null && values[9][0]} Drinks</Text>
                                </View>
                            </View>}
                    </ScrollView>
                    {values[0].length > 1 && <View style={[styles.buzzInfo, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                        <Text style={{ fontSize: loginButtonText }}>Bar Charts</Text>
                        <Switch value={this.state.chartswitch} onChange={() => this.chartSwitch()} />
                        <Text style={{ fontSize: loginButtonText }}>Line Chart</Text>
                    </View>}
                    {this.state.buzzes !== null && <View style={styles.buzzCard}>
                        <View style={styles.buzzView}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>Current Buzz</Text>
                            <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes("showHideBuzzes")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showHideBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideBuzzes === true && <View>{buzzes}</View>}
                    </View>}
                    {this.state.buzzes === null && <View style={styles.buzzInfo}>
                        <Text style={{ fontSize: loginTitle, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                        {this.state.timesince !== null && <View>
                            <Text style={{ fontSize: loginButtonText, textAlign: "center", paddingBottom: 10 }}>It's been: <Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink.</Text>
                            <Text style={{ fontSize: loginButtonText, textAlign: "center", paddingBottom: 10 }}>You haven't had any drinks.</Text></View>}
                    </View>}
                    {this.state.oldbuzzes !== null && <View style={styles.buzzCard}>
                        <View style={styles.buzzView}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>Old Buzzes</Text>
                            <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes("showHideOldBuzzes")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showHideOldBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideOldBuzzes === true && <View>{oldbuzzes}</View>}
                    </View>}
                    {this.state.oldbuzzes === null && <View style={styles.buzzInfo}>
                        <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                    </View>}
                    {(this.state.buzzes && this.state.buzzes.length > 0) && this.state.buzzes[0].log &&
                        <View style={styles.buzzCard}>
                            <Text style={{ fontSize: 24, textAlign: "center", padding: 10 }}>Current Log</Text>
                            {this.state.buzzes[0].log.length > 0 && this.state.buzzes[0].log.map((entries, id) => {
                                return (<View key={id} style={styles.buzzLog}>
                                    <Text style={{ fontSize: 18, textAlign: "center", padding: 10 }}>{entries.entry}</Text>
                                    <Text style={{ fontSize: 14, padding: 2, textAlign: "center" }}>{moment(this.state.buzzes[0].dateCreated).format('ddd MMM Do YYYY')}</Text>
                                </View>
                                )
                            })}
                        </View>}
                    {this.state.oldbuzzes && logentries !== undefined &&
                        <View style={styles.buzzCard}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}><Text style={{ fontSize: 24, textAlign: "center", padding: 10 }}>Running Log</Text><TouchableOpacity style={styles.plusMinusButtons} onPress={() => this.setState({ oldlogmodal: true })}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>
                            {logentries}
                        </View>}
                </ScrollView>
            </View >
        );
    }
}

export default BuzzScreen;