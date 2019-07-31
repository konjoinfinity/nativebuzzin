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
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import NumericInput from 'react-native-numeric-input'
import RNSpeedometer from 'react-native-speedometer'
import { NavigationEvents } from "react-navigation";

const options = [
    'Cancel',
    <Text style={{ color: '#94BFE2', fontSize: 25 }}>Male</Text>,
    <Text style={{ color: '#F398BE', fontSize: 25 }}>Female</Text>
]

class DemoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: "Male",
            weight: 180,
            bac: 0.0,
            testbuzzes: [],
            refreshing: false,
            alctype: "Beer",
            oz: 12,
            abv: 0.05
        }
        this.addDrink = this.addDrink.bind(this);
        this.varGetBAC = this.varGetBAC.bind(this);
        this.checkBac = this.checkBac.bind(this);
        this.singleDuration = this.singleDuration.bind(this);
        this.getDayHourMin = this.getDayHourMin.bind(this);
        this.clearDrinks = this.clearDrinks.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.handleAbv = this.handleAbv.bind(this);
        this.handleOz = this.handleOz.bind(this);
        this.handleDrinkType = this.handleDrinkType.bind(this);
        this.handleGender = this.handleGender.bind(this);
    };

    async componentDidMount() {
        setTimeout(() => {
            this.checkBac();
        }, 200);
    }

    async onRefresh() {
        this.setState({ refreshing: true });
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

    varGetBAC(weight, gender, hours, buzz) {
        var distribution;
        var drinkTotal;
        var totalAlc;
        var totalArray = [];
        if (gender === "Female") {
            distribution = 0.66;
        }
        if (gender === "Male") {
            distribution = 0.73;
        }
        for (var i = 0; i < buzz.length; i++) {
            if (buzz[i].drinkType === "Beer") {
                drinkTotal = buzz[i].oz * 1 * buzz[i].abv;
            }
            if (buzz[i].drinkType === "Wine") {
                drinkTotal = buzz[i].oz * 1 * buzz[i].abv;
            }
            if (buzz[i].drinkType === "Liquor") {
                drinkTotal = buzz[i].oz * 1 * buzz[i].abv;
            }
            totalArray.push(drinkTotal)
        }
        totalAlc = totalArray.reduce((a, b) => a + b, 0)
        var bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
        return bac;
    }

    addDrink() {
        Vibration.vibrate();
        var drinkDate = new Date();
        this.setState(prevState => ({ testbuzzes: [...prevState.testbuzzes, { drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }] }))
        setTimeout(() => {
            if (this.state.testbuzzes.length >= 1) {
                this.checkBac();
            }
        }, 100);
    }

    async checkBac() {
        Vibration.vibrate();
        if (this.state.testbuzzes.length >= 1) {
            var duration = this.singleDuration(this.state.testbuzzes[0].dateCreated);
            var totalBac = this.varGetBAC(
                this.state.weight,
                this.state.gender,
                duration,
                this.state.testbuzzes
            )
            if (totalBac > 0) {
                totalBac = parseFloat(totalBac.toFixed(6));
                this.setState({ bac: totalBac })
            } else {
                this.setState({ testbuzzes: [], bac: 0.0 })
            }
        }
    }

    async clearDrinks() {
        Vibration.vibrate();
        this.setState({ testbuzzes: [], bac: 0.0 })
    }

    handleOz(number) {
        Vibration.vibrate();
        if (this.state.alctype === "Beer") {
            if (number === 0) { this.setState({ oz: 12 }) }
            if (number === 1) { this.setState({ oz: 16 }) }
            if (number === 2) { this.setState({ oz: 20 }) }
        }
        if (this.state.alctype === "Wine") {
            if (number === 0) { this.setState({ oz: 5 }) }
            if (number === 1) { this.setState({ oz: 8 }) }
            if (number === 2) { this.setState({ oz: 12 }) }
        }
        if (this.state.alctype === "Liquor") {
            if (number === 0) { this.setState({ oz: 1.5 }) }
            if (number === 1) { this.setState({ oz: 3 }) }
            if (number === 2) { this.setState({ oz: 6 }) }
        }
    }

    handleAbv(number) {
        Vibration.vibrate();
        if (this.state.alctype === "Beer") {
            if (number === 0) { this.setState({ abv: 0.04 }) }
            if (number === 1) { this.setState({ abv: 0.05 }) }
            if (number === 2) { this.setState({ abv: 0.06 }) }
            if (number === 3) { this.setState({ abv: 0.07 }) }
            if (number === 4) { this.setState({ abv: 0.08 }) }
        }
        if (this.state.alctype === "Wine") {
            if (number === 0) { this.setState({ abv: 0.11 }) }
            if (number === 1) { this.setState({ abv: 0.12 }) }
            if (number === 2) { this.setState({ abv: 0.13 }) }
        }
        if (this.state.alctype === "Liquor") {
            if (number === 0) { this.setState({ abv: 0.30 }) }
            if (number === 1) { this.setState({ abv: 0.40 }) }
            if (number === 2) { this.setState({ abv: 0.50 }) }
        }
    }

    handleDrinkType(value) {
        Vibration.vibrate();
        this.setState({ alctype: value })
        if (value === "Beer") {
            this.setState({ abv: 0.05, oz: 12 })
        }
        if (value === "Wine") {
            this.setState({ abv: 0.12, oz: 5 })
        }
        if (value === "Liquor") {
            this.setState({ abv: 0.40, oz: 1.5 })
        }
    }

    showActionSheet() {
        // Keyboard.dismiss()
        this.ActionSheet.show()
    }

    handleGender(index) {
        if (index !== 0) {
            this.setState({ gender: options[index].props.children })
        }
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
        let activeStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }]
        let beerActive = [{ color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }]

        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh} />}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ textAlign: "center", color: "#00bfa5" }}>|                       |</Text>
                        <View style={{ alignSelf: "center" }}>
                            <RNSpeedometer value={bacPercentage} size={350} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={[
                                {
                                    name: '1',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#ffffff',
                                },
                                {
                                    name: '2',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#b5d3a0',
                                },
                                {
                                    name: '3',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#96c060',
                                },
                                {
                                    name: '4',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#9fc635',
                                },
                                {
                                    name: '5',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#d3e50e',
                                },
                                {
                                    name: '6',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#ffeb00',
                                },
                                {
                                    name: '7',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#f9bf00',
                                },
                                {
                                    name: '8',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#e98f00',
                                },
                                {
                                    name: '9',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#d05900',
                                },
                                {
                                    name: '10',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#AE0000',
                                },
                                {
                                    name: '11',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#571405',
                                },
                                {
                                    name: '12',
                                    labelColor: '#e0f2f1',
                                    activeBarColor: '#000000',
                                }
                            ]} />
                        </View>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>0.0  😶</Text></TouchableOpacity>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🙂</Text></TouchableOpacity>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  😊</Text></TouchableOpacity>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  ☺️</Text></TouchableOpacity>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}  😃</Text></TouchableOpacity>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: 30 }}>Optimal </Text>
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}  😄</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: 30 }}>Optimal </Text>
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}  😆</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  😝</Text></TouchableOpacity>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  😜</Text></TouchableOpacity>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🤪</Text></TouchableOpacity>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🥴</Text></TouchableOpacity>)}
                        {this.state.bac >= 0.10 && (
                            <TouchableOpacity onPress={() => this.checkBac()} style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🤮</Text></TouchableOpacity>)}
                    </View>
                    <View style={styles.cardView}>
                        <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                            {this.state.alctype === "Beer" &&
                                <MultiSwitch choiceSize={75}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                    onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                    active={0}>
                                    <Text style={{ fontSize: 30 }}>🍺</Text>
                                    <Text style={{ fontSize: 30 }}>🍷</Text>
                                    <Text style={{ fontSize: 30 }}>🥃</Text>
                                </MultiSwitch>}
                            {this.state.alctype === "Wine" &&
                                <MultiSwitch choiceSize={75}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                    onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                    active={1}>
                                    <Text style={{ fontSize: 30 }}>🍺</Text>
                                    <Text style={{ fontSize: 30 }}>🍷</Text>
                                    <Text style={{ fontSize: 30 }}>🥃</Text>
                                </MultiSwitch>}
                            {this.state.alctype === "Liquor" &&
                                <MultiSwitch choiceSize={75}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                    onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                    active={2}>
                                    <Text style={{ fontSize: 30 }}>🍺</Text>
                                    <Text style={{ fontSize: 30 }}>🍷</Text>
                                    <Text style={{ fontSize: 30 }}>🥃</Text>
                                </MultiSwitch>}
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => this.clearDrinks()}>
                                <View>
                                    <Text style={{ fontSize: 30 }}>🗑</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                <View style={{ paddingBottom: 15 }}>
                                    <View style={styles.multiSwitchViews}>
                                        {this.state.alctype === "Beer" &&
                                            <MultiSwitch choiceSize={45}
                                                activeItemStyle={beerActive}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(5, () => (styles.multiSwitch))}
                                                onActivate={(number) => { this.handleAbv(number) }}
                                                active={1}>
                                                <Text style={{ fontSize: 18 }}>4%</Text>
                                                <Text style={{ fontSize: 18 }}>5%</Text>
                                                <Text style={{ fontSize: 18 }}>6%</Text>
                                                <Text style={{ fontSize: 18 }}>7%</Text>
                                                <Text style={{ fontSize: 18 }}>8%</Text>
                                            </MultiSwitch>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {this.state.alctype === "Wine" &&
                                            <MultiSwitch choiceSize={50}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                onActivate={(number) => { this.handleAbv(number) }}
                                                active={1}>
                                                <Text style={{ fontSize: 20 }}>11%</Text>
                                                <Text style={{ fontSize: 20 }}>12%</Text>
                                                <Text style={{ fontSize: 20 }}>13%</Text>
                                            </MultiSwitch>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {this.state.alctype === "Liquor" &&
                                            <MultiSwitch choiceSize={50}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                onActivate={(number) => { this.handleAbv(number) }}
                                                active={1}>
                                                <Text style={{ fontSize: 20 }}>30%</Text>
                                                <Text style={{ fontSize: 20 }}>40%</Text>
                                                <Text style={{ fontSize: 20 }}>50%</Text>
                                            </MultiSwitch>}
                                    </View>
                                </View>
                                <View style={styles.multiSwitchViews}>
                                    {this.state.alctype === "Beer" &&
                                        <MultiSwitch choiceSize={50}
                                            activeItemStyle={activeStyle}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                            onActivate={(number) => { this.handleOz(number) }}
                                            active={0}>
                                            <Text style={{ fontSize: 20 }}>12oz</Text>
                                            <Text style={{ fontSize: 20 }}>16oz</Text>
                                            <Text style={{ fontSize: 20 }}>20oz</Text>
                                        </MultiSwitch>}
                                </View>
                                <View style={styles.multiSwitchViews}>
                                    {this.state.alctype === "Wine" &&
                                        <MultiSwitch choiceSize={50}
                                            activeItemStyle={activeStyle}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                            onActivate={(number) => { this.handleOz(number) }}
                                            active={0}>
                                            <Text style={{ fontSize: 20 }}>5oz</Text>
                                            <Text style={{ fontSize: 20 }}>8oz</Text>
                                            <Text style={{ fontSize: 20 }}>12oz</Text>
                                        </MultiSwitch>}
                                </View>
                                <View style={styles.multiSwitchViews}>
                                    {this.state.alctype === "Liquor" &&
                                        <MultiSwitch choiceSize={50}
                                            activeItemStyle={activeStyle}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                            onActivate={(number) => { this.handleOz(number) }}
                                            active={0}>
                                            <Text style={{ fontSize: 20 }}>1.5oz</Text>
                                            <Text style={{ fontSize: 20 }}>3oz</Text>
                                            <Text style={{ fontSize: 20 }}>6oz</Text>
                                        </MultiSwitch>}
                                </View>
                            </View>
                            {this.state.alctype === "Beer" &&
                                <TouchableOpacity onPress={() => this.addDrink()} style={styles.addButton}>
                                    <Text style={{ fontSize: 40, color: "white" }}>+🍺</Text></TouchableOpacity>}
                            {this.state.alctype === "Wine" &&
                                <TouchableOpacity onPress={() => this.addDrink()} style={styles.addButton}>
                                    <Text style={{ fontSize: 40, color: "white" }}>+🍷</Text></TouchableOpacity>}
                            {this.state.alctype === "Liquor" &&
                                <TouchableOpacity onPress={() => this.addDrink()} style={styles.addButton}>
                                    <Text style={{ fontSize: 40, color: "white" }}>+🥃</Text></TouchableOpacity>}
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.showActionSheet()}><Text style={styles.buttonText}>Select Gender ♂♀</Text></TouchableOpacity>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={<Text style={{ color: '#000', fontSize: 25 }}>Gender</Text>}
                            options={options}
                            cancelButtonIndex={0}
                            onPress={this.handleGender}
                        />
                        {this.state.gender !== "" &&
                            <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                            </View>}
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 20 }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 20 }}>Enter Weight - lbs.</Text>
                        <NumericInput
                            minValue={80}
                            maxValue={300}
                            value={this.state.weight}
                            onChange={(weight) => this.setState({ weight })}
                            totalWidth={325}
                            step={5}
                            rounded
                            textColor='#103900'
                            iconStyle={{ color: 'white' }}
                            rightButtonBackgroundColor='#00897b'
                            leftButtonBackgroundColor='#00897b' />
                    </View>
                    <View style={{ paddingTop: 20 }}></View>
                </ScrollView>
            </View >
        );
    }
}

export default DemoScreen;

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
        marginBottom: 5,
        marginLeft: 60,
        marginRight: 60,
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3
    },
    optimalbac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3
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
    },
    cardView: {
        backgroundColor: "#e0f2f1",
        borderRadius: 15,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 15,
        padding: 10
    },
    multiSwitchViews: {
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3
    },
    headerButton: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    }
})