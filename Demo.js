import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Platform, Vibration } from 'react-native';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import NumericInput from 'react-native-numeric-input'
import RNSpeedometer from 'react-native-speedometer'
import { NavigationEvents } from "react-navigation";
import { AlertHelper } from './AlertHelper';
import { Functions } from "./Functions";
import styles from "./Styles"
import moment from "moment";
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText, abvLiquorSize,
    addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, gaugeLabels, warnText, dangerText,
    abovePoint10, shotsStyle
} from "./Variables";

class DemoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: "Male", weight: 195, bac: 0.0, testbuzzes: [], alctype: "Beer", oz: 12, abv: 0.05, countdown: false, timer: "",
            modal1: false, modal2: false, showHideBuzzes: false
        }
    };

    async componentDidMount() {
        Vibration.vibrate();
        setTimeout(() => { this.checkBac() }, 200)
    }

    handleModal(number) {
        Vibration.vibrate()
        this.setState({ [number]: !this.state[number] })
    }

    addDrink() {
        Vibration.vibrate()
        var drinkDate = new Date();
        // Update method to insert drink object into beginning of array
        this.setState(prevState => ({ testbuzzes: [...prevState.testbuzzes, { drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }] }), () => this.checkBac())
        setTimeout(() => {
            if (this.state.bac > 0.04 && this.state.bac < 0.06) { AlertHelper.show("success", "Optimal Buzz", "You are in the Optimal Buzz Zone, drink water.") }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) { AlertHelper.show("warn", "Slow Down", "Please take a break and drink some water.") }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) { AlertHelper.show("error", "Drunk", "Stop drinking and drink water.") }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { this.handleModal("modal1") }
            if (this.state.bac > 0.10) { this.handleModal("modal2") }
        }, 200);
    }

    async checkBac() {
        if (this.state.testbuzzes.length >= 1) {
            var duration = Functions.singleDuration(this.state.testbuzzes[0].dateCreated);
            var totalBac = Functions.varGetBAC(this.state.weight, this.state.gender, duration, this.state.testbuzzes)
            if (totalBac > 0) {
                totalBac = parseFloat(totalBac.toFixed(6));
                this.setState({ bac: totalBac })
                if (this.state.countdown === false) { this.setState({ countdown: true }, () => this.countdownBac()) }
            } else { this.setState({ testbuzzes: [], bac: 0.0, countdown: false }, () => this.countdownBac()) }
        } else if (this.state.testbuzzes.length === 0) { this.setState({ bac: 0.0, countdown: false }, () => this.countdownBac()) }
    }

    countdownBac() {
        let testBacTimer;
        if (this.state.countdown === true) {
            testBacTimer = setInterval(() => this.checkBac(), 500);
            this.setState({ timer: testBacTimer });
        } else if (this.state.countdown === false) {
            clearInterval(this.state.timer);
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    async clearDrinks() {
        Vibration.vibrate()
        this.setState({ testbuzzes: [], bac: 0.0 });
    }

    switchGender() {
        Vibration.vibrate()
        this.state.gender === "Male" ? this.setState({ gender: "Female", weight: 165 }) : this.setState({ gender: "Male", weight: 195 })
    }

    async undoLastDrink() {
        if (Functions.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated) < 0.0333333) {
            Vibration.vibrate()
            var undobuzz = this.state.testbuzzes;
            // Update to .shift()
            if (undobuzz.length >= 1) { undobuzz.pop(), this.setState({ testbuzzes: undobuzz }, () => this.checkBac()) }
        }
    }

    checkLastDrink() {
        if (Functions.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated) < 0.0333333) { return true }
        else { return false }
    }

    showHideBuzzes() {
        this.setState(prevState => ({ showHideBuzzes: !prevState.showHideBuzzes }), () => setTimeout(() => {
            if (this.state.showHideBuzzes === true) { this.scrolltop.scrollTo({ y: 550, animated: true }) }
            else { this.scrolltop.scrollTo({ y: 0, animated: true }) }
        }, 300));
        Vibration.vibrate()
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1], testbuzzes;
        (this.state.testbuzzes && this.state.testbuzzes.length > 0) &&
            // Will be able to remove Functions.reverseArray after buzz storage has been updated
            (testbuzzes = Functions.reverseArray(this.state.testbuzzes).map((buzz, id) => {
                return (
                    <View key={id} style={styles.buzzMap}>
                        <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: 30, textAlign: "center", padding: 5 }}>
                            {buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 20, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 15, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    </View>
                )
            }))
        return (
            <View style={{ backgroundColor: "#ff8a80" }}><Modal animationType="slide" transparent={false} visible={this.state.modal1}>
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
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={styles.scrollCard}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingTop: 20 }}>     Gender - {this.state.gender}     </Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch ♂♀</Text></TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingTop: 10 }}>Enter Weight - lbs.</Text>
                            <NumericInput minValue={50} maxValue={500} initValue={this.state.weight} value={this.state.weight} totalHeight={50}
                                onChange={(weight) => this.setState({ weight }, () => { Vibration.vibrate() })} step={5} rounded textColor='#103900' totalWidth={120}
                                iconStyle={{ color: 'white' }} rightButtonBackgroundColor={this.state.weight === 500 ? "#AE0000" : "#00897b"}
                                leftButtonBackgroundColor={this.state.weight === 50 ? "#AE0000" : "#00897b"} />
                        </View>
                    </View>
                    <View style={styles.cardView}>
                        {addButtonSize === true ? <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>DEMO        </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>        DEMO</Text></Text>
                            : <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>DEMO                </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>                DEMO</Text></Text>}
                        <View style={{ alignSelf: "center" }}>
                            <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                        </View>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (<View style={styles.spaceAroundView}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.00 && (this.state.bac > 0.04 && this.state.bac < 0.06 ?
                            <View style={styles.spaceAroundView}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                                <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                    <Text style={{ fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>
                            : <View style={styles.spaceAroundView}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                                <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                    <Text style={{ fontSize: bacTextSize, textAlign: "center", color: Functions.bacEmotion(this.state.bac)[0] }}>{this.state.bac}  {Functions.bacEmotion(this.state.bac)[1]}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                    </View>
                    {this.state.bac < 0.10 && <View style={styles.cardView}>
                        <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                            <MultiSwitch choiceSize={alcTypeSize} activeItemStyle={shotsStyle} layout={{ vertical: 0, horizontal: -1 }} ref={(ref) => { this.alcswitch = ref }}
                                containerStyles={_.times(4, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }} active={this.state.alctype === "Beer" ? 0 : this.state.alctype === "Wine" ? 1 : this.state.alctype === "Liquor" ? 2 : 3}>
                                <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                <Text style={{ fontSize: alcTypeText }}>🍹</Text>
                            </MultiSwitch>
                            {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === true &&
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.undoLastDrink()}>
                                    <View><Text style={{ fontSize: alcTypeText }}>↩️</Text></View>
                                </TouchableOpacity>}
                            {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === false &&
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.clearDrinks()}>
                                    <View><Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></View>
                                </TouchableOpacity>}
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
                            <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                        </View>
                    </View>}
                    {this.state.bac > 0.10 &&
                        <View style={styles.cardView}>
                            {abovePoint10}
                            {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === true && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton} onPress={() => this.undoLastDrink()}>
                                    <View><Text style={{ fontSize: alcTypeText }}>↩️</Text></View></TouchableOpacity>
                            </View>}
                        </View>}
                    {(this.state.testbuzzes && this.state.testbuzzes.length > 0) && <View style={styles.buzzCard}>
                        <View style={styles.buzzView}>
                            <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>Current Buzz</Text>
                            <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes()}>
                                <Text style={styles.buttonText}>{this.state.showHideBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideBuzzes === true && <View>{testbuzzes}</View>}
                    </View>}
                    <View style={{ paddingTop: 20 }}></View>
                </ScrollView>
            </View >
        );
    }
}

export default DemoScreen;