import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Modal,
    Dimensions,
    PixelRatio,
    Platform
} from 'react-native';
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';
import NumericInput from 'react-native-numeric-input'
import RNSpeedometer from 'react-native-speedometer'
import { NavigationEvents } from "react-navigation";
import { AlertHelper } from './AlertHelper';

var screenWidth = Dimensions.get('window').width * PixelRatio.get()
var screenHeight = Dimensions.get('window').height * PixelRatio.get()
console.log(screenWidth + " x " + screenHeight)

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
var multiSwitchMargin;

if (screenWidth <= 600) {
    console.log("less than 600")
    gaugeSize = 230
    bacTextSize = 13
    alcTypeSize = 38
    alcTypeText = 13
    abvText = 11
    abvSize = 38
    abvWineText = 11
    abvWineSize = 38
    abvLiquorText = 11
    abvLiquorSize = 38
    addButtonText = 20
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth === 720 && screenHeight === 1280) {
    console.log("720x1280")
    gaugeSize = 320
    bacTextSize = 20
    alcTypeSize = 60
    alcTypeText = 25
    abvText = 18
    abvSize = 40
    abvWineText = 18
    abvWineSize = 50
    abvLiquorText = 18
    abvLiquorSize = 50
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth > 600 && screenWidth < 750) {
    console.log("greater than 600 & less than 750")
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
    multiSwitchMargin = 0
} else if (screenWidth === 768 || screenWidth === 1080 && screenHeight === 1776) {
    console.log("768 or equal to 1080 x 1776")
    gaugeSize = 300
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
    multiSwitchMargin = 0
} else if (screenWidth >= 750 && screenWidth < 828) {
    console.log("greater or equal to 750 & less than 828")
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
    multiSwitchMargin = 0
} else if (screenWidth === 828 || screenWidth === 1242 && screenHeight === 2688) {
    console.log("828 or 1242 x 2688")
    gaugeSize = 390
    bacTextSize = 35
    alcTypeSize = 90
    alcTypeText = 40
    abvText = 20
    abvSize = 50
    abvWineText = 25
    abvWineSize = 60
    abvLiquorText = 25
    abvLiquorSize = 60
    addButtonText = 45
    addButtonSize = false
    multiSwitchMargin = 15
} else if (screenWidth === 1440 && screenHeight === 2712 || screenWidth === 1440 && screenHeight === 2792 || screenWidth === 1440 && screenHeight === 2621) {
    console.log("1440 x 2712/2792/2621")
    gaugeSize = 380
    bacTextSize = 30
    alcTypeSize = 80
    alcTypeText = 35
    abvText = 20
    abvSize = 50
    abvWineText = 22
    abvWineSize = 55
    abvLiquorText = 20
    abvLiquorSize = 55
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 8
} else if (screenWidth === 1080 && screenHeight === 2028) {
    console.log("1080 x 2028")
    gaugeSize = 365
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
    multiSwitchMargin = 6
} else if (screenWidth === 1125) {
    console.log("1125")
    gaugeSize = 350
    bacTextSize = 30
    alcTypeSize = 80
    alcTypeText = 35
    abvText = 18
    abvSize = 40
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 12
} else if (screenWidth === 1242) {
    console.log("1242")
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
    multiSwitchMargin = 8
} else if (screenWidth === 1440 && screenHeight !== 2712) {
    console.log("1440")
    gaugeSize = 390
    bacTextSize = 25
    alcTypeSize = 70
    alcTypeText = 25
    abvText = 18
    abvSize = 45
    abvWineText = 18
    abvWineSize = 45
    abvLiquorText = 15
    abvLiquorSize = 45
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth > 1125) {
    console.log("greater than 1125")
    gaugeSize = 390
    bacTextSize = 25
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
    multiSwitchMargin = 0
} else {
    console.log("else")
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
    multiSwitchMargin = 0
}

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
            modal1Visible: false,
            modal2Visible: false
        }
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

    async componentDidMount() {
        setTimeout(() => {
            this.checkBac();
        }, 200);
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
            if (this.state.bac > 0.08 && this.state.bac < 0.10) {
                this.setModal1Visible(true)
            }
            if (this.state.bac > 0.10) {
                this.setModal2Visible(true)
            }
        }, 200);
    }

    async checkBac() {
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
                if (this.state.countdown === false) {
                    this.setState({ countdown: true }, () => this.countdownBac())
                }
            } else {
                this.setState({ testbuzzes: [], bac: 0.0, countdown: false }, () => this.countdownBac())
            }
        } else if (this.state.testbuzzes.length === 0) {
            this.setState({ bac: 0.0, countdown: false }, () => this.countdownBac())
        }
    }

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

    switchGender() {
        Vibration.vibrate();
        if (this.state.gender === "Male") {
            this.setState({ gender: "Female", weight: 165 })
        }
        if (this.state.gender === "Female") {
            this.setState({ gender: "Male", weight: 195 })
        }
    }

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
            <View style={{ backgroundColor: "#ff8a80" }}>
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
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        {addButtonSize === true ?
                            <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>DEMO        </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>        DEMO</Text></Text>
                            :
                            <Text style={{ fontWeight: "bold", textAlign: "center", }}><Text style={{ color: "#AE0000" }}>DEMO                </Text><Text style={{ color: "#00bfa5" }}>|                          |</Text><Text style={{ color: "#AE0000" }}>                DEMO</Text></Text>}
                        <View style={{ alignSelf: "center" }}>
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
                        </View>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😊" : "🙂"}</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "☺️" : "😊"}</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😀" : "☺️"}</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.03 && this.state.bac < 0.04 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😃</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.04 && this.state.bac < 0.05 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😄</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.05 && this.state.bac < 0.06 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>{this.state.bac}  😆</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.06 && this.state.bac < 0.07 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😝</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.07 && this.state.bac < 0.08 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  😜</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.08 && this.state.bac < 0.09 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😋" : "🤪"}</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😅" : "🥴"}</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                        {this.state.bac >= 0.10 && (<View style={{ flexDirection: "row", justifyContent: "space-around" }}><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}>{this.state.gender} </Text>
                            <TouchableOpacity style={[addButtonSize === true ? styles.smalloptimalbac : styles.optimalbac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😵" : "🤮"}</Text></TouchableOpacity><Text style={{ fontSize: 15, paddingTop: addButtonSize === true ? 15 : 30, fontWeight: "bold" }}> {this.state.weight} lbs</Text></View>)}
                    </View>
                    <View style={styles.cardView}>
                        <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                            {this.state.alctype === "Beer" &&
                                <MultiSwitch choiceSize={alcTypeSize}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                    onActivate={(number) => { this.handleDrinkType(data[number].value) }}
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
                                    containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                    onActivate={(number) => { this.handleDrinkType(data[number].value) }}
                                    active={2}>
                                    <Text style={{ fontSize: alcTypeText }}>🍺</Text>
                                    <Text style={{ fontSize: alcTypeText }}>🍷</Text>
                                    <Text style={{ fontSize: alcTypeText }}>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                                </MultiSwitch>}
                            {this.state.testbuzzes.length >= 1 && this.checkLastDrink() === true ?
                                <TouchableOpacity
                                    style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                    onPress={() => this.undoLastDrink()}>
                                    <View>
                                        <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                    </View>
                                </TouchableOpacity> :
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
                                                onActivate={(number) => { this.handleAbv(number) }}
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
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
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
                                        <MultiSwitch choiceSize={abvLiquorSize}
                                            activeItemStyle={activeStyle}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                            onActivate={(number) => { this.handleOz(number) }}
                                            active={0}>
                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                        </MultiSwitch>}
                                </View>
                                <View style={styles.multiSwitchViews}>
                                    {this.state.alctype === "Wine" &&
                                        <MultiSwitch choiceSize={abvLiquorSize}
                                            activeItemStyle={activeStyle}
                                            layout={{ vertical: 0, horizontal: -1 }}
                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
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
                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                            onActivate={(number) => { this.handleOz(number) }}
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
                    </View>
                    <View style={styles.cardView}>
                        <TouchableOpacity style={styles.button} onPress={() => this.switchGender()}><Text style={styles.buttonText}>Switch Gender ♂♀</Text></TouchableOpacity>
                        <View style={{ backgroundColor: "#fff", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 25, textAlign: "center", color: "teal" }}>{this.state.gender}</Text>
                        </View>
                    </View>
                    <View style={styles.cardView}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 20 }}>Enter Weight - lbs.</Text>
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
        marginBottom: 10,
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
