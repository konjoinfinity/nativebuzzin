import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Button,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import _ from 'lodash'
import { NavigationEvents } from "react-navigation";
import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import { Text as TextSVG } from "react-native-svg";
import * as scale from 'd3-scale'

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
            showHideOldBuzzes: false,
            reversebuzzes: null,
            reverseoldbuzzes: null
        }
        this.deleteBuzzes = this.deleteBuzzes.bind(this);
        this.deleteBuzz = this.deleteBuzz.bind(this);
        this.deleteOldBuzzes = this.deleteOldBuzzes.bind(this);
        this.deleteOldBuzz = this.deleteOldBuzz.bind(this);
        this.showHideBuzzes = this.showHideBuzzes.bind(this);
        this.showHideOldBuzzes = this.showHideOldBuzzes.bind(this);
    };

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
                    var dayHourMin = this.getDayHourMin(date1, date2);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    this.setState({ timesince: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds since your last drink.` })
                }, 200);
            } else {
                this.setState({ oldbuzzes: null })
            }
        })
        if (this.state.buzzes !== null && this.state.buzzes !== "[]") {
            this.setState({ reversebuzzes: this.reverseArray(this.state.buzzes) }, () => console.log(this.state.reversebuzzes))
        }
        if (this.state.oldbuzzes !== null && this.state.oldbuzzes !== "[]") {
            this.setState({ reverseoldbuzzes: this.reverseArray(this.state.oldbuzzes) }, () => console.log(this.state.reverseoldbuzzes))
        }
    }

    reverseArray(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newArray.push(arr[i]);
        }
        return newArray;
    }

    async deleteBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(key, () => {
            this.setState({ buzzes: null })
        })
    }

    async deleteBuzz(id) {
        Vibration.vibrate();
        var filtered = this.state.buzzes.filter(buzz => buzz !== this.state.buzzes[id]);
        await AsyncStorage.setItem(key, JSON.stringify(filtered), () => {
            if (filtered.length === 0) {
                this.setState({ buzzes: null })
            } else {
                this.setState({ buzzes: filtered })
            }
        })
    }

    async deleteOldBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(oldkey, () => {
            this.setState({ oldbuzzes: null })
        })
    }

    async deleteOldBuzz(id, obid) {
        var newArray = this.state.oldbuzzes;
        Vibration.vibrate();
        var filtered = this.state.oldbuzzes[obid].filter(buzz => buzz !== this.state.oldbuzzes[obid][id])
        newArray[obid] = filtered;
        await AsyncStorage.setItem(oldkey, JSON.stringify(newArray), () => {
            if (newArray.length === 0) {
                this.setState({ oldbuzzes: null })
            } else {
                this.setState({ oldbuzzes: newArray })
            }
        })
    }

    showHideBuzzes() {
        this.setState(prevState => ({
            showHideBuzzes: !prevState.showHideBuzzes
        }), () => setTimeout(() => {
            if (this.state.showHideBuzzes === true) {
                this.scrolltop.scrollToEnd({ animated: true });
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
                this.scrolltop.scrollToEnd({ animated: true });
            } else {
                this.scrolltop.scrollTo({ y: 0, animated: true });
            }
        }, 300));
        Vibration.vibrate();
    }

    render() {
        let buzzes;
        this.state.reversebuzzes !== null &&
            (buzzes = this.state.reversebuzzes.map((buzz, id) => {
                return (
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }} key={id}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 20, paddingBottom: 10 }}>{buzz.oz}oz  {buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 15, paddingBottom: 10 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View><TouchableOpacity style={styles.headerButton} onPress={() => this.deleteBuzz(id)}><Text style={styles.buttonText}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>
                    </View>
                )
            }))
        let oldbuzzes;
        this.state.reverseoldbuzzes !== null &&
            (oldbuzzes = this.state.reverseoldbuzzes.map((buzz, obid) => {
                return buzz.map((oldbuzz, id) => {
                    return (
                        <View key={id}>
                            {id === 0 && <Text style={{ fontSize: 20, padding: 10, textAlign: "center" }}>Session Date: {moment(oldbuzz.dateCreated).format('MMMM Do YYYY')}</Text>}
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={{ fontSize: 20, paddingBottom: 10 }}>{oldbuzz.oz}oz  {oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>{Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>}  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                                    <Text style={{ fontSize: 15, paddingBottom: 10 }}>{moment(oldbuzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View><TouchableOpacity style={styles.headerButton} onPress={() => this.deleteOldBuzz(id, obid)}><Text style={styles.buttonText}>{Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>
                            </View>
                        </View>
                    )
                })
            }))
        var sevenArray = []
        this.state.oldbuzzes !== null &&
            (this.state.oldbuzzes.map((buzz, obid) => {
                return buzz.map((oldbuzz, id) => {
                    var drinkTime = this.singleDuration(oldbuzz.dateCreated);
                    if (drinkTime < 168) {
                        sevenArray.push(oldbuzz)
                    }
                })
            }))
        var weekColor;
        var weekText;
        var textColor;
        if (sevenArray.length <= 5) {
            weekColor = "#96c060"
            weekText = "Zero to 5 - Minimum Recommended (Healthy)"
            textColor = "#ffffff"
        } else if (sevenArray.length > 5 && sevenArray.length <= 10) {
            weekColor = "#ffeb00"
            weekText = "6 to 10 - Median Recommended"
            textColor = "#000000"
        } else if (sevenArray.length > 10 && sevenArray.length <= 14) {
            weekColor = "#e98f00"
            weekText = "11 to 14 - Max Recommended (Potentially Unhealthy)"
            textColor = "#000000"
        } else if (sevenArray.length > 14) {
            weekColor = "#AE0000"
            weekText = "More than 14 - Not Recommended (Unhealthy)"
            textColor = "#ffffff"
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
        console.log(this.state.oldbuzzes)
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
                        >
                            <XAxis
                                style={{ marginTop: 10 }}
                                data={data}
                                scale={scale.scaleBand}
                                formatLabel={() => ""}
                            />
                            <Grid direction={Grid.Direction.HORIZONTAL} />
                            <Labels />
                        </BarChart>
                        <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>Total Drinks Last Week</Text>
                    </View>
                    {this.state.buzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz 🍺 🍷 {Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                            {this.state.showHideBuzzes === true && (
                                // Remove Delete All Buzzes
                                this.state.oldbuzzes !== null && (<TouchableOpacity style={styles.button} onPress={() => this.deleteBuzzes()}>
                                    <Text style={styles.buttonText}>Delete All Buzzes  {Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>))}
                            {this.state.showHideBuzzes === false && (
                                this.state.buzzes !== null && (
                                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                        <Button onPress={() => this.showHideBuzzes()}
                                            title="Show Buzzes" />
                                    </View>))}
                            {this.state.showHideBuzzes === true && (
                                this.state.buzzes !== null && (
                                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                        <Button onPress={() => this.showHideBuzzes()}
                                            title="Hide Buzzes" />
                                    </View>))}
                        </View>}
                    {this.state.buzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Congrats, keep up the good work!</Text>
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>It's been: </Text>}
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>{this.state.timesince}</Text>}
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>since your last drink.</Text>}
                            {this.state.timesince === null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>You haven't had any drinks.</Text>}
                        </View>}
                    {this.state.showHideBuzzes === true && (
                        this.state.buzzes !== null && (
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                {buzzes}</View>))}
                    {this.state.oldbuzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Old Buzzes 🍺 🍷 {Platform.OS === 'android' && Platform.Version < 24 ? "🍸" : "🥃"}</Text>
                            {this.state.showHideOldBuzzes === true && (
                                // Remove Delete All Buzzes
                                this.state.oldbuzzes !== null && (<TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzzes()}><Text style={styles.buttonText}>Delete All Old Buzzes  {Platform.OS === 'android' && Platform.Version < 24 ? "❌" : "🗑"}</Text></TouchableOpacity>))}
                            {this.state.showHideOldBuzzes === false && (
                                this.state.oldbuzzes !== null && (
                                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                        <Button onPress={() => this.showHideOldBuzzes()}
                                            title="Show Old Buzzes" />
                                    </View>))}
                            {this.state.showHideOldBuzzes === true && (
                                this.state.oldbuzzes !== null && (
                                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                        <Button onPress={() => this.showHideOldBuzzes()}
                                            title="Hide Old Buzzes" />
                                    </View>))}
                        </View>}
                    {this.state.oldbuzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                        </View>}
                    {this.state.showHideOldBuzzes === true && (
                        this.state.oldbuzzes !== null && (
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                {oldbuzzes}
                            </View>
                        ))}
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
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    },
    headerButton: {
        height: 35,
        width: 35,
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
    }
})
