import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import NumericInput from 'react-native-numeric-input'
import RNSpeedometer from 'react-native-speedometer'
import { NavigationEvents } from "react-navigation";
import { AlertHelper } from './AlertHelper';
import { Functions } from "./Functions";
import styles from "./Styles"
import moment from "moment";
import ReactNativeHaptic from 'react-native-haptic';
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText, abvLiquorSize,
    addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, gaugeLabels, warnText, dangerText,
    abovePoint10, shotsStyle, loginTitle
} from "./Variables";

class DemoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: "Male", weight: 195, bac: 0.0, testbuzzes: [], alctype: "Beer", oz: 12, abv: 0.05, countdown: false, timer: "",
            modal1: false, modal2: false, selectedBuzz: "", testbuzzmodal: false, testbuzzduration: 30
        }
    };

    async componentDidMount() {
        ReactNativeHaptic.generate('impactLight')
        setTimeout(() => { this.checkBac() }, 200)
    }

    handleModal(number) {
        ReactNativeHaptic.generate('selection')
        this.setState({ [number]: !this.state[number] })
    }

    addDrink() {
        ReactNativeHaptic.generate('selection')
        var drinkDate = new Date();
        this.setState(prevState => ({ testbuzzes: [{ drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }, ...prevState.testbuzzes] }), () => { this.checkBac() })
        setTimeout(() => {
            if (this.state.bac > 0.04 && this.state.bac < 0.06) { ReactNativeHaptic.generate('notification'); AlertHelper.show("success", "Optimal Buzz", "You are in the Optimal Buzz Zone, drink water.") }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) { ReactNativeHaptic.generate('notificationSuccess'); AlertHelper.show("warn", "Slow Down", "Please take a break and drink some water.") }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) { ReactNativeHaptic.generate('notificationWarning'); AlertHelper.show("error", "Drunk", "Stop drinking and drink water.") }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { ReactNativeHaptic.generate('notificationError'); this.handleModal("modal1") }
            if (this.state.bac > 0.10) { ReactNativeHaptic.generate('notificationError'); this.handleModal("modal2") }
        }, 200);
    }

    async checkBac() {
        if (this.state.testbuzzes.length >= 1) {
            var duration = Functions.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated);
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
        ReactNativeHaptic.generate("notificationError")
        this.setState({ testbuzzes: [], bac: 0.0 });
    }

    switchGender() {
        ReactNativeHaptic.generate('selection')
        this.state.gender === "Male" ? this.setState({ gender: "Female", weight: 165 }) : this.setState({ gender: "Male", weight: 195 })
    }

    async undoLastDrink() {
        if (Functions.singleDuration(this.state.testbuzzes[0].dateCreated) < 0.0333333) {
            ReactNativeHaptic.generate('selection')
            var undobuzz = this.state.testbuzzes;
            if (undobuzz.length >= 1) {
                undobuzz.shift();
                this.setState({ testbuzzes: undobuzz }, () => this.checkBac())
            }
        }
    }

    checkLastDrink() {
        if (Functions.singleDuration(this.state.testbuzzes[0].dateCreated) < 0.0333333) { return true }
        else { return false }
    }

    testBuzzModal() {
        ReactNativeHaptic.generate('selection')
        this.setState({ testbuzzmodal: !this.state.testbuzzmodal, selectedBuzz: this.state.testbuzzes });
    }

    closeTestBuzzModal() {
        ReactNativeHaptic.generate('selection')
        this.setState({ testbuzzmodal: !this.state.testbuzzmodal, selectedBuzz: "" }, () => { setTimeout(() => { this.scrolltop.scrollTo({ y: 150, animated: true }) }, 750) })
    }

    testBuzzDuration(incdec) {
        ReactNativeHaptic.generate('selection')
        if (incdec === "up" && this.state.testbuzzduration >= 5 && this.state.testbuzzduration < 120) { this.setState({ testbuzzduration: this.state.testbuzzduration + 5 }) }
        else if (incdec === "down" && this.state.testbuzzduration > 5 && this.state.testbuzzduration <= 120) { this.setState({ testbuzzduration: this.state.testbuzzduration - 5 }) }
    }

    async deleteTestBuzz(buzz) {
        ReactNativeHaptic.generate('selection')
        var filtered = this.state.testbuzzes.filter(deleted => deleted !== buzz)
        this.setState({ testbuzzes: filtered, selectedBuzz: filtered })
    }

    async editTestBuzz() {
        ReactNativeHaptic.generate('selection')
        var delayTime = new Date();
        delayTime.setMinutes(delayTime.getMinutes() - this.state.testbuzzduration)
        var editbuzzes = this.state.testbuzzes
        editbuzzes.unshift({ drinkType: this.state.alctype, dateCreated: delayTime, oz: this.state.oz, abv: this.state.abv })
        editbuzzes.sort((a, b) => new Date(Date.parse(b.dateCreated)).getTime() - new Date(Date.parse(a.dateCreated)).getTime());
        this.setState({ testbuzzes: editbuzzes, selectedBuzz: editbuzzes })
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1], testbuzzes, selectedbuzz;
        (this.state.testbuzzes && this.state.testbuzzes.length > 0) &&
            (testbuzzes = this.state.testbuzzes.map((buzz, id) => {
                return (<View key={id}>
                    {id === 0 && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}><Text style={{ fontSize: 26, textAlign: "center", paddingRight: 45, paddingTop: 5 }}>Current Buzz</Text><TouchableOpacity style={[styles.plusMinusButtons, { marginRight: 5 }]} onPress={() => this.testBuzzModal(buzz, id)}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>}
                    <View style={styles.buzzMap}>
                        <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 16, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    </View></View>
                )
            }))
        this.state.selectedBuzz !== "" && (selectedbuzz = this.state.selectedBuzz.map((buzz, id) => {
            return (<View key={id}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}{buzz.drinkType === "Cocktail" && <Text>🍹</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: 16, padding: 5 }}>{moment(buzz.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                    {this.state.selectedBuzz.length >= 2 && <TouchableOpacity style={styles.buzzheaderButton} onPress={() => this.deleteTestBuzz(buzz)}><Text style={styles.buttonText}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>}</View>
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
                <Modal animationType="slide" transparent={false} visible={this.state.testbuzzmodal}>
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
                                <TouchableOpacity onPress={() => this.editTestBuzz()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                    <Text style={{ fontSize: addButtonText, color: "white" }}>+{this.state.alctype === "Beer" ? "🍺" : this.state.alctype === "Wine" ? "🍷" : this.state.alctype === "Liquor" ? (Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃") : "🍹"}</Text></TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 10 }}>How Long Ago?</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 5, marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.testbuzzduration === 5 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.testBuzzDuration("down")}>
                                    <View><Text style={{ fontSize: 20, color: "#ffffff" }}>-</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.smallbac, { backgroundColor: "#e0f2f1" }]}>
                                    <View><Text style={{ fontSize: 22 }}>{this.state.testbuzzduration} Minutes</Text></View></TouchableOpacity>
                                <TouchableOpacity style={[styles.plusMinusButtons, this.state.testbuzzduration === 120 ? { backgroundColor: "#AE0000" } : { backgroundColor: "#00897b" }]} onPress={() => this.testBuzzDuration("up")}>
                                    <View><Text style={{ fontSize: 20, color: "#ffffff" }}>+</Text></View></TouchableOpacity>
                            </View>
                            <Text style={styles.profileLine}>_________________________________________</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={styles.buzzbutton} onPress={() => this.closeTestBuzzModal()}>
                                    <Text style={styles.buttonText}>Done</Text>
                                </TouchableOpacity></View>
                        </View>
                    </ScrollView>
                </Modal>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={styles.scrollCard}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ fontSize: abvText, textAlign: "center", paddingTop: 20 }}>     Gender - {this.state.gender}     </Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch ♂♀</Text></TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingTop: 10 }}>Enter Weight - lbs.</Text>
                            <NumericInput minValue={50} maxValue={500} initValue={this.state.weight} value={this.state.weight} totalHeight={50}
                                onChange={(weight) => this.setState({ weight }, () => { ReactNativeHaptic.generate('selection'); })} step={5} rounded textColor='#103900' totalWidth={120}
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
                        <View style={[styles.multiSwitchViews, { paddingBottom: 10, flexDirection: "row", justifyContent: "space-between" }]}>
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
                            <View style={{ flex: 1, flexDirection: "column" }}>
                                <View style={{ paddingBottom: 10 }}>
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
                        <View>{testbuzzes}</View>
                    </View>}
                    <View style={{ paddingTop: 20 }}></View>
                </ScrollView>
            </View >
        );
    }
}

export default DemoScreen;