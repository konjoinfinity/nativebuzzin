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
import Speedometer from 'react-native-speedometer-chart';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';

const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const oldkey = "oldbuzzes"
const highkey = "highbac"

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
        this.handleAbv = this.handleAbv.bind(this);
        this.handleOz = this.handleOz.bind(this);
        this.handleDrinkType = this.handleDrinkType.bind(this);
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
        // this.addDrink("Beer" (this.state.alctype), oz (this.state.oz), abv (this.state.abv))
        // This would negate the arg/param, read straight from state
        // Modify buzz data model to include - ABV and oz
        // Conditional to add to variable buzz to variable array
        // Add variable bac amounts to totalBac after
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
        // Add logic to check for variable array, if it has data - calculate and add to totalBac
        // Looping logic will be required, determine each variable buzz bac and add together
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

    handleOz(number) {
        Vibration.vibrate();
        if (this.state.alctype === "Beer") {
            // this.addDrink("Beer", oz, abv)
            if (number === 0) { console.log("12oz - Beer") }
            if (number === 1) { console.log("16oz - Beer") }
            if (number === 2) { console.log("20oz - Beer") }
        }
        if (this.state.alctype === "Wine") {
            // this.addDrink("Beer", oz, abv)
            if (number === 0) { console.log("5oz - Wine") }
            if (number === 1) { console.log("8oz - Wine") }
            if (number === 2) { console.log("25oz - Wine") }
        }
        if (this.state.alctype === "Liquor") {
            // this.addDrink("Beer", oz, abv)
            if (number === 0) { console.log("1.5oz - Liquor") }
            if (number === 1) { console.log("3oz - Liquor") }
            if (number === 2) { console.log("6oz - Liquor") }
        }
    }

    handleAbv(number) {
        Vibration.vibrate();
        if (this.state.alctype === "Beer") {
            // this.addDrink("Beer", oz, abv)
            if (number === 0) { console.log("4% ABV - Beer") }
            if (number === 1) { console.log("5% ABV - Beer") }
            if (number === 2) { console.log("7% ABV - Beer") }
        }
        if (this.state.alctype === "Wine") {
            // this.addDrink("Beer", oz, abv)
            if (number === 0) { console.log("11% ABV - Wine") }
            if (number === 1) { console.log("12% ABV - Wine") }
            if (number === 2) { console.log("13% ABV - Wine") }
        }
        if (this.state.alctype === "Liquor") {
            // this.addDrink("Beer", oz, abv)
            if (number === 0) { console.log("30% ABV - Liquor") }
            if (number === 1) { console.log("40% ABV - Liquor") }
            if (number === 2) { console.log("50% ABV - Liquor") }
        }
    }

    handleDrinkType(value) {
        Vibration.vibrate();
        this.setState({ alctype: value })
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
        let data = [{ value: 'Beer' }, { value: 'Wine' }, { value: 'Liquor' }];
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
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>0.0</Text></TouchableOpacity>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                        {this.state.bac >= 0.10 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></TouchableOpacity>)}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginRight: 10, marginLeft: 10, marginBottom: 10, padding: 10 }}>
                        <View style={{ alignSelf: "center", paddingBottom: 15 }}>
                            <MultiSwitch choiceSize={75}
                                activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                layout={{ vertical: 0, horizontal: -1 }}
                                containerStyles={_.times(3, () => (styles.multiSwitch))}
                                onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                active={0}>
                                <Text style={{ fontSize: 30 }}>🍺</Text>
                                <Text style={{ fontSize: 30 }}>🍷</Text>
                                <Text style={{ fontSize: 30 }}>🥃</Text>
                            </MultiSwitch>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 1, flexDirection: "column", paddingBottom: 15 }}>
                                <View style={{ paddingBottom: 15 }}>
                                    {this.state.alctype === "Beer" &&
                                        <MultiSwitch choiceSize={50}
                                            activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                            onActivate={(number) => { this.handleAbv(number) }}
                                            active={1}>
                                            <Text style={{ fontSize: 20 }}>4%</Text>
                                            <Text style={{ fontSize: 20 }}>5%</Text>
                                            <Text style={{ fontSize: 20 }}>7%</Text>
                                        </MultiSwitch>}
                                    {this.state.alctype === "Wine" &&
                                        <MultiSwitch choiceSize={50}
                                            activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                            onActivate={(number) => { this.handleAbv(number) }}
                                            active={1}>
                                            <Text style={{ fontSize: 20 }}>11%</Text>
                                            <Text style={{ fontSize: 20 }}>12%</Text>
                                            <Text style={{ fontSize: 20 }}>13%</Text>
                                        </MultiSwitch>}
                                    {this.state.alctype === "Liquor" &&
                                        <MultiSwitch choiceSize={50}
                                            activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' }]}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                            onActivate={(number) => { this.handleAbv(number) }}
                                            active={1}>
                                            <Text style={{ fontSize: 20 }}>30%</Text>
                                            <Text style={{ fontSize: 20 }}>40%</Text>
                                            <Text style={{ fontSize: 20 }}>50%</Text>
                                        </MultiSwitch>}
                                </View>
                                {this.state.alctype === "Beer" &&
                                    <MultiSwitch choiceSize={50}
                                        activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' },]}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => (styles.multiSwitch))}
                                        onActivate={(number) => { this.handleOz(number) }}
                                        active={0}>
                                        <Text style={{ fontSize: 20 }}>12oz</Text>
                                        <Text style={{ fontSize: 20 }}>16oz</Text>
                                        <Text style={{ fontSize: 20 }}>20oz</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Wine" &&
                                    <MultiSwitch choiceSize={50}
                                        activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' },]}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => (styles.multiSwitch))}
                                        onActivate={(number) => { this.handleOz(number) }}
                                        active={0}>
                                        <Text style={{ fontSize: 20 }}>5oz</Text>
                                        <Text style={{ fontSize: 20 }}>8oz</Text>
                                        <Text style={{ fontSize: 20 }}>25oz</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Liquor" &&
                                    <MultiSwitch choiceSize={50}
                                        activeItemStyle={[{ color: 'white' }, { color: 'white' }, { color: 'white' },]}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => (styles.multiSwitch))}
                                        onActivate={(number) => { this.handleOz(number) }}
                                        active={0}>
                                        <Text style={{ fontSize: 20 }}>1.5oz</Text>
                                        <Text style={{ fontSize: 20 }}>3oz</Text>
                                        <Text style={{ fontSize: 20 }}>6oz</Text>
                                    </MultiSwitch>}
                            </View>
                            {this.state.alctype === "Beer" &&
                                <TouchableOpacity onPress={() => this.addDrink("Beer")} style={styles.addButton}>
                                    <Text style={{ fontSize: 40, color: "white" }}>+🍺</Text></TouchableOpacity>}
                            {this.state.alctype === "Wine" &&
                                <TouchableOpacity onPress={() => this.addDrink("Wine")} style={styles.addButton}>
                                    <Text style={{ fontSize: 40, color: "white" }}>+🍷</Text></TouchableOpacity>}
                            {this.state.alctype === "Liquor" &&
                                <TouchableOpacity onPress={() => this.addDrink("Liquor")} style={styles.addButton}>
                                    <Text style={{ fontSize: 40, color: "white" }}>+🥃</Text></TouchableOpacity>}
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginRight: 10, marginLeft: 10, marginBottom: 10, padding: 10 }}>
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
    },
    bac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 70,
        marginRight: 70
    },
    addButton: {
        borderRadius: 50,
        backgroundColor: "#1de9b6",
        opacity: 0.8,
        height: 100,
        width: 100,
        margin: 10,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    multiSwitch: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "lightgrey",
        justifyContent: 'space-between'
    }
})
