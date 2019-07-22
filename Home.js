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
            oldhighbac: []
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
        console.log(bacPercentage)
        return (
            <View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh} />}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <View style={{ alignSelf: "center", paddingBottom: 10 }}>
                            <Speedometer value={bacPercentage} totalValue={100} size={380} innerColor="#e0f2f1" outerColor="#ffffff" internalColor={gaugeColor} showIndicator />
                        </View>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "white", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>0.0</Text></View>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#b5d3a0", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#96c060", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#9fc635", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#d3e50e", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#ffeb00", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#f9bf00", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#e98f00", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#d05900", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#AE0000", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#571405", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                        {this.state.bac >= 0.10 && (
                            <View style={{ borderRadius: 15, border: "solid teal 2px", padding: 10, backgroundColor: "#000000", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}</Text></View>)}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, paddingBottom: 65, paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.checkBac()}><Text style={styles.buttonText}>Check BAC</Text></TouchableOpacity>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Add a Drink</Text>
                        <FloatingAction
                            actions={actions}
                            onPressItem={name => { this.addDrink(name); }}
                            color={"#1de9b6"}
                            overlayColor={"#e0f2f1"}
                            onPressMain={() => { Vibration.vibrate() }}
                            distanceToEdge={25} />
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
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    }
})
