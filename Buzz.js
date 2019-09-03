import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import _ from 'lodash'
import { NavigationEvents } from "react-navigation";
import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import { Text as TextSVG } from "react-native-svg";
import * as scale from 'd3-scale'
import { Functions } from "./Functions";
import { key, oldkey, loginTitle, loginButtonText, abvText } from "./Variables";
import styles from "./Styles"

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null,
            oldbuzzes: null,
            timesince: null,
            showHideBuzzes: false,
            showHideOldBuzzes: false
        }
    };

    async componentDidMount() {
        await AsyncStorage.getItem(key, (error, result) => {
            result !== null && result !== "[]" ? this.setState({ buzzes: JSON.parse(result) }) : this.setState({ buzzes: null })
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) })
                setTimeout(() => {
                    var date1 = Date.parse(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes[this.state.oldbuzzes.length - 1].length - 1].dateCreated)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = Functions.getDayHourMin(date1, date2);
                    var days = dayHourMin[0], hours = dayHourMin[1], minutes = dayHourMin[2], seconds = dayHourMin[3];
                    this.setState({ timesince: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds` })
                }, 200);
            } else { this.setState({ oldbuzzes: null }) }
        })
    }

    showHideBuzzes() {
        this.setState(prevState => ({ showHideBuzzes: !prevState.showHideBuzzes }), () => setTimeout(() => {
            this.state.showHideBuzzes === true ?
                this.scrolltop.scrollTo({ y: 200, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true })
        }, 300));
        Vibration.vibrate();
    }

    showHideOldBuzzes() {
        this.setState(prevState => ({ showHideOldBuzzes: !prevState.showHideOldBuzzes }), () => setTimeout(() => {
            this.state.showHideOldBuzzes === true ?
                this.scrolltop.scrollTo({ y: 400, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true })
        }, 300));
        Vibration.vibrate();
    }

    render() {
        let buzzes, oldbuzzes;
        this.state.buzzes !== null &&
            (buzzes = Functions.reverseArray(this.state.buzzes).map((buzz, id) => {
                return (
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }} key={id}>
                        <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}</Text></TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: loginButtonText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: abvText, padding: 5 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                    </View>
                )
            }))
        this.state.oldbuzzes !== null &&
            (oldbuzzes = Functions.reverseArray(this.state.oldbuzzes).map((buzz, obid) => {
                return Functions.reverseArray(buzz).map((oldbuzz, id) => {
                    return (
                        <View key={id}>
                            {id === 0 && <Text style={{ fontSize: abvText, padding: 10, textAlign: "center" }}>Session Date: {moment(oldbuzz.dateCreated).format('MMMM Do YYYY')}</Text>}
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                                <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}</Text></TouchableOpacity>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={{ fontSize: loginButtonText, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                                    <Text style={{ fontSize: abvText, padding: 5 }}>{moment(oldbuzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                            </View>
                        </View>
                    )
                })
            }))
        var sevenArray = [], thirtyArray = []
        this.state.oldbuzzes !== null &&
            (this.state.oldbuzzes.map((buzz) => {
                return buzz.map((oldbuzz) => {
                    var drinkTime = Functions.singleDuration(oldbuzz.dateCreated);
                    if (drinkTime < 168) { sevenArray.push(oldbuzz) }
                })
            }))
        this.state.oldbuzzes !== null &&
            (this.state.oldbuzzes.map((buzz) => {
                return buzz.map((oldbuzz) => {
                    var drinkTime = Functions.singleDuration(oldbuzz.dateCreated);
                    if (drinkTime < 720) { thirtyArray.push(oldbuzz) }
                })
            }))
        var weekColor = Functions.sevenColor(sevenArray.length), monthColor = Functions.thirtyColor(thirtyArray.length)
        var sevenData = [sevenArray.length], thirtyData = [thirtyArray.length]
        const SevenLabels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <TextSVG
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={y(value) - 10}
                    fontSize={20}
                    fill={'black'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}>
                    {value}
                </TextSVG>
            ))
        )
        const ThirtyLabels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <TextSVG
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={y(value) - 10}
                    fontSize={20}
                    fill={'black'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}>
                    {value}
                </TextSVG>
            ))
        )
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", height: 250, paddingVertical: 16, backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, paddingTop: 10, paddingBottom: 10, paddingLeft: 25, paddingRight: 25 }}>
                        <View style={{ flexDirection: 'column', paddingRight: 10 }}>
                            <BarChart
                                style={{ flex: 1, padding: 10 }}
                                data={sevenData}
                                svg={{ fill: weekColor, fillOpacity: 0.8 }}
                                contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                spacing={2}
                                gridMin={0}
                                gridMax={sevenData[0] + 3}
                                animate={true}
                                animationDuration={1500}>
                                <XAxis
                                    style={{ marginTop: 10 }}
                                    data={sevenData}
                                    scale={scale.scaleBand}
                                    formatLabel={() => ""} />
                                <Grid direction={Grid.Direction.HORIZONTAL} />
                                <SevenLabels />
                            </BarChart>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Total Last Week</Text>
                        </View>
                        <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                            <BarChart
                                style={{ flex: 1, padding: 10 }}
                                data={thirtyData}
                                svg={{ fill: monthColor, fillOpacity: 0.8 }}
                                contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                spacing={2}
                                gridMin={0}
                                gridMax={thirtyData[0] + 10}
                                animate={true}
                                animationDuration={1800}>
                                <XAxis
                                    style={{ marginTop: 10 }}
                                    data={thirtyData}
                                    scale={scale.scaleBand}
                                    formatLabel={() => ""} />
                                <Grid direction={Grid.Direction.HORIZONTAL} />
                                <ThirtyLabels />
                            </BarChart>
                            <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Total Last Month</Text>
                        </View>
                    </View>
                    {this.state.buzzes !== null &&
                        <View style={{ flexDirection: "column", backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10 }}>
                                <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>Current Buzz</Text>
                                {this.state.showHideBuzzes === false && (
                                    this.state.buzzes !== null && (
                                        <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes()}>
                                            <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Show</Text></TouchableOpacity>))}
                                {this.state.showHideBuzzes === true && (
                                    this.state.buzzes !== null && (
                                        <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes()}>
                                            <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Hide</Text></TouchableOpacity>))}
                            </View>
                            {this.state.showHideBuzzes === true && <View>{buzzes}</View>}
                        </View>}
                    {this.state.buzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", paddingBottom: 10 }}>It's been: <Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink.</Text>}
                            {this.state.timesince === null &&
                                <Text style={{ fontSize: loginButtonText, textAlign: "center", paddingBottom: 10 }}>You haven't had any drinks.</Text>}
                        </View>}
                    {this.state.oldbuzzes !== null &&
                        <View style={{ flexDirection: "column", backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10 }}>
                                <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>Old Buzzes</Text>
                                {this.state.showHideOldBuzzes === false && (
                                    this.state.oldbuzzes !== null && (
                                        <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideOldBuzzes()}>
                                            <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Show</Text></TouchableOpacity>))}
                                {this.state.showHideOldBuzzes === true && (
                                    this.state.oldbuzzes !== null && (
                                        <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideOldBuzzes()}>
                                            <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>Hide</Text></TouchableOpacity>))}
                            </View>
                            {this.state.showHideOldBuzzes === true && <View>{oldbuzzes}</View>}
                        </View>}
                    {this.state.oldbuzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                        </View>}
                </ScrollView>
            </View>
        );
    }
}

export default BuzzScreen;