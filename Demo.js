// imports to be used within the DemoScreen
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Modal,
    Platform
} from 'react-native';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import NumericInput from 'react-native-numeric-input'
import RNSpeedometer from 'react-native-speedometer'
import { NavigationEvents } from "react-navigation";
import { AlertHelper } from './AlertHelper';
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText,
    abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive,
    gaugeLabels, warnText, dangerText, abovePoint10
} from "./Variables";
import { Functions } from "./Functions";
import styles from "./Styles"
import moment from "moment";

// Main ProfileScreen component
class DemoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: "Male",
            weight: 195,
            bac: 0.0,
            testbuzzes: [],
            alctype: "Beer",
            oz: 12,
            abv: 0.05,
            countdown: false,
            timer: "",
            modal1: false,
            modal2: false,
            showHideBuzzes: false
        }
    };

    // When the DemoScreen is first rendered, the checkBac function is triggered getting the most up to date BAC reading
    async componentDidMount() {
        setTimeout(() => {
            this.checkBac();
        }, 200);
    }

    handleModal(number) {
        Vibration.vibrate();
        this.setState({ [number]: !this.state[number] });
    }

    // The addDrink method creates a new drink object {drinkType (Beer, Wine, Liquor), dateCreated (Current Timestamp),
    // oz (number of ounces), and abv (alcoholic content)}  The drink object is added to the buzz array
    // The checkBac method is called as the callback to the setstate function, saveBuzz is then called to write the 
    // new current buzz state to device storage. Dropdown conditionals are triggered if bac is 0.04-0.08. A full
    // screen modal is triggered if the bac is above 0.08 (yellow warning) and when the bac is above 0.10 a (red danger) modal is
    // triggered. 
    addDrink() {
        Vibration.vibrate();
        var drinkDate = new Date();
        this.setState(prevState => ({ testbuzzes: [...prevState.testbuzzes, { drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }] }), () => this.checkBac())
        setTimeout(() => {
            if (this.state.bac > 0.04 && this.state.bac < 0.06) {
                AlertHelper.show("success", "Optimal Buzz!", "You are in the Optimal Buzz Zone! Please drink some water.");
            }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) {
                AlertHelper.show("warn", "Slow Down", "You might want to take a break or drink some water.");
            }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) {
                AlertHelper.show("error", "Drunk", "Please drink some water or take a break from drinking.");
            }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) { this.handleModal("modal1") }
            if (this.state.bac > 0.10) { this.handleModal("modal2") }
        }, 200);
    }

    // checkBac is the main function which continually checks the users bac if the countdown is running
    // first checks to see if the length of testbuzzes is greater than or equal to one, then runs the single duration
    // method/function passing in the first drink's dateCreated in the testbuzz array, the value is assigned to variable duration
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

    // The countdownBac method starts the setInterval (countdown), to continually check the users BAC every half second (500 ms)
    // if this.state.timer is set to false, the countdown is cleared  
    countdownBac() {
        let testBacTimer;
        if (this.state.countdown === true) {
            testBacTimer = setInterval(() => this.checkBac(), 500);
            this.setState({ timer: testBacTimer })
        } else if (this.state.countdown === false) {
            clearInterval(this.state.timer)
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    // The clearDrinks method clears testbuzzes from device storage, sets this.state.testbuzzes to an empty array, and bac to 0.0
    // This method is called by clicking on the trashcan button on the drink action card.
    async clearDrinks() {
        Vibration.vibrate();
        this.setState({ testbuzzes: [], bac: 0.0 })
    }

    switchGender() {
        Vibration.vibrate();
        this.state.gender === "Male" ? this.setState({ gender: "Female", weight: 165 }) : this.setState({ gender: "Male", weight: 195 })
    }

    // The undoLastDrink method calculates the time elapsed for the last drink added, if less than 2 minutes have passed
    // the last drink is popped (removed) from the testbuzzes state array.  The new array is written to state 
    // After the checkBac function is called to recheck the new bac value. 
    async undoLastDrink() {
        var lastDrinkTime = Functions.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) {
            Vibration.vibrate();
            var undobuzz = this.state.testbuzzes;
            if (undobuzz.length >= 1) { undobuzz.pop(), this.setState({ testbuzzes: undobuzz }, () => this.checkBac()) }
        }
    }

    // the checkLastDrink function is used to determine if the last drink in the testbuzz array was added less than two minutes ago.
    // Returns true if less than 2 mins, false if more than 2 mins.  This boolean is used to conditionally display the undo button.
    checkLastDrink() {
        var lastDrinkTime = Functions.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) { return true }
        else { return false }
    }

    showHideBuzzes() {
        this.setState(prevState => ({ showHideBuzzes: !prevState.showHideBuzzes }), () => setTimeout(() => {
            if (this.state.showHideBuzzes === true) { this.scrolltop.scrollTo({ y: 550, animated: true }) }
            else { this.scrolltop.scrollTo({ y: 0, animated: true }) }
        }, 300));
        Vibration.vibrate();
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1], testbuzzes;
        (this.state.testbuzzes && this.state.testbuzzes.length > 0) &&
            (testbuzzes = Functions.reverseArray(this.state.testbuzzes).map((buzz, id) => {
                return (
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }} key={id}>
                        <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: 30, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}</Text></TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 20, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 15, padding: 5 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                    </View>
                )
            }))
        return (
            <View style={{ backgroundColor: "#ff8a80" }}>
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal1}>
                    <ScrollView style={{ backgroundColor: "#ffff8d", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        {warnText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.warnOkButton}
                                onPress={() => { this.handleModal("modal1") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {/* The second modal (red danger) is triggered when the users bac is above 0.10 */}
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal2}>
                    <ScrollView style={{ backgroundColor: "#ff5252", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        {dangerText}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.dangerOkButton}
                                onPress={() => { this.handleModal("modal2") }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {/* When navigating back to this screen, the component gets a fresh copy of data to render */}
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        {addButtonSize === true ?
                            <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>DEMO        </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>        DEMO</Text></Text>
                            :
                            <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>DEMO                </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>                DEMO</Text></Text>}
                        <View style={{ alignSelf: "center" }}>
                            <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                        </View>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😊" : "🙂"}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "☺️" : "😊"}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😀" : "☺️"}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😃</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😄</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😆</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😝</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😜</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😋" : "🤪"}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😅" : "🥴"}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac >= 0.10 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <View style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😵" : "🤮"}</Text></View><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                    </View>
                    {this.state.bac < 0.10 &&
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                {this.state.alctype === "Beer" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
                                        active={0}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Wine" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
                                        active={1}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Liquor" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                        onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
                                        active={2}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === true &&
                                    <TouchableOpacity
                                        style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                        onPress={() => this.undoLastDrink()}>
                                        <View>
                                            <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                        </View>
                                    </TouchableOpacity>}
                                {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === false &&
                                    <TouchableOpacity
                                        style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                        onPress={() => this.clearDrinks()}>
                                        <View>
                                            <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text>
                                        </View>
                                    </TouchableOpacity>}
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                    <View style={{ paddingBottom: 15 }}>
                                        <View style={styles.multiSwitchViews}>
                                            {this.state.alctype === "Beer" &&
                                                <MultiSwitch choiceSize={abvSize}
                                                    activeItemStyle={beerActive}
                                                    layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                    active={1}>
                                                    <Text style={{ fontSize: abvText }}>4%</Text>
                                                    <Text style={{ fontSize: abvText }}>5%</Text>
                                                    <Text style={{ fontSize: abvText }}>6%</Text>
                                                    <Text style={{ fontSize: abvText }}>7%</Text>
                                                    <Text style={{ fontSize: abvText }}>8%</Text>
                                                </MultiSwitch>}
                                        </View>
                                        <View style={styles.multiSwitchViews}>
                                            {this.state.alctype === "Wine" &&
                                                <MultiSwitch choiceSize={abvWineSize}
                                                    activeItemStyle={activeStyle}
                                                    layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                    active={1}>
                                                    <Text style={{ fontSize: abvWineText }}>11%</Text>
                                                    <Text style={{ fontSize: abvWineText }}>12%</Text>
                                                    <Text style={{ fontSize: abvWineText }}>13%</Text>
                                                </MultiSwitch>}
                                        </View>
                                        <View style={styles.multiSwitchViews}>
                                            {this.state.alctype === "Liquor" &&
                                                <MultiSwitch choiceSize={abvLiquorSize}
                                                    activeItemStyle={activeStyle}
                                                    layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                    onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
                                                    active={1}>
                                                    <Text style={{ fontSize: abvLiquorText }}>30%</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>40%</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>50%</Text>
                                                </MultiSwitch>}
                                        </View>
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                        {this.state.alctype === "Beer" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                        {this.state.alctype === "Wine" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>5oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>8oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {/* Based on this.state.abv, a different multiswitch is rendered with the selected abv */}
                                        {this.state.alctype === "Liquor" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>1.5oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>3oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>6oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                </View>
                                {this.state.alctype === "Beer" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>+🍺</Text></TouchableOpacity>}
                                {this.state.alctype === "Wine" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>+🍷</Text></TouchableOpacity>}
                                {this.state.alctype === "Liquor" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>{Platform.OS === 'android' && Platform.Version < 24 ? "+🍸" : "+🥃"}</Text></TouchableOpacity>}
                            </View>
                        </View>}
                    {this.state.bac > 0.10 &&
                        <View style={styles.cardView}>
                            {abovePoint10}
                            {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === true &&
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity
                                        style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                        onPress={() => this.undoLastDrink()}>
                                        <View>
                                            <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                        </View>}
                    {(this.state.testbuzzes && this.state.testbuzzes.length > 0) &&
                        <View style={{ flexDirection: "column", backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>Current Buzz</Text>
                                {this.state.showHideBuzzes === false && (
                                    <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes()}>
                                        <Text style={styles.buttonText}>Show</Text></TouchableOpacity>)}
                                {this.state.showHideBuzzes === true && (
                                    <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes()}>
                                        <Text style={styles.buttonText}>Hide</Text></TouchableOpacity>)}
                            </View>
                            {this.state.showHideBuzzes === true && <View>{testbuzzes}</View>}
                        </View>}
                    <View style={styles.cardView}>
                        <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch Gender ♂♀</Text></TouchableOpacity>
                        <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                        </View>
                        <Text style={{ fontSize: 25, textAlign: "center", padding: 20 }}>Enter Weight - lbs.</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <NumericInput
                                minValue={50}
                                maxValue={500}
                                initValue={this.state.weight}
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
                    </View>
                    <View style={{ paddingTop: 20 }}></View>
                </ScrollView>
            </View >
        );
    }
}

export default DemoScreen;
