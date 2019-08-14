import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Alert,
    Modal,
    Dimensions,
    PixelRatio,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { AlertHelper } from './AlertHelper';
import { NavigationEvents } from "react-navigation";
import RNSpeedometer from 'react-native-speedometer'
import moment from "moment";

const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const oldkey = "oldbuzzes"
const breakkey = "break"
const breakdatekey = "breakdate"
const autobreakkey = "autobreak"

const CopilotView = walkthroughable(View);

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
            alctype: "Beer",
            oz: 12,
            abv: 0.05,
            countdown: false,
            timer: "",
            break: "",
            breakdate: "",
            breaktime: "",
            autobreak: "",
            focus: false,
            modal1Visible: false,
            modal2Visible: false,
            flashwarning: "#AE0000",
            flashtext: "",
            flashtimer: ""
        }
        this.addDrink = this.addDrink.bind(this);
        this.varGetBAC = this.varGetBAC.bind(this);
        this.checkBac = this.checkBac.bind(this);
        this.singleDuration = this.singleDuration.bind(this);
        this.getDayHourMin = this.getDayHourMin.bind(this);
        this.saveBuzz = this.saveBuzz.bind(this);
        this.clearDrinks = this.clearDrinks.bind(this);
        this.moveToOld = this.moveToOld.bind(this);
        this.handleAbv = this.handleAbv.bind(this);
        this.handleOz = this.handleOz.bind(this);
        this.handleDrinkType = this.handleDrinkType.bind(this);
        this.handleStepChange = this.handleStepChange.bind(this);
        this.countdownBac = this.countdownBac.bind(this);
        this.stopBreak = this.stopBreak.bind(this);
        this.flashWarning = this.flashWarning.bind(this);
    };

    async componentDidMount() {
        await AsyncStorage.getItem(autobreakkey, (error, result) => {
            if (result !== null) {
                this.setState({ autobreak: JSON.parse(result) })
            }
        })
        await AsyncStorage.getItem(breakkey, (error, result) => {
            if (result !== null) {
                this.setState({ break: JSON.parse(result) })
            }
        })
        await AsyncStorage.getItem(breakdatekey, (error, result) => {
            if (result !== null) {
                this.setState({ breakdate: JSON.parse(result) })
                setTimeout(() => {
                    var date1 = Date.parse(this.state.breakdate)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = this.getDayHourMin(date2, date1);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    if (days + hours + minutes + seconds < 0) {
                        this.stopBreak()
                    }
                    this.setState({ breaktime: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.` })
                }, 100);
            }
        })
        await AsyncStorage.getItem(namekey, (error, result) => {
            this.setState({ name: JSON.parse(result) })
        })
        await AsyncStorage.getItem(genderkey, (error, result) => {
            this.setState({ gender: JSON.parse(result) })
        })
        await AsyncStorage.getItem(weightkey, (error, result) => {
            this.setState({ weight: JSON.parse(result) })
        })
        // To seed data, comment out just this function and add data to the buzz array
        await AsyncStorage.getItem(key, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ buzzes: JSON.parse(result) })
            } else {
                this.setState({ buzzes: [] })
            }
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) }, () => this.checkBac())
            }
            else {
                this.setState({ oldbuzzes: [] }, () => this.checkBac())
            }
        })
        const login = this.props.navigation.getParam('login');
        if (login === true) {
            this.props.copilotEvents.on('stepChange', this.handleStepChange);
            setTimeout(() => {
                this.props.start();
                this.props.navigation.setParams({ login: false });
            }, 1000);
        }
        setTimeout(() => {
            this.setState({ focus: true })
            this.checkBac()
        }, 1050);
        var happyHour = new Date()
        console.log(happyHour)
        happyHour = moment(happyHour).local();
        console.log(happyHour)
        happyHour = happyHour.hours();
        console.log(happyHour)
        if (happyHour >= 17 && happyHour <= 5) {
            console.log("It's happy hour, enjoy!")
        } else {
            console.log("Happy hour isn't until 5pm")
        }
    }

    componentWillUnmount() {
        this.props.copilotEvents.off('stop');
        clearInterval(this.state.timer)
    }

    setModal1Visible(visible) {
        this.setState({ modal1Visible: visible });
    }

    handleModal1() {
        Vibration.vibrate();
        this.setModal1Visible(!this.state.modal1Visible);
    }

    setModal2Visible(visible) {
        this.setState({ modal2Visible: visible });
    }

    handleModal2() {
        Vibration.vibrate();
        this.setModal2Visible(!this.state.modal2Visible);
    }

    handleStepChange = (step) => {
        if (step.order === 1 || step.order === 2 || step.order === 3 || step.order === 7) {
            setTimeout(() => {
                this.addDrink()
            }, 1000);
            setTimeout(() => {
                this.addDrink()
            }, 2000);
            if (step.order === 1 || step.order === 2 || step.order === 3) {
                setTimeout(() => {
                    this.clearDrinks()
                }, 3000);
            }
        }
        if (step.order === 4) {
            setTimeout(() => {
                this.setState({ alctype: "Wine" })
            }, 1000);
            setTimeout(() => {
                this.setState({ alctype: "Liquor" })
            }, 2000);
            setTimeout(() => {
                this.setState({ alctype: "Beer" })
            }, 3000);
        }
        if (step.order === 5) {
            setTimeout(() => {
                this.setState({ abv: 0.06 })
            }, 1000);
            setTimeout(() => {
                this.setState({ abv: 0.07 })
            }, 2000);
            setTimeout(() => {
                this.setState({ abv: 0.08 })
            }, 3000);
            setTimeout(() => {
                this.setState({ abv: 0.04 })
            }, 4000);
            setTimeout(() => {
                this.setState({ abv: 0.05 })
            }, 5000);
        }
        if (step.order === 6) {
            setTimeout(() => {
                this.setState({ oz: 16 })
            }, 1000);
            setTimeout(() => {
                this.setState({ oz: 20 })
            }, 2000);
            setTimeout(() => {
                this.setState({ oz: 12 })
            }, 3000);
        }
        if (step.order === 8) {
            setTimeout(() => {
                this.undoLastDrink()
            }, 1000);
            setTimeout(() => {
                this.clearDrinks()
            }, 2000);
        }
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
        this.setState(prevState => ({ buzzes: [...prevState.buzzes, { drinkType: this.state.alctype, dateCreated: drinkDate, oz: this.state.oz, abv: this.state.abv }] }), () => this.checkBac())
        setTimeout(() => {
            this.saveBuzz();
            this.flashWarning();
            if (this.state.bac > 0.04 && this.state.bac < 0.06) {
                AlertHelper.show("success", "Optimal Buzz!", "You are in the Optimal Buzz Zone! Please drink some water.");
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

    async saveBuzz() {
        await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
    }

    async checkBac() {
        if (this.state.buzzes.length >= 1) {
            var duration = this.singleDuration(this.state.buzzes[0].dateCreated);
            var totalBac = this.varGetBAC(
                this.state.weight,
                this.state.gender,
                duration,
                this.state.buzzes
            )
            if (totalBac > 0) {
                totalBac = parseFloat(totalBac.toFixed(6));
                this.setState({ bac: totalBac })
                if (this.state.countdown === false) {
                    this.setState({ countdown: true }, () => this.countdownBac())
                }
            } else {
                this.setState({ countdown: false }, () => clearInterval(this.state.timer))
                setTimeout(() => this.setState({ timer: "" }, () => this.moveToOld()), 200);
            }
        } else if (this.state.buzzes.length === 0) {
            this.setState({ bac: 0.0, countdown: false }, () => clearInterval(this.state.timer))
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    flashWarning() {
        var flashTimer;
        if (this.state.bac > 0.06) {
            this.setState({ flashtext: true })
        } else if (this.state.bac < 0.06) {
            this.setState({ flashtext: false })
        }
        setTimeout(() => {
            if (this.state.flashtext === true) {
                flashTimer = setInterval(() => {
                    if (this.state.flashwarning === "#00bfa5") {
                        this.setState({ flashwarning: "#AE0000" })
                    } else if (this.state.flashwarning === "#AE0000") {
                        this.setState({ flashwarning: "#00bfa5" })
                    }
                }, 800);
                this.setState({ flashtimer: flashTimer })
            }
            if (this.state.flashtext === false) {
                if (this.state.flashtimer !== "") {
                    clearInterval(this.state.flashtimer)
                    this.setState({ flashtimer: "", flashtext: "" })
                }
            }
        }, 200);
    }

    countdownBac() {
        let bacTimer;
        if (this.state.countdown === true) {
            bacTimer = setInterval(() => this.checkBac(), 500);
            this.setState({ timer: bacTimer })
        } else if (this.state.countdown === false) {
            clearInterval(this.state.timer)
            setTimeout(() => this.setState({ timer: "" }), 200);
        }
    }

    async moveToOld() {
        var oldbuzzarray = this.state.oldbuzzes;
        var newbuzzarray = this.state.buzzes;
        oldbuzzarray.push(newbuzzarray);
        await AsyncStorage.setItem(oldkey, JSON.stringify(oldbuzzarray))
        await AsyncStorage.removeItem(key, () => { this.setState({ buzzes: [], bac: 0.0, oldbuzzes: [] }) })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                setTimeout(() => {
                    this.setState({ oldbuzzes: JSON.parse(result) })
                }, 200);
            }
        })
        if (this.state.autobreak === true) {
            var autoBreakDate = new Date();
            autoBreakDate.setDate(autoBreakDate.getDate() + 1);
            this.setState({ break: true, breakdate: autoBreakDate })
            await AsyncStorage.setItem(breakkey, JSON.stringify(true))
            await AsyncStorage.setItem(breakdatekey, JSON.stringify(autoBreakDate), () => this.componentDidMount())
        }
    }

    async clearDrinks() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(key, () => {
            this.setState({ buzzes: [], bac: 0.0 })
        })
    }

    async undoLastDrink() {
        var lastDrinkTime = this.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) {
            Vibration.vibrate();
            var undobuzz;
            await AsyncStorage.getItem(key, (error, result) => {
                if (result !== null) {
                    undobuzz = JSON.parse(result)
                    undobuzz.pop();
                    this.setState({ buzzes: undobuzz })
                }
            })
            await AsyncStorage.setItem(key, JSON.stringify(undobuzz), () => { this.checkBac() })
        }
    }

    checkLastDrink() {
        var lastDrinkTime = this.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) {
            return true
        } else {
            return false
        }
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

    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false })
        await AsyncStorage.setItem(breakkey, JSON.stringify(false))
        await AsyncStorage.removeItem(breakdatekey)
    }

    cancelBreakAlert() {
        Vibration.vibrate();
        Alert.alert(
            'Are you sure?',
            'Click Yes to cancel break, No to continue break',
            [
                { text: 'Yes', onPress: () => this.stopBreak() },
                { text: 'No' },
            ],
            { cancelable: false },
        );
    }

    render() {
        var gaugeSize;
        var bacTextSize;
        var alcTypeSize;
        var alcTypeText;
        var abvText;
        var abvSize;
        var abvWineText;
        var abvWineSize;
        var abvLiquorText;
        var abvLiquorSize;
        var addButtonText;
        var addButtonSize;
        if (Dimensions.get('window').width * PixelRatio.get() < 750) {
            gaugeSize = 295
            bacTextSize = 20
            alcTypeSize = 50
            alcTypeText = 20
            abvText = 15
            abvSize = 40
            abvWineText = 15
            abvWineSize = 40
            abvLiquorText = 15
            abvLiquorSize = 40
            addButtonText = 30
            addButtonSize = true
        } else if (Dimensions.get('window').width * PixelRatio.get() >= 750 && Dimensions.get('window').width * PixelRatio.get() < 828) {
            gaugeSize = 350
            bacTextSize = 30
            alcTypeSize = 75
            alcTypeText = 30
            abvText = 18
            abvSize = 45
            abvWineText = 20
            abvWineSize = 50
            abvLiquorText = 20
            abvLiquorSize = 50
            addButtonText = 40
            addButtonSize = false
        } else if (Dimensions.get('window').width * PixelRatio.get() === 828) {
            gaugeSize = 390
            bacTextSize = 30
            alcTypeSize = 75
            alcTypeText = 30
            abvText = 18
            abvSize = 45
            abvWineText = 20
            abvWineSize = 50
            abvLiquorText = 20
            abvLiquorSize = 50
            addButtonText = 40
            addButtonSize = false
        } else if (Dimensions.get('window').width * PixelRatio.get() === 1125) {
            gaugeSize = 350
            bacTextSize = 30
            alcTypeSize = 75
            alcTypeText = 30
            abvText = 18
            abvSize = 45
            abvWineText = 20
            abvWineSize = 50
            abvLiquorText = 20
            abvLiquorSize = 50
            addButtonText = 40
            addButtonSize = false
        } else if (Dimensions.get('window').width * PixelRatio.get() > 1125) {
            gaugeSize = 390
            bacTextSize = 30
            alcTypeSize = 75
            alcTypeText = 30
            abvText = 18
            abvSize = 45
            abvWineText = 20
            abvWineSize = 50
            abvLiquorText = 20
            abvLiquorSize = 50
            addButtonText = 40
            addButtonSize = false
        } else {
            gaugeSize = 350
            bacTextSize = 28
            alcTypeSize = 65
            alcTypeText = 28
            abvText = 18
            abvSize = 45
            abvWineText = 18
            abvWineSize = 45
            abvLiquorText = 18
            abvLiquorSize = 50
            addButtonText = 40
            addButtonSize = false
        }
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
                    <ScrollView style={{ backgroundColor: "#ffff8d", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
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
                    </ScrollView>
                </Modal>
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal2Visible}>
                    <ScrollView style={{ backgroundColor: "#ff5252", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
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
                    </ScrollView>
                </Modal>
                {this.state.focus === true && <NavigationEvents onWillFocus={() => this.componentDidMount()} />}
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <CopilotStep text="These tick marks show the optimal buzz range." order={3} name="ticks">
                            <CopilotView>
                                {/* {addButtonSize === true ? */}
                                {this.state.bac > 0.06 ?
                                    <Text style={{ fontWeight: "bold", textAlign: "center", color: this.state.flashwarning }}><Text>WARNING        </Text><Text>|        STOP       |</Text><Text>       DRINKING</Text></Text>
                                    :
                                    <Text style={{ fontWeight: "bold", textAlign: "center", color: "#00bfa5" }}>|                          |</Text>}
                            </CopilotView>
                        </CopilotStep>
                        <CopilotStep text="This gauge displays your BAC." order={1} name="gauge">
                            <CopilotView style={{ alignSelf: "center" }}>
                                <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={[
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
                            </CopilotView>
                        </CopilotStep>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (
                            <CopilotStep text="This readout automatically calculates your current BAC." order={2} name="bac">
                                <CopilotView>
                                    <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>  0.0  </Text></TouchableOpacity>
                                </CopilotView>
                            </CopilotStep>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  🙂</Text></TouchableOpacity>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😊</Text></TouchableOpacity>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  ☺️</Text></TouchableOpacity>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😃</Text></TouchableOpacity>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😄</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}>Optimal </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😆</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30 }}> Buzz!</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😝</Text></TouchableOpacity>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😜</Text></TouchableOpacity>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  🤪</Text></TouchableOpacity>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  🥴</Text></TouchableOpacity>)}
                        {this.state.bac >= 0.10 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  🤮</Text></TouchableOpacity>)}
                    </View>
                    {(this.state.break === "" || this.state.break === false) &&
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                {this.state.alctype === "Beer" &&
                                    <CopilotStep text="Press each icon to change drink type." order={4} name="drink">
                                        <CopilotView>
                                            <MultiSwitch choiceSize={alcTypeSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                                active={0}>
                                                <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                                <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                                <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                            </MultiSwitch>
                                        </CopilotView>
                                    </CopilotStep>}
                                {this.state.alctype === "Wine" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => (styles.multiSwitch))}
                                        onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                        active={1}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                {this.state.alctype === "Liquor" &&
                                    <MultiSwitch choiceSize={alcTypeSize}
                                        activeItemStyle={activeStyle}
                                        layout={{ vertical: 0, horizontal: -1 }}
                                        containerStyles={_.times(3, () => (styles.multiSwitch))}
                                        onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                        active={2}>
                                        <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                        <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                        <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                    </MultiSwitch>}
                                <CopilotStep text="Press to undo last drink." order={8} name="clear">
                                    <CopilotView>
                                        {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
                                            <TouchableOpacity
                                                style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                                onPress={() => this.undoLastDrink()}>
                                                <View>
                                                    <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                                </View>
                                            </TouchableOpacity>}
                                    </CopilotView>
                                </CopilotStep>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, flexDirection: "column", paddingBottom: 5 }}>
                                    <View style={{ paddingBottom: 15 }}>
                                        <View style={styles.multiSwitchViews}>
                                            {this.state.alctype === "Beer" &&
                                                <CopilotStep text="Press each percent to change drink ABV." order={5} name="abv">
                                                    <CopilotView>
                                                        {this.state.abv === 0.05 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => (styles.multiSwitch))}
                                                                onActivate={(number) => { this.handleAbv(number) }}
                                                                active={1}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {this.state.abv === 0.06 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => (styles.multiSwitch))}
                                                                onActivate={(number) => { this.handleAbv(number) }}
                                                                active={2}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {this.state.abv === 0.07 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => (styles.multiSwitch))}
                                                                onActivate={(number) => { this.handleAbv(number) }}
                                                                active={3}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {this.state.abv === 0.08 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => (styles.multiSwitch))}
                                                                onActivate={(number) => { this.handleAbv(number) }}
                                                                active={4}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                        {this.state.abv === 0.04 &&
                                                            <MultiSwitch choiceSize={abvSize}
                                                                activeItemStyle={beerActive}
                                                                layout={{ vertical: 0, horizontal: -1 }}
                                                                containerStyles={_.times(5, () => (styles.multiSwitch))}
                                                                onActivate={(number) => { this.handleAbv(number) }}
                                                                active={0}>
                                                                <Text style={{ fontSize: abvText }}>4%</Text>
                                                                <Text style={{ fontSize: abvText }}>5%</Text>
                                                                <Text style={{ fontSize: abvText }}>6%</Text>
                                                                <Text style={{ fontSize: abvText }}>7%</Text>
                                                                <Text style={{ fontSize: abvText }}>8%</Text>
                                                            </MultiSwitch>}
                                                    </CopilotView>
                                                </CopilotStep>}
                                        </View>
                                        <View style={styles.multiSwitchViews}>
                                            {this.state.alctype === "Wine" &&
                                                <MultiSwitch choiceSize={abvWineSize}
                                                    activeItemStyle={activeStyle}
                                                    layout={{ vertical: 0, horizontal: -1 }}
                                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                    onActivate={(number) => { this.handleAbv(number) }}
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
                                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                    onActivate={(number) => { this.handleAbv(number) }}
                                                    active={1}>
                                                    <Text style={{ fontSize: abvLiquorText }}>30%</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>40%</Text>
                                                    <Text style={{ fontSize: abvLiquorText }}>50%</Text>
                                                </MultiSwitch>}
                                        </View>
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {this.state.alctype === "Beer" &&
                                            <CopilotStep text="Press each number to change drink size." order={6} name="oz">
                                                <CopilotView>
                                                    {this.state.oz === 12 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                            onActivate={(number) => { this.handleOz(number) }}
                                                            active={0}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                    {this.state.oz === 16 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                            onActivate={(number) => { this.handleOz(number) }}
                                                            active={1}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                    {this.state.oz === 20 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                            onActivate={(number) => { this.handleOz(number) }}
                                                            active={2}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                </CopilotView>
                                            </CopilotStep>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {this.state.alctype === "Wine" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                onActivate={(number) => { this.handleOz(number) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>5oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>8oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                    <View style={styles.multiSwitchViews}>
                                        {this.state.alctype === "Liquor" &&
                                            <MultiSwitch choiceSize={abvLiquorSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => (styles.multiSwitch))}
                                                onActivate={(number) => { this.handleOz(number) }}
                                                active={0}>
                                                <Text style={{ fontSize: abvLiquorText }}>1.5oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>3oz</Text>
                                                <Text style={{ fontSize: abvLiquorText }}>6oz</Text>
                                            </MultiSwitch>}
                                    </View>
                                </View>
                                {this.state.alctype === "Beer" &&
                                    <CopilotStep text="Press to add drink with selected options." order={7} name="add">
                                        <CopilotView>
                                            <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                                <Text style={{ fontSize: addButtonText, color: "white" }}>+🍺</Text></TouchableOpacity>
                                        </CopilotView>
                                    </CopilotStep>}
                                {this.state.alctype === "Wine" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>+🍷</Text></TouchableOpacity>}
                                {this.state.alctype === "Liquor" &&
                                    <TouchableOpacity onPress={() => this.addDrink()} style={addButtonSize === true ? styles.smallAddButton : styles.addButton}>
                                        <Text style={{ fontSize: addButtonText, color: "white" }}>{Platform.OS === 'android' && Platform.Version < 24 ? "+🍸" : "+🥃"}</Text></TouchableOpacity>}
                            </View>
                        </View>}
                    {this.state.break === true &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break for:</Text>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>{this.state.breaktime}</Text>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}> Keep up the good work!</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelBreakAlert()}>
                                <Text style={styles.buttonText}>Cancel Break</Text>
                            </TouchableOpacity>
                        </View>}
                </ScrollView>
            </View>
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);

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
    smallbac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 0,
        marginBottom: 0,
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
    smalloptimalbac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 0,
        marginBottom: 0,
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
    smallAddButton: {
        borderRadius: 50,
        backgroundColor: "#1de9b6",
        opacity: 0.8,
        height: 70,
        width: 70,
        margin: 5,
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
    smallUndoButton: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        }
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
    undoButton: {
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
