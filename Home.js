import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Alert,
    Modal,
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
import {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText,
    abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, namekey,
    genderkey, weightkey, key, oldkey, breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakminkey,
    gaugeLabels, warnText, dangerText, autobreakthresholdkey, cutoffbackey, cutoffkey, drinkskey, cancelbreakskey,
    showcutoffkey, abovePoint10
} from "./Variables";
import { Functions } from "./Functions";
import styles from "./Styles"

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
            autobreak: "",
            focus: false,
            modal1Visible: false,
            modal2Visible: false,
            flashwarning: "#AE0000",
            flashtext: "",
            flashtimer: "",
            happyhour: "",
            happyhourtime: "",
            threshold: "",
            cutoff: "",
            cutoffbac: "",
            drinks: "",
            showcutoff: false
        }
    };

    async componentDidMount() {
        var values = await AsyncStorage.multiGet([autobreakkey, cancelbreakskey, cutoffbackey, cutoffkey, drinkskey, happyhourkey,
            autobreakthresholdkey, namekey, genderkey, weightkey])
        this.setState({
            autobreak: JSON.parse(values[0][1]), cancelbreaks: JSON.parse(values[1][1]), cutoffbac: JSON.parse(values[2][1]),
            cutoff: JSON.parse(values[3][1]), drinks: JSON.parse(values[4][1]), happyhour: JSON.parse(values[5][1]),
            threshold: JSON.parse(values[6][1]), name: JSON.parse(values[7][1]), gender: JSON.parse(values[8][1]),
            weight: JSON.parse(values[9][1])
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
                    var dayHourMin = Functions.getDayHourMin(date2, date1);
                    var days = dayHourMin[0], hours = dayHourMin[1], minutes = dayHourMin[2], seconds = dayHourMin[3];
                    if (days + hours + minutes + seconds < 0) {
                        if (this.state.autobreak === true) {
                            var stopBreak5pm = new Date()
                            stopBreak5pm = moment(stopBreak5pm).local();
                            stopBreak5pm = stopBreak5pm.hours();
                            if (stopBreak5pm >= 17) {
                                this.stopBreak()
                            }
                        } else if (this.state.autobreak === false) {
                            this.stopBreak()
                        }
                    }
                }, 100);
            }
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
        if (this.state.happyhour === true) {
            var happyHour = new Date()
            happyHour = moment(happyHour).local();
            happyHour = happyHour.hours();
            if (happyHour < 17) {
                this.setState({ happyhourtime: happyHour })
            } else {
                this.setState({ happyhourtime: "" })
            }
        } else if (this.state.happyhour === false) {
            this.setState({ happyhourtime: "" })
        }
    }

    componentWillUnmount() {
        this.props.copilotEvents.off('stop');
        clearInterval(this.state.timer)
        clearInterval(this.state.flashtimer)
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
                this.setState({ abv: 0.08 })
            }, 1000);
            setTimeout(() => {
                this.setState({ abv: 0.04 })
            }, 2000);
            setTimeout(() => {
                this.setState({ abv: 0.05 })
            }, 3000);
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

    async addDrink() {
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
        if (this.state.bac > this.state.threshold) {
            await AsyncStorage.setItem(autobreakminkey, JSON.stringify(true))
        }
        if (this.state.cutoff === true) {
            if (this.state.bac > this.state.cutoffbac || this.state.buzzes.length >= this.state.drinks) {
                this.setState({ showcutoff: true })
                await AsyncStorage.setItem(showcutoffkey, JSON.stringify(true))
            }
        }
    }

    async checkBac() {
        if (this.state.buzzes.length >= 1) {
            var duration = Functions.singleDuration(this.state.buzzes[0].dateCreated);
            var totalBac = Functions.varGetBAC(
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
                if (this.state.flashtimer === "") {
                    flashTimer = setInterval(() => {
                        if (this.state.flashwarning === "#00bfa5") {
                            this.setState({ flashwarning: "#AE0000" })
                        } else if (this.state.flashwarning === "#AE0000") {
                            this.setState({ flashwarning: "#00bfa5" })
                        }
                    }, 800);
                    this.setState({ flashtimer: flashTimer })
                }
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
        var autobreakcheck, oldbuzzarray = this.state.oldbuzzes, newbuzzarray = this.state.buzzes;
        await AsyncStorage.getItem(autobreakminkey, (error, result) => { autobreakcheck = JSON.parse(result) })
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
        if (this.state.autobreak === true && autobreakcheck === true) {
            var autoBreakDate = new Date();
            autoBreakDate.setDate(autoBreakDate.getDate() + 1);
            this.setState({ break: true, breakdate: autoBreakDate })
            await AsyncStorage.multiSet([[breakkey, JSON.stringify(true)], [breakdatekey, JSON.stringify(autoBreakDate)],
            [autobreakminkey, JSON.stringify(false)]], () => this.componentDidMount())
        }
        if (this.state.showcutoff === true) {
            this.setState({ showcutoff: false, cutoff: false, cutoffbac: "", drinks: "" })
            await AsyncStorage.multiSet([[cutoffkey, JSON.stringify(false)], [showcutoffkey, JSON.stringify(false)]])
        }
    }

    async clearDrinks() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(key, () => {
            this.setState({ buzzes: [], bac: 0.0 })
        })
    }

    async undoLastDrink() {
        var lastDrinkTime = Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated);
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
        var lastDrinkTime = Functions.singleDuration(this.state.buzzes[this.state.buzzes.length - 1].dateCreated);
        if (lastDrinkTime < 0.0333333) {
            return true
        } else {
            return false
        }
    }

    cancelAlert(typealert) {
        Vibration.vibrate();
        Alert.alert('Are you sure?', typealert === "hh" ? 'Click Yes to cancel Happy Hour, No to continue Happy Hour' :
            typealert === "co" ? 'Click Yes to cancel Cut Off, No to continue Cut Off' : 'Click Yes to cancel break, No to continue break',
            [
                { text: 'Yes', onPress: () => typealert === "hh" ? this.stopHh() : typealert === "co" ? this.stopCutOff() : this.stopBreak() },
                { text: 'No' },
            ],
            { cancelable: false },
        );
    }

    async stopBreak() {
        Vibration.vibrate();
        this.setState({ break: false })
        await AsyncStorage.removeItem(breakdatekey)
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet([[breakkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    async stopHh() {
        Vibration.vibrate();
        this.setState({ happyhour: false, happyhourtime: "" })
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet([[happyhourkey, JSON.stringify(false)], [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    async stopCutOff() {
        Vibration.vibrate();
        this.setState({ showcutoff: false, cutoff: false, cutoffbac: "", drinks: "" })
        var cancelbreaks = JSON.parse(await AsyncStorage.getItem(cancelbreakskey))
        await AsyncStorage.multiSet([[cutoffkey, JSON.stringify(false)], [showcutoffkey, JSON.stringify(false)],
        [cancelbreakskey, JSON.stringify(cancelbreaks + 1)]])
    }

    render() {
        var returnValues = Functions.setColorPercent(this.state.bac)
        var gaugeColor = returnValues[0], bacPercentage = returnValues[1]
        return (
            <View>
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.modal1Visible}>
                    <ScrollView style={{ backgroundColor: "#ffff8d", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, padding: 8 }}>
                        {warnText}
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
                        {dangerText}
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
                                    <Text style={{ fontWeight: "bold", textAlign: "center", color: this.state.flashwarning }}>WARNING              STOP              DRINKING</Text>
                                    :
                                    <Text style={{ fontWeight: "bold", textAlign: "center", color: "#00bfa5" }}>|                          |</Text>}
                            </CopilotView>
                        </CopilotStep>
                        <CopilotStep text="This gauge displays your BAC." order={1} name="gauge">
                            <CopilotView style={{ alignSelf: "center" }}>
                                <RNSpeedometer value={bacPercentage} size={gaugeSize} maxValue={100} defaultValue={0} innerCircleStyle={{ backgroundColor: "#e0f2f1" }} labels={gaugeLabels} />
                                {/* halfCircleStyle={{ opacity: 0.85 }} consider adding opacity to gauge to appear softer on the eyes*/}
                            </CopilotView>
                        </CopilotStep>
                        {(this.state.bac === 0 || this.state.bac === undefined) && (
                            <CopilotStep text="This readout automatically calculates your current BAC." order={2} name="bac">
                                <CopilotView>
                                    <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                        <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "teal" }}>0.0</Text></TouchableOpacity>
                                </CopilotView>
                            </CopilotStep>)}
                        {this.state.bac > 0.00 && this.state.bac < 0.01 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😊" : "🙂"}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.01 && this.state.bac < 0.02 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "☺️" : "😊"}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.02 && this.state.bac < 0.03 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😀" : "☺️"}</Text></TouchableOpacity>)}
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
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😋" : "🤪"}</Text></TouchableOpacity>)}
                        {this.state.bac > 0.09 && this.state.bac < 0.10 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😅" : "🥴"}</Text></TouchableOpacity>)}
                        {this.state.bac >= 0.10 && (
                            <TouchableOpacity style={[addButtonSize === true ? styles.smallbac : styles.bac, { backgroundColor: gaugeColor }]}>
                                <Text style={{ fontSize: bacTextSize, textAlign: "center", color: "white" }}>{this.state.bac}  {Platform.OS === 'android' && Platform.Version < 24 ? "😵" : "🤮"}</Text></TouchableOpacity>)}
                    </View>
                    {(this.state.break === "" || this.state.break === false) && this.state.happyhourtime === "" && this.state.bac < 0.10 && this.state.showcutoff === false &&
                        <View style={styles.cardView}>
                            <View style={[styles.multiSwitchViews, { paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }]}>
                                {this.state.alctype === "Beer" &&
                                    <CopilotStep text="Press each icon to change drink type." order={4} name="drink">
                                        <CopilotView>
                                            <MultiSwitch choiceSize={alcTypeSize}
                                                activeItemStyle={activeStyle}
                                                layout={{ vertical: 0, horizontal: -1 }}
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ alctype: alcValues[number].value, abv: Functions.setAlcType(alcValues[number].value)[0], oz: Functions.setAlcType(alcValues[number].value)[1] }) }}
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
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
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
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
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
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
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
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
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
                                                                containerStyles={_.times(5, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                                onActivate={(number) => { this.setState({ abv: Functions.setAbv(number, this.state.alctype) }) }}
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
                                        {this.state.alctype === "Beer" &&
                                            <CopilotStep text="Press each number to change drink size." order={6} name="oz">
                                                <CopilotView>
                                                    {this.state.oz === 12 &&
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
                                                    {this.state.oz === 16 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
                                                            active={1}>
                                                            <Text style={{ fontSize: abvLiquorText }}>12oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>16oz</Text>
                                                            <Text style={{ fontSize: abvLiquorText }}>20oz</Text>
                                                        </MultiSwitch>}
                                                    {this.state.oz === 20 &&
                                                        <MultiSwitch choiceSize={abvLiquorSize}
                                                            activeItemStyle={activeStyle}
                                                            layout={{ vertical: 0, horizontal: -1 }}
                                                            containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                            onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
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
                                                containerStyles={_.times(3, () => ([styles.multiSwitch, { marginTop: multiSwitchMargin, marginBottom: multiSwitchMargin }]))}
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
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
                                                onActivate={(number) => { this.setState({ oz: Functions.setOz(number, this.state.alctype) }) }}
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
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                            {this.state.autobreak === true ?
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY')}, 5:00 pm</Text> :
                                <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>{moment(this.state.breakdate).format('ddd MMM Do YYYY, h:mm a')}</Text>}
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}> Keep up the good work!</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("br")}>
                                <Text style={styles.buttonText}>Cancel Break</Text>
                            </TouchableOpacity>
                        </View>}
                    {(this.state.break === "" || this.state.break === false) && this.state.happyhour === true && this.state.happyhourtime !== "" &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>Happy Hour at 5pm</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("hh")}>
                                <Text style={styles.buttonText}>Cancel Happy Hour</Text>
                            </TouchableOpacity>
                        </View>}
                    {this.state.bac > 0.10 &&
                        <View style={styles.cardView}>
                            {abovePoint10}
                            {this.state.buzzes.length >= 1 && this.checkLastDrink() === true &&
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
                    {this.state.showcutoff === true &&
                        <View style={styles.cardView}>
                            <Text style={{ fontSize: 22, textAlign: "center", padding: 10 }}>You have been cut off. You have had too many drinks or your BAC is too high. Until then, stop drinking and have some water.</Text>
                            {this.state.buzzes.length >= 1 && this.checkLastDrink() === true ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity
                                        style={addButtonSize === true ? styles.smallUndoButton : styles.undoButton}
                                        onPress={() => { this.undoLastDrink(), this.setState({ showcutoff: false }) }}>
                                        <View>
                                            <Text style={{ fontSize: alcTypeText }}>↩️</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> : <TouchableOpacity style={styles.button} onPress={() => this.cancelAlert("co")}>
                                    <Text style={styles.buttonText}>Cancel Cut Off</Text>
                                </TouchableOpacity>}
                        </View>}
                </ScrollView>
            </View>
        );
    }
}

export default copilot((Platform.OS === 'ios') ? { androidStatusBarVisible: false } : { androidStatusBarVisible: true })(HomeScreen);