import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FloatingAction } from "react-native-floating-action";
import Speedometer from 'react-native-speedometer-chart';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { Dropdown } from 'react-native-material-dropdown';

const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const oldkey = "oldbuzzes"
const highkey = "highbac"

const actions = [
    {
        text: "+1 Beer",
        icon: require("./img/beer.png"),
        name: "Beer",
        position: 1,
        color: "#1de9b6",
        size: 80,
        textBackground: "#00796b",
        textColor: "#ffffff"
    },
    {
        text: "+1 Wine",
        icon: require("./img/wine.png"),
        name: "Wine",
        position: 2,
        color: "#1de9b6",
        size: 80,
        textBackground: "#00796b",
        textColor: "#ffffff"
    },
    {
        text: "+1 Liquor",
        icon: require("./img/liquor.png"),
        name: "Liquor",
        position: 3,
        color: "#1de9b6",
        size: 80,
        textBackground: "#00796b",
        textColor: "#ffffff"
    }
];

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
            refreshing: false,
            highbac: [],
            oldhighbac: [],
            alctype: "Beer"
        }
        this.addDrink = this.addDrink.bind(this);
        this.getBAC = this.getBAC.bind(this);
        this.checkBac = this.checkBac.bind(this);
        this.singleDuration = this.singleDuration.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getDayHourMin = this.getDayHourMin.bind(this);
        this.saveBuzz = this.saveBuzz.bind(this);
        this.clearDrinks = this.clearDrinks.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.moveToOld = this.moveToOld.bind(this);
    };

    async componentDidMount() {
        Vibration.vibrate();
        await AsyncStorage.getItem(namekey, (error, result) => {
            this.setState({ name: JSON.parse(result) })
        })
        await AsyncStorage.getItem(genderkey, (error, result) => {
            this.setState({ gender: JSON.parse(result) })
        })
        await AsyncStorage.getItem(weightkey, (error, result) => {
            this.setState({ weight: JSON.parse(result) })
        })
        await AsyncStorage.getItem(key, (error, result) => {
            if (result !== null) {
                this.setState({ buzzes: JSON.parse(result) })
            }
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null) {
                this.setState({ oldbuzzes: JSON.parse(result) })
            }
        })
        await AsyncStorage.getItem(highkey, (error, result) => {
            if (result !== null) {
                this.setState({ highbac: JSON.parse(result) })
            }
        })
        setTimeout(() => {
            this.checkBac();
        }, 200);
    }

    async onRefresh() {
        this.setState({ refreshing: true });
        await AsyncStorage.getItem(key, (error, result) => {
            if (result !== null) {
                this.setState({ buzzes: JSON.parse(result) })
            }
        })
        setTimeout(() => {
            this.checkBac()
            this.setState({ refreshing: false });
        }, 200);
    }

    getDayHourMin(date1, date2) {
        var dateDiff = date2 - date1;
        dateDiff = dateDiff / 1000;
        var seconds = Math.floor(dateDiff % 60);
        dateDiff = dateDiff / 60;
        var minutes = Math.floor(dateDiff % 60);
        dateDiff = dateDiff / 60;
        var hours = Math.floor(dateDiff % 24);
        var days = Math.floor(dateDiff / 24);
        return [days, hours, minutes, seconds];
    }

    singleDuration(initialbuzz) {
        var date1 = Date.parse(initialbuzz)
        var duration;
        var currentDate = new Date();
        var date2 = currentDate.getTime();
        var dayHourMin = this.getDayHourMin(date1, date2);
        var days = dayHourMin[0];
        var hours = dayHourMin[1];
        var minutes = dayHourMin[2];
        var seconds = dayHourMin[3];
        if (days >= 1) {
            hours = hours + days * 24;
        }
        if (hours == 0) {
            duration = minutes / 60 + seconds / 3600;
        } else {
            duration = hours + minutes / 60 + seconds / 3600;
        }
        return duration;
    }

    getBAC(weight, gender, drinks, drinkType, hours) {
        var distribution;
        if (gender == "Female") {
            distribution = 0.66;
        }
        if (gender == "Male") {
            distribution = 0.73;
        }
        var totalAlc;
        if (drinkType == "Beer") {
            totalAlc = 12 * drinks * 0.05;
        }
        if (drinkType == "Wine") {
            totalAlc = 5 * drinks * 0.12;
        }
        if (drinkType == "Liquor") {
            totalAlc = 1.5 * drinks * 0.4;
        }
        var bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
        return bac;
    }

    addDrink(drink) {
        Vibration.vibrate();
        var drinkDate = new Date();
        this.setState(prevState => ({ buzzes: [...prevState.buzzes, { drinkType: drink, dateCreated: drinkDate }] }))
        setTimeout(() => {
            if (this.state.buzzes.length >= 1) {
                this.checkBac();
            }
        }, 100);
    }

    async saveBuzz() {
        await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
    }

    async checkBac() {
        Vibration.vibrate();
        if (this.state.buzzes.length >= 1) {
            var duration = this.singleDuration(this.state.buzzes[0].dateCreated);
            var totalBac = this.getBAC(
                this.state.weight,
                this.state.gender,
                this.state.buzzes.length,
                this.state.buzzes[0].drinkType,
                duration
            );
            if (totalBac > 0) {
                totalBac = parseFloat(totalBac.toFixed(6));
                this.setState({ bac: totalBac })
                if (totalBac > this.state.highbac.total) {
                    var bacDate = new Date();
                    this.setState({ highbac: [{ total: totalBac, dateCreated: bacDate }] })
                }
                setTimeout(() => {
                    this.saveBuzz();
                }, 200);
            } else {
                this.moveToOld();
            }
        }
    }

    async moveToOld() {
        var oldbuzzarray = this.state.oldbuzzes;
        var newbuzzarray = this.state.buzzes;
        oldbuzzarray.push.apply(oldbuzzarray, newbuzzarray);
        await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzarray))
        if (this.state.highbac.total > 0) {
            var bacDate = new Date();
            this.setState(prevState => ({ oldhighbac: [...prevState.oldhighbac, { total: this.state.highbac.total, dateCreated: this.state.highbac.dateCreated }] }))
            await AsyncStorage.setItem(highkey, JSON.stringify(this.state.oldhighbac))
        }
        await AsyncStorage.removeItem(key, () => {
            setTimeout(() => {
                this.setState({ buzzes: [], bac: 0.0, oldbuzzes: [] })
                // add setstate highbac to 0, how to implement this? Possibly add to single drink
            }, 200);
        })
    }

    async clearDrinks() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(key, () => {
            this.setState({ buzzes: [], bac: 0.0 })
        })
    }

    render() {
        var gaugeColor;
        var bacPercentage;
        if (this.state.bac === 0 || this.state.bac === undefined) {
            gaugeColor = "#ffffff"
            bacPercentage = 0
        } else if (this.state.bac > 0.00 && this.state.bac < 0.01) {
            gaugeColor = "#b5d3a0"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.01 && this.state.bac < 0.02) {
            gaugeColor = "#96c060"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.02 && this.state.bac < 0.03) {
            gaugeColor = "#9fc635"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.03 && this.state.bac < 0.04) {
            gaugeColor = "#d3e50e"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.04 && this.state.bac < 0.05) {
            gaugeColor = "#ffeb00"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.05 && this.state.bac < 0.06) {
            gaugeColor = "#f9bf00"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.06 && this.state.bac < 0.07) {
            gaugeColor = "#e98f00"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.07 && this.state.bac < 0.08) {
            gaugeColor = "#d05900"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.08 && this.state.bac < 0.09) {
            gaugeColor = "#AE0000"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac > 0.09 && this.state.bac < 0.10) {
            gaugeColor = "#571405"
            bacPercentage = this.state.bac * 1000
        } else if (this.state.bac >= 0.10) {
            gaugeColor = "#000000"
            bacPercentage = 100
        }
        let data = [{
            value: 'Beer',
        }, {
            value: 'Wine',
        }, {
            value: 'Liquor',
        }];
        return (
            <View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh} />}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <View style={{ alignSelf: "center", paddingBottom: 5 }}>
                            <Speedometer value={bacPercentage} totalValue={100} size={350} innerColor="#e0f2f1" outerColor="#ffffff" internalColor={gaugeColor} showIndicator />
                        </View>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "white", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>0.0</Text></View>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#b5d3a0", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#96c060", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#9fc635", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#d3e50e", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#ffeb00", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#f9bf00", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#e98f00", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#d05900", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#AE0000", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#571405", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac >= 0.10 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#000000", marginTop: 10, marginBottom: 10, marginLeft: 70, marginRight: 70 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <View style={{ flex: 1, flexDirection: "row", paddingBottom: 10 }}>
                            <View style={{ paddingLeft: 10, paddingRight: 45 }}>
                                <Dropdown
                                    label='Drink Type'
                                    data={data}
                                    containerStyle={{ minWidth: 120, paddingLeft: 10 }}
                                    value="Beer"
                                    onChangeText={(value) => this.setState({ alctype: value })} />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => this.checkBac()}><Text style={styles.buttonText}>Check BAC</Text></TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", paddingBottom: 10 }}>
                            {this.state.alctype === "Beer" &&
                                <MultiSwitch choiceSize={50}
                                    activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => ({
                                        backgroundColor: 'white',
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "lightgrey",
                                        justifyContent: 'space-between',
                                    }))}
                                    onActivate={(number) => { console.log(number) }}
                                    active={1}>
                                    <Text style={{ fontSize: 20 }}>4%</Text>
                                    <Text style={{ fontSize: 20 }}>5%</Text>
                                    <Text style={{ fontSize: 20 }}>7%</Text>
                                </MultiSwitch>}
                            {this.state.alctype === "Wine" &&
                                <MultiSwitch choiceSize={50}
                                    activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => ({
                                        backgroundColor: 'white',
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "lightgrey",
                                        justifyContent: 'space-between',
                                    }))}
                                    onActivate={(number) => { console.log(number) }}
                                    active={1}>
                                    <Text style={{ fontSize: 20 }}>11%</Text>
                                    <Text style={{ fontSize: 20 }}>12%</Text>
                                    <Text style={{ fontSize: 20 }}>13%</Text>
                                </MultiSwitch>}
                            {this.state.alctype === "Liquor" &&
                                <MultiSwitch choiceSize={50}
                                    activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => ({
                                        backgroundColor: 'white',
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "lightgrey",
                                        justifyContent: 'space-between',
                                    }))}
                                    onActivate={(number) => { console.log(number) }}
                                    active={1}>
                                    <Text style={{ fontSize: 20 }}>30%</Text>
                                    <Text style={{ fontSize: 20 }}>40%</Text>
                                    <Text style={{ fontSize: 20 }}>50%</Text>
                                </MultiSwitch>}
                            <Text style={{ fontSize: 20, alignSelf: "center", paddingLeft: 55 }}>Add Drink</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ paddingTop: 10 }}>
                                {this.state.alctype === "Beer" &&
                                    <MultiSwitch choiceSize={50}
                                        activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' },]}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ({
                                            backgroundColor: 'white',
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: "lightgrey",
                                            justifyContent: 'space-between',
                                        }))}
                                        onActivate={(number) => { console.log(number) }}
                                        active={0}>
                                        <Text style={{ fontSize: 20 }}>12oz</Text>
                                        <Text style={{ fontSize: 20 }}>16oz</Text>
                                        <Text style={{ fontSize: 20 }}>20oz</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Wine" &&
                                    <MultiSwitch choiceSize={50}
                                        activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' },]}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ({
                                            backgroundColor: 'white',
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: "lightgrey",
                                            justifyContent: 'space-between',
                                        }))}
                                        onActivate={(number) => { console.log(number) }}
                                        active={0}>
                                        <Text style={{ fontSize: 20 }}>5oz</Text>
                                        <Text style={{ fontSize: 20 }}>8oz</Text>
                                        <Text style={{ fontSize: 20 }}>25oz</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Liquor" &&
                                    <MultiSwitch choiceSize={50}
                                        activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' },]}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ({
                                            backgroundColor: 'white',
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: "lightgrey",
                                            justifyContent: 'space-between',
                                        }))}
                                        onActivate={(number) => { console.log(number) }}
                                        active={0}>
                                        <Text style={{ fontSize: 20 }}>1.5oz</Text>
                                        <Text style={{ fontSize: 20 }}>3oz</Text>
                                        <Text style={{ fontSize: 20 }}>6oz</Text>
                                    </MultiSwitch>}
                            </View>
                            <View style={{ paddingLeft: 60 }}></View>
                            {this.state.alctype === "Beer" &&
                                <TouchableOpacity onPress={() => this.addDrink("Beer")} style={{
                                    borderRadius: 50, backgroundColor: "#1de9b6", opacity: 0.8, height: 55, width: 55, margin: 10, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 5 }, shadowColor: "#000000", shadowRadius: 3, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 22, color: "white" }}>🍺</Text></TouchableOpacity>}
                            {this.state.alctype === "Wine" &&
                                <TouchableOpacity onPress={() => this.addDrink("Wine")} style={{
                                    borderRadius: 50, backgroundColor: "#1de9b6", opacity: 0.8, height: 55, width: 55, margin: 10, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 5 }, shadowColor: "#000000", shadowRadius: 3, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 22, color: "white" }}>🍷</Text></TouchableOpacity>}
                            {this.state.alctype === "Liquor" &&
                                <TouchableOpacity onPress={() => this.addDrink("Liquor")} style={{
                                    borderRadius: 50, backgroundColor: "#1de9b6", opacity: 0.8, height: 55, width: 55, margin: 10, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 5 }, shadowColor: "#000000", shadowRadius: 3, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 22, color: "white" }}>🥃</Text></TouchableOpacity>}
                        </View>
                        {/* <FloatingAction
                            actions={actions}
                            onPressItem={name => { this.addDrink(name); }}
                            color={"#1de9b6"}
                            overlayColor={"#e0f2f1"}
                            onPressMain={() => { Vibration.vibrate() }}
                            distanceToEdge={15} /> */}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Clear All Drinks</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.clearDrinks()}><Text style={styles.buttonText}>Clear</Text></TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        );
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        margin: 10,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    }
})
