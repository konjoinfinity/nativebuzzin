// imports to be used within the DemoScreen
import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Modal
} from 'react-native';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import NumericInput from 'react-native-numeric-input'
import RNSpeedometer from 'react-native-speedometer'
import { NavigationEvents } from "react-navigation";
import { AlertHelper } from './AlertHelper';

// Main ProfileScreen component
class DemoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: "Male",
            weight: 180,
            bac: 0.0,
            testbuzzes: [],
            alctype: "Beer",
            oz: 12,
            abv: 0.05,
            countdown: false,
            timer: "",
            modal1Visible: false,
            modal2Visible: false
        }
        // Bind statements are used to ensure data is changed in state by a function/method defined below
        // Binding respective state changes above 
        this.addDrink = this.addDrink.bind(this);
        this.varGetBAC = this.varGetBAC.bind(this);
        this.checkBac = this.checkBac.bind(this);
        this.singleDuration = this.singleDuration.bind(this);
        this.getDayHourMin = this.getDayHourMin.bind(this);
        this.clearDrinks = this.clearDrinks.bind(this);
        this.handleAbv = this.handleAbv.bind(this);
        this.handleOz = this.handleOz.bind(this);
        this.handleDrinkType = this.handleDrinkType.bind(this);
        this.switchGender = this.switchGender.bind(this);
        this.countdownBac = this.countdownBac.bind(this);
    };

    // When the DemoScreen is first rendered, the checkBac function is triggered getting the most up to date BAC reading
    async componentDidMount() {
        setTimeout(() => {
            this.checkBac();
        }, 200);
    }

    // setModal1Visible makes modal1 visible or invisible, sets the state to boolean
    setModal1Visible(visible) {
        this.setState({ modal1Visible: visible });
    }

    // handleModal1 hides modal1 when user presses the Ok button
    handleModal1() {
        Vibration.vibrate();
        this.setModal1Visible(!this.state.modal1Visible);
    }

    // setModal2Visible makes modal1 visible or invisible, sets the state to boolean
    setModal2Visible(visible) {
        this.setState({ modal2Visible: visible });
    }

    // handleModal2 hides modal1 when user presses the Ok button
    handleModal2() {
        Vibration.vibrate();
        this.setModal2Visible(!this.state.modal2Visible);
    }

    // The getDayHourMin passes in two timestamps (dates) and calculates the duration between the two
    // returns the values in and array of [days, hours, minutes, seconds]
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

    // The singleDuration method takes a timestamp argument of the first drink in the current buzz array
    // It calculates the duration between that timestamp and the a current timestamp (when the function is run)
    // The duration is calculated and the value is returned in hours, (this utlilizes the getDayHourMin method)
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

    // varGetBAC (VariableGetBAC) This method is the most important part of the app paried with the two methods (getDayHourMin & singleDuration)
    // It takes weight (user weight), gender (user gender), hours (duration elapsed since the first drink was added),
    // and buzz (this.state.buzz - buzz array) as parameters.  Distribution is different depending on the user gender.
    // The method then loops through the current buzz array and calculates the total bac based on each variable drink
    // type, abv, and ounce size.  Returns the total bac 
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
            // Once each iteration of the loop is finished the single drink is pushed into the array
            totalArray.push(drinkTotal)
        }
        // After the loop is completed, all values are added together
        totalAlc = totalArray.reduce((a, b) => a + b, 0)
        // The total BAC is calculated based on the total of all values, weight, distribution, and hours (duration elapsed)
        var bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
        return bac;
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
                AlertHelper.show("success", "Optimal Buzz!", "You are in the Optimal Buzz Zone!");
            }
            if (this.state.bac > 0.06 && this.state.bac < 0.07) {
                AlertHelper.show("warn", "Slow Down", "You might want to take a break or drink some water.");
            }
            if (this.state.bac > 0.07 && this.state.bac < 0.08) {
                AlertHelper.show("error", "Drunk", "Please drink some water or take a break from drinking.");
            }
            if (this.state.bac > 0.08 && this.state.bac < 0.10) {
                this.setModal1Visible(true)
            }
            if (this.state.bac > 0.10) {
                this.setModal2Visible(true)
            }
        }, 200);
    }

    // checkBac is the main function which continually checks the users bac if the countdown is running
    // first checks to see if the length of testbuzzes is greater than or equal to one, then runs the single duration
    // method/function passing in the first drink's dateCreated in the testbuzz array, the value is assigned to variable duration
    async checkBac() {
        if (this.state.testbuzzes.length >= 1) {
            var duration = this.singleDuration(this.state.testbuzzes[0].dateCreated);
            // Next, the varBAC function is called passing in the users weight, gender, duration variable, and the current testbuzzes state
            // The return is assigned to the variable totalBac.
            var totalBac = this.varGetBAC(
                this.state.weight,
                this.state.gender,
                duration,
                this.state.testbuzzes
            )
            // A conditional is then assessed, if totalBac is greater than 0, the value of
            // bac is rounded to 6 decmimal places.  Then this.state.bac is set to totalBac.
            if (totalBac > 0) {
                totalBac = parseFloat(totalBac.toFixed(6));
                this.setState({ bac: totalBac })
                // A second conditional is then assessed, and if
                // the countdown is not running, this.state.countdown is then set to true and countdownBac method is then triggered.
                if (this.state.countdown === false) {
                    this.setState({ countdown: true }, () => this.countdownBac())
                }
                // If totalBac is less than 0, countdown is set to false, bac is set to 0.0, and testbuzzes is set to an empty array.
                // Then countdownBac method is then triggered.
            } else {
                this.setState({ testbuzzes: [], bac: 0.0, countdown: false }, () => this.countdownBac())
            }
            // If this.state.testbuzzes.length is equal to 0, countdown is set to false and bac is set to 0.0.
            // Then countdownBac method is then triggered.
        } else if (this.state.testbuzzes.length === 0) {
            this.setState({ bac: 0.0, countdown: false }, () => this.countdownBac())
        }
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

    // The handleOz function handles alcohol ounce size changes to the oz multi selector.  This handles based on this.state.alctype
    // ("Beer", "Wine", or "Liquor"), based on the number passed in as the parameter from the front end selector, the associated
    // ounce value is selected and written to this.state.oz
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

    // The handleAbv function handles alcohol by volume changes to the abv multi selector.  This handles based on this.state.alctype
    // ("Beer", "Wine", or "Liquor"), based on the number passed in as the parameter from the front end selector, the associated
    // abv value is selected and written to this.state.abv
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

    // The handleDrinkType function handles alcohol default value changes to the alctype multi selector.  This handles based on 
    // the value passed in as the parameter ("Beer", "Wine", or "Liquor")from the front end selector, the associated
    // abv and ounce values are selected and written to this.state.abv & this.state.oz
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

    // This function switches the gender when the switch gender button it pressed, the opposite gender is written to state
    switchGender() {
        Vibration.vibrate();
        if (this.state.gender === "Male") {
            this.setState({ gender: "Female" })
        }
        if (this.state.gender === "Female") {
            this.setState({ gender: "Male" })
        }
    }

    // The undoLastDrink method calculates the time elapsed for the last drink added, if less than 2 minutes have passed
    // the last drink is popped (removed) from the testbuzzes state array.  The new array is written to state 
    // After the checkBac function is called to recheck the new bac value. 
    async undoLastDrink() {
        var lastDrinkTime = this.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) {
            Vibration.vibrate();
            var undobuzz = this.state.testbuzzes;
            if (undobuzz.length >= 1) {
                undobuzz.pop();
                this.setState({ testbuzzes: undobuzz }, () => this.checkBac())
            }
        }
    }

    // the checkLastDrink function is used to determine if the last drink in the testbuzz array was added less than two minutes ago.
    // Returns true if less than 2 mins, false if more than 2 mins.  This boolean is used to conditionally display the undo button.
    checkLastDrink() {
        var lastDrinkTime = this.singleDuration(this.state.testbuzzes[this.state.testbuzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) {
            return true
        } else {
            return false
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
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal1Visible}>
                    <View style={{ backgroundColor: "#ffff8d", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>Warning!</Text>
                        <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold" }}>Your BAC is now above the legal drinking limit in most states.
                        Please consider one of the following:</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Drinking a glass of water.</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Taking a break from drinking for at least an hour.</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Calling a friend, Uber, or Lyft to come pick you up.</Text>
                        <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold" }}>If you continue drinking:</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Your decision making abilities could be impaired.  You should NOT drive an automobile or operate heavy machinery.  You could have a hangover tomorrow morning.  You might do something you regret.  You could injure yourself or others.  You could end up in legal trouble or jail.</Text>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>YOU are liable for all decisions made from now on, you have been advised and warned.</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.warnOkButton}
                                onPress={() => { this.handleModal1() }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal2Visible}>
                    <View style={{ backgroundColor: "#ff5252", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>Danger!</Text>
                        <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>Your BAC is well above the legal drinking limit.
                        Please do one of the following:</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Drink only water from now on.</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Take a break from drinking for at least two hours.</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Call a friend, Uber, or Lyft to pick you up.</Text>
                        <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>If you continue drinking:</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Your decision making abilities will be impaired.  Do NOT drive an automobile or operate heavy machinery.  You will have a hangover tomorrow morning.  You will likely do something you regret.  You will likely injure yourself or others.  You will likely end up in legal trouble or jail.</Text>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>YOU are liable for all decisions made from now on, you have been advised and warned.</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.dangerOkButton}
                                onPress={() => { this.handleModal2() }}>
                                <Text style={styles.buttonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ textAlign: "center", color: "#00bfa5", fontWeight: "bold" }}>|                          |</Text>
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
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>0.0  😶</Text></TouchableOpacity>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🙂</Text></TouchableOpacity>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  😊</Text></TouchableOpacity>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  ☺️</Text></TouchableOpacity>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}  😃</Text></TouchableOpacity>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: 30 }}>Optimal </Text>
                            <TouchableOpacity style={[styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}  😄</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: 30 }}>Optimal </Text>
                            <TouchableOpacity style={[styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "teal" }}>{this.state.bac}  😆</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  😝</Text></TouchableOpacity>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  😜</Text></TouchableOpacity>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🤪</Text></TouchableOpacity>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>{this.state.bac}  🥴</Text></TouchableOpacity>)}
                        {this.state.bac >= 0.10 && (
                            <TouchableOpacity style={[styles.bac, { backgroundColor: gaugeColor }]}>
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
                            {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === true ?
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={() => this.undoLastDrink()}>
                                    <View>
                                        <Text style={{ fontSize: 30 }}>↩️</Text>
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={() => this.clearDrinks()}>
                                    <View>
                                        <Text style={{ fontSize: 30 }}>🗑</Text>
                                    </View>
                                </TouchableOpacity>}
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
                        <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch Gender ♂♀</Text></TouchableOpacity>
                        <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 20 }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 20 }}>Enter Weight - lbs.</Text>
                        <NumericInput
                            minValue={50}
                            maxValue={500}
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

// Noraml export of DemoScreen for use throughout the App
export default DemoScreen;

// Styles are defined
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
    },
    dangerOkButton: {
        borderWidth: 1,
        borderColor: "#AE0000",
        backgroundColor: "#AE0000",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    warnOkButton: {
        borderWidth: 1,
        borderColor: "#f9a825",
        backgroundColor: "#f9a825",
        padding: 15,
        margin: 5,
        borderRadius: 15
    }
})
