import React, { Component } from 'react';
import {
    StyleSheet,
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

const key = "buzzes"
const oldkey = "oldbuzzes"

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
        // this.deleteBuzzes = this.deleteBuzzes.bind(this);
        // this.deleteOldBuzzes = this.deleteOldBuzzes.bind(this);
        this.showHideBuzzes = this.showHideBuzzes.bind(this);
        this.showHideOldBuzzes = this.showHideOldBuzzes.bind(this);
    };

    async componentDidMount() {
        await AsyncStorage.getItem(key, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ buzzes: JSON.parse(result) })
            } else {
                this.setState({ buzzes: null })
            }
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null && result !== "[]") {
                this.setState({ oldbuzzes: JSON.parse(result) })
                setTimeout(() => {
                    var date1 = Date.parse(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes[this.state.oldbuzzes.length - 1].length - 1].dateCreated)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = Functions.getDayHourMin(date1, date2);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    this.setState({ timesince: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds` })
                }, 200);
            } else {
                this.setState({ oldbuzzes: null })
            }
        })
    }

    reverseArray(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newArray.push(arr[i]);
        }
        return newArray;
    }

    // async deleteBuzzes() {
    //     Vibration.vibrate();
    //     await AsyncStorage.removeItem(key, () => {
    //         this.setState({ buzzes: null })
    //     })
    // }

    // async deleteOldBuzzes() {
    //     Vibration.vibrate();
    //     await AsyncStorage.removeItem(oldkey, () => {
    //         this.setState({ oldbuzzes: null })
    //     })
    // }

    showHideBuzzes() {
        this.setState(prevState => ({
            showHideBuzzes: !prevState.showHideBuzzes
        }), () => setTimeout(() => {
            if (this.state.showHideBuzzes === true) {
                this.scrolltop.scrollTo({ y: 200, animated: true })
            } else {
                this.scrolltop.scrollTo({ y: 0, animated: true });
            }
        }, 300));
        Vibration.vibrate();
    }

    showHideOldBuzzes() {
        this.setState(prevState => ({
            showHideOldBuzzes: !prevState.showHideOldBuzzes
        }), () => setTimeout(() => {
            if (this.state.showHideOldBuzzes === true) {
                this.scrolltop.scrollTo({ y: 400, animated: true })
            } else {
                this.scrolltop.scrollTo({ y: 0, animated: true });
            }
        }, 300));
        Vibration.vibrate();
    }

    render() {
        let buzzes;
        this.state.buzzes !== null &&
            (buzzes = this.reverseArray(this.state.buzzes).map((buzz, id) => {
                return (
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }} key={id}>
                        <TouchableOpacity style={styles.headerButton}><Text style={{ fontSize: 30, textAlign: "center", padding: 5 }}>{buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}</Text></TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 20, padding: 5 }}>{buzz.oz}oz  -  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 15, padding: 5 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                    </View>
                )
            }))
        let oldbuzzes;
        this.state.oldbuzzes !== null &&
            (oldbuzzes = this.reverseArray(this.state.oldbuzzes).map((buzz, obid) => {
                return this.reverseArray(buzz).map((oldbuzz, id) => {
                    return (
                        <View key={id}>
                            {id === 0 && <Text style={{ fontSize: 20, padding: 10, textAlign: "center" }}>Session Date: {moment(oldbuzz.dateCreated).format('MMMM Do YYYY')}</Text>}
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                                <TouchableOpacity style={styles.headerButton}><Text style={{ fontSize: 30, textAlign: "center", padding: 5 }}>{oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}</Text></TouchableOpacity>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={{ fontSize: 20, padding: 5 }}>{oldbuzz.oz}oz  -  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                                    <Text style={{ fontSize: 15, padding: 5 }}>{moment(oldbuzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                            </View>
                        </View>
                    )
                })
            }))
        var sevenArray = []
        this.state.oldbuzzes !== null &&
            (this.state.oldbuzzes.map((buzz) => {
                return buzz.map((oldbuzz) => {
                    var drinkTime = Functions.singleDuration(oldbuzz.dateCreated);
                    if (drinkTime < 168) {
                        sevenArray.push(oldbuzz)
                    }
                })
            }))
        var weekColor;
        if (sevenArray.length <= 5) {
            weekColor = "#96c060"
        } else if (sevenArray.length > 5 && sevenArray.length <= 10) {
            weekColor = "#ffeb00"
        } else if (sevenArray.length > 10 && sevenArray.length <= 14) {
            weekColor = "#e98f00"
        } else if (sevenArray.length > 14) {
            weekColor = "#AE0000"
        }
        const data = [sevenArray.length]
        const Labels = ({ x, y, bandwidth, data }) => (
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
                    <View style={{ flexDirection: 'column', height: 250, paddingVertical: 16, backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, paddingTop: 10, paddingBottom: 10, paddingLeft: 35, paddingRight: 35 }}>
                        <BarChart
                            style={{ flex: 1, padding: 10 }}
                            data={data}
                            svg={{ fill: weekColor }}
                            contentInset={{ top: 10, bottom: 10, left: 25, right: 25 }}
                            spacing={2}
                            gridMin={0}
                            gridMax={data[0] + 3}
                            animate={true}
                            animationDuration={1500}>
                            <XAxis
                                style={{ marginTop: 10 }}
                                data={data}
                                scale={scale.scaleBand}
                                formatLabel={() => ""} />
                            <Grid direction={Grid.Direction.HORIZONTAL} />
                            <Labels />
                        </BarChart>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>Total Drinks Last Week</Text>
                    </View>
                    {this.state.buzzes !== null &&
                        <View style={{ flexDirection: "column", backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>Current Buzz</Text>
                                {/* {this.state.showHideBuzzes === true && (
                                // Remove Delete All Buzzes
                                this.state.oldbuzzes !== null && (<TouchableOpacity style={styles.button} onPress={() => this.deleteBuzzes()}>
                                    <Text style={styles.buttonText}>Delete All Buzzes  {Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>))} */}
                                {this.state.showHideBuzzes === false && (
                                    this.state.buzzes !== null && (
                                        <TouchableOpacity style={styles.button} onPress={() => this.showHideBuzzes()}>
                                            <Text style={styles.buttonText}>Show</Text></TouchableOpacity>
                                    ))}
                                {this.state.showHideBuzzes === true && (
                                    this.state.buzzes !== null && (
                                        <TouchableOpacity style={styles.button} onPress={() => this.showHideBuzzes()}>
                                            <Text style={styles.buttonText}>Hide</Text></TouchableOpacity>))}
                            </View>
                            {this.state.showHideBuzzes === true && <View>{buzzes}</View>}
                        </View>}
                    {this.state.buzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>It's been: <Text style={{ fontWeight: "bold" }}>{this.state.timesince}</Text> since your last drink.</Text>}
                            {this.state.timesince === null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>You haven't had any drinks.</Text>}
                        </View>}
                    {this.state.oldbuzzes !== null &&
                        <View style={{ flexDirection: "column", backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 10 }}>
                                <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>Old Buzzes   </Text>
                                {/* {this.state.showHideOldBuzzes === true && (
                                // Remove Delete All Buzzes
                                this.state.oldbuzzes !== null && (<TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzzes()}><Text style={styles.buttonText}>Delete All Old Buzzes  {Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>))} */}
                                {this.state.showHideOldBuzzes === false && (
                                    this.state.oldbuzzes !== null && (
                                        <TouchableOpacity style={styles.button} onPress={() => this.showHideOldBuzzes()}>
                                            <Text style={styles.buttonText}>Show</Text></TouchableOpacity>))}
                                {this.state.showHideOldBuzzes === true && (
                                    this.state.oldbuzzes !== null && (
                                        <TouchableOpacity style={styles.button} onPress={() => this.showHideOldBuzzes()}>
                                            <Text style={styles.buttonText}>Hide</Text></TouchableOpacity>))}
                            </View>
                            {this.state.showHideOldBuzzes === true && <View>{oldbuzzes}</View>}
                        </View>}
                    {this.state.oldbuzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                        </View>}
                </ScrollView>
            </View>
        );
    }
}

export default BuzzScreen;

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    },
    headerButton: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 5,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    }
})
