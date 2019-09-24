import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Vibration, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import _ from 'lodash'
import { NavigationEvents } from "react-navigation";
import { BarChart, Grid, XAxis, LineChart } from 'react-native-svg-charts'
import { Text as TextSVG, G, Line } from "react-native-svg";
import * as scale from 'd3-scale'
import { Functions } from "./Functions";
import { key, oldkey, loginTitle, loginButtonText, abvText, genderkey, barChartWidth, scrollToAmt } from "./Variables";
import styles from "./Styles"

var values;
(async () => { values = await Functions.maxRecDrinks() })();

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null, oldbuzzes: null, timesince: null, showHideBuzzes: false, showHideOldBuzzes: false, sidescrollx: 0, gender: ""
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
                    var durations = Functions.timeSince(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes[this.state.oldbuzzes.length - 1].length - 1].dateCreated, "timesince")
                    this.setState({ timesince: `${durations[0]} ${durations[0] === 1 ? "day" : "days"}, ${durations[1]} ${durations[1] === 1 ? "hour" : "hours"}, ${durations[2]} ${durations[2] === 1 ? "minute" : "minutes"}, and ${durations[3]} ${durations[3] === 1 ? "second" : "seconds"}` })
                }, 200);
            } else { this.setState({ oldbuzzes: null }) }
        })
        await AsyncStorage.getItem(genderkey, (error, result) => { this.setState({ gender: JSON.parse(result) }) })
    }

    showHideBuzzes(statename) {
        this.setState(prevState => ({ [statename]: !prevState[statename] }), () => setTimeout(() => {
            this.state[statename] === true ?
                this.scrolltop.scrollTo({ y: 400, animated: true }) : this.scrolltop.scrollTo({ y: 0, animated: true })
        }, 500));
        Vibration.vibrate();
    }

    sideScroll() {
        setTimeout(() => {
            this.state.sidescrollx === scrollToAmt ? this.sidescroll.scrollTo({ x: 0 }) : this.sidescroll.scrollTo({ x: scrollToAmt })
        }, 3000);
    }

    render() {
        let buzzes, oldbuzzes;
        this.state.buzzes !== null && (buzzes = Functions.reverseArray(this.state.buzzes).map((buzz, id) => {
            return (
                <View style={styles.buzzMap} key={id}>
                    <TouchableOpacity style={styles.buzzheaderButton}><Text style={{ fontSize: loginTitle, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}</Text></TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: loginButtonText, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                        <Text style={{ fontSize: abvText, padding: 5 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                </View>
            )
        }))
        this.state.oldbuzzes !== null && (oldbuzzes = Functions.reverseArray(this.state.oldbuzzes).map((buzz, obid) => {
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
        const LabelWeek = ({ x, y, bandwidth, data }) => (data.map((value, index) => (
            <G key={index}><TextSVG x={x(index) + (bandwidth / 2)} y={y(value) - 10} fontSize={20} fill={'black'}
                alignmentBaseline={'middle'} textAnchor={'middle'}>{value}</TextSVG>
                {(this.state.gender === "Male" && value > 10 || this.state.gender === "Female") &&
                    <Line x1={x(index) + 3} y1={y(this.state.gender === "Male" ? 14 : 7)} x2={bandwidth + 13} y2={y(this.state.gender === "Male" ? 14 : 7)}
                        strokeWidth={3} strokeOpacity={0.3}
                        strokeDasharray={[8, 6]} strokeLinecap={"round"}
                        stroke={"#000000"} />}</G>)))
        const LabelMonth = ({ x, y, bandwidth, data }) => (data.map((value, index) => (
            <G key={index}><TextSVG x={x(index) + (bandwidth / 2)} y={y(value) - 10} fontSize={20} fill={'black'}
                alignmentBaseline={'middle'} textAnchor={'middle'}>{value}</TextSVG>
                {(this.state.gender === "Male" && value > 45 || this.state.gender === "Female" && value > 17) &&
                    <Line x1={x(index) + 3} y1={y(this.state.gender === "Male" ? 56 : 28)} x2={bandwidth + 13} y2={y(this.state.gender === "Male" ? 56 : 28)}
                        strokeWidth={3} strokeOpacity={0.3}
                        strokeDasharray={[8, 6]} strokeLinecap={"round"}
                        stroke={"#000000"} />}</G>)))
        const WeeksLabels = ({ x, y, data }) => (data.map((value, index) => (
            <TextSVG key={index} x={x(index)} y={y(value) - 20} fontSize={18} fill={'black'} alignmentBaseline={'middle'}
                textAnchor={'middle'}>{value}</TextSVG>)))
        return (
            <View>
                <NavigationEvents onWillFocus={() => { this.componentDidMount(), this.sideScroll() }} />
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={styles.scrollCard}>
                        <ScrollView horizontal={true} ref={(ref) => { this.sidescroll = ref }} onScroll={(event) => { if (event.nativeEvent.contentOffset.x === scrollToAmt || event.nativeEvent.contentOffset.x === 0) { this.setState({ sidescrollx: event.nativeEvent.contentOffset.x }) } }} scrollEventThrottle={16}>
                            <View>
                                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, flexDirection: 'row', justifyContent: "space-evenly" }}>
                                    <View style={{ flexDirection: 'column', padding: 10 }}>
                                        {this.state.oldbuzzes !== null &&
                                            <BarChart style={{ flex: 1, padding: 10, height: 200, width: barChartWidth }} data={values[5]}
                                                svg={{ fill: values[3], fillOpacity: values[3] === "#ffeb00" ? 0.5 : 0.8 }} contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                spacing={2} gridMin={0} gridMax={values[5][0] + 3} animate={true} animationDuration={1500}>
                                                <XAxis style={{ marginTop: 10 }} data={values[5]} scale={scale.scaleBand} formatLabel={() => ""} />
                                                <Grid direction={Grid.Direction.HORIZONTAL} />
                                                <LabelWeek />
                                            </BarChart>}
                                        <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Total Last Week</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', paddingLeft: 5, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
                                        {this.state.oldbuzzes !== null &&
                                            <BarChart style={{ flex: 1, padding: 10, height: 200, width: barChartWidth }} data={values[6]}
                                                svg={{ fill: values[4], fillOpacity: values[4] === "#ffeb00" ? 0.5 : 0.8 }} contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                spacing={2} gridMin={0} gridMax={values[6][0] + 10} animate={true} animationDuration={1800}>
                                                <XAxis style={{ marginTop: 10 }} data={values[6]} scale={scale.scaleBand} formatLabel={() => ""} />
                                                <Grid direction={Grid.Direction.HORIZONTAL} />
                                                <LabelMonth />
                                            </BarChart>}
                                        <Text style={{ fontSize: abvText, textAlign: "center", padding: 5 }}>Total Last Month</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                    <Text style={{ fontSize: abvText, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#96c060", fontWeight: "bold", fontSize: 30, opacity: 0.8 }}>■ </Text>{this.state.gender === "Male" ? "0-5" : "0-2"}  <Text style={{ color: "#ffeb00", fontWeight: "bold", fontSize: 30, opacity: 0.5 }}>■ </Text>{this.state.gender === "Male" ? "6-10" : "2-5"}  <Text style={{ color: "#e98f00", fontWeight: "bold", fontSize: 30, opacity: 0.8 }}>■ </Text>{this.state.gender === "Male" ? "11-14" : "6-7"}  <Text style={{ color: "#AE0000", fontWeight: "bold", fontSize: 30, opacity: 0.8 }}>■ </Text>{this.state.gender === "Male" ? "15+" : "7+"}</Text>
                                </View>
                            </View>
                            {this.state.oldbuzzes !== null && values[0].length > 1 && <View style={{ flexDirection: 'column', padding: 10 }}>
                                <LineChart style={{ height: 200, width: 1000 }} data={values[0]} gridMax={Math.max(...values[0]) + 6}
                                    svg={{ stroke: '#00897b', strokeWidth: 4, strokeOpacity: 0.8, strokeLinecap: "round" }}
                                    contentInset={{ top: 25, bottom: 10, left: 20, right: 20 }} numberOfTicks={8} gridMin={0} horizontal={true}>
                                    <XAxis style={{ height: 30, width: 1000 }} data={values[0]} contentInset={{ left: 30, right: 40 }}
                                        formatLabel={(index) => index === 0 ? "Last Week" : index === 1 ? "1 Week Ago" : (index) + " Weeks Ago"}
                                        svg={{ fontSize: 12 }} belowChart={true} ticks={4} />
                                    <Grid direction={Grid.Direction.HORIZONTAL} />
                                    <WeeksLabels />
                                </LineChart>
                                {this.state.oldbuzzes !== null &&
                                    <LineChart
                                        style={{ position: "absolute", height: 200, width: 1000, left: 10, top: 10 }} gridMin={0}
                                        data={values[1]} contentInset={{ top: 25, bottom: 10, left: 20, right: 20 }} numberOfTicks={8}
                                        svg={{ stroke: "#AE0000", strokeWidth: 3, strokeOpacity: 0.3, strokeDasharray: [8, 6], strokeLinecap: "round" }}
                                        gridMax={Math.max(...values[0]) + 6} horizontal={true}>
                                    </LineChart>}
                                <Text style={{ fontSize: abvText, textAlign: "left", paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}><Text style={{ color: "#00897b", fontWeight: "bold", fontSize: 30, opacity: 0.8 }}>- </Text>Historical Weekly Totals</Text>
                                <Text style={{ fontSize: abvText, textAlign: "left", paddingLeft: 10, paddingRight: 10 }}><Text style={{ color: "#AE0000", fontWeight: "bold", fontSize: 30, opacity: 0.3 }}>- </Text>Max Recommended - {this.state.oldbuzzes !== null && values[2]} ({this.state.gender})</Text>
                            </View>}
                        </ScrollView>
                    </View>
                    {this.state.buzzes !== null && <View style={styles.buzzCard}>
                        <View style={styles.buzzView}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>Current Buzz</Text>
                            <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes("showHideBuzzes")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showHideBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideBuzzes === true && <View>{buzzes}</View>}
                    </View>}
                    {this.state.buzzes === null && <View style={styles.buzzInfo}>
                        <Text style={{ fontSize: loginTitle, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                        {this.state.timesince !== null && <View>
                            <Text style={{ fontSize: loginButtonText, textAlign: "center", paddingBottom: 10 }}>It's been: <Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink.</Text>
                            <Text style={{ fontSize: loginButtonText, textAlign: "center", paddingBottom: 10 }}>You haven't had any drinks.</Text></View>}
                    </View>}
                    {this.state.oldbuzzes !== null && <View style={styles.buzzCard}>
                        <View style={styles.buzzView}>
                            <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>Old Buzzes</Text>
                            <TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideBuzzes("showHideOldBuzzes")}>
                                <Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showHideOldBuzzes === false ? "Show" : "Hide"}</Text></TouchableOpacity>
                        </View>
                        {this.state.showHideOldBuzzes === true && <View>{oldbuzzes}</View>}
                    </View>}
                    {this.state.oldbuzzes === null && <View style={styles.buzzInfo}>
                        <Text style={{ fontSize: loginTitle, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                    </View>}
                </ScrollView>
            </View>
        );
    }
}

export default BuzzScreen;