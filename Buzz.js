import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    RefreshControl,
    Button
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import _ from 'lodash'
import { NavigationEvents } from "react-navigation";

const key = "buzzes"
const oldkey = "oldbuzzes"

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null,
            refreshing: false,
            oldbuzzes: null,
            timesince: null,
            showHideBuzzes: false
        }
        this.deleteBuzzes = this.deleteBuzzes.bind(this);
        this.deleteBuzz = this.deleteBuzz.bind(this);
        this.getBuzzes = this.getBuzzes.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.deleteOldBuzzes = this.deleteOldBuzzes.bind(this);
        this.deleteOldBuzz = this.deleteOldBuzz.bind(this);
        this.getOldBuzzes = this.getOldBuzzes.bind(this);
        this.showHideBuzzes = this.showHideBuzzes.bind(this);
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

    async componentDidMount() {
        await AsyncStorage.getItem(key, (error, result) => {
            if (result !== null) {
                if (result !== "[]") {
                    this.setState({ buzzes: JSON.parse(result) })
                } else {
                    this.setState({ buzzes: null })
                }
            } else {
                this.setState({ buzzes: null })
            }
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null) {
                if (result !== "[]") {
                    this.setState({ oldbuzzes: JSON.parse(result) })
                    setTimeout(() => {
                        var date1 = Date.parse(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes.length - 1].dateCreated)
                        var currentDate = new Date();
                        var date2 = currentDate.getTime();
                        var dayHourMin = this.getDayHourMin(date1, date2);
                        var days = dayHourMin[0];
                        var hours = dayHourMin[1];
                        var minutes = dayHourMin[2];
                        var seconds = dayHourMin[3];
                        this.setState({ timesince: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds since your last drink.` })
                    }, 100);
                } else {
                    this.setState({ oldbuzzes: null })
                }
            } else {
                this.setState({ oldbuzzes: null })
            }
        })
    }

    async getBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.getItem(key, (error, result) => {
            if (result !== null) {
                if (result !== "[]") {
                    this.setState({ buzzes: JSON.parse(result) })
                } else {
                    this.setState({ buzzes: null })
                }
            } else {
                this.setState({ buzzes: null })
            }
        })
    }

    async getOldBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (result !== null) {
                if (result !== "[]") {
                    this.setState({ oldbuzzes: JSON.parse(result) })
                    setTimeout(() => {
                        var date1 = Date.parse(this.state.oldbuzzes[this.state.oldbuzzes.length - 1][this.state.oldbuzzes.length - 1].dateCreated)
                        var currentDate = new Date();
                        var date2 = currentDate.getTime();
                        var dayHourMin = this.getDayHourMin(date1, date2);
                        var days = dayHourMin[0];
                        var hours = dayHourMin[1];
                        var minutes = dayHourMin[2];
                        var seconds = dayHourMin[3];
                        this.setState({ timesince: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds since your last drink.` })
                    }, 100);
                } else {
                    this.setState({ oldbuzzes: null })
                }
            } else {
                this.setState({ oldbuzzes: null })
            }
        })
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.getBuzzes();
        this.getOldBuzzes();
        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 200);
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
        }));
        Vibration.vibrate();
        setTimeout(() => {
            if (this.state.showHideBuzzes === true) {
                this.scrolltop.scrollToEnd({ animated: true });
            }
        }, 300)
    }

    render() {
        let buzzes;
        this.state.buzzes &&
            (buzzes = this.state.buzzes.map((buzz, id) => {
                return (
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }} key={id}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 20, paddingBottom: 10 }}>{buzz.oz}oz  {buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>🥃</Text>}  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 15, paddingBottom: 10 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View><TouchableOpacity style={styles.headerButton} onPress={() => this.deleteBuzz(id)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>
                    </View>
                )
            }
            )
            )
        let oldbuzzes;
        this.state.oldbuzzes !== null &&
            (oldbuzzes = this.state.oldbuzzes.map((buzz, obid) => {
                return buzz.map((oldbuzz, id) => {
                    return (
                        <View key={id}>
                            {id === 0 && <Text style={{ fontSize: 20, padding: 10, textAlign: "center" }}>Session Date: {moment(oldbuzz.dateCreated).format('MMMM Do YYYY')}</Text>}
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={{ fontSize: 20, paddingBottom: 10 }}>{oldbuzz.oz}oz  {oldbuzz.drinkType === "Beer" && <Text>🍺</Text>}{oldbuzz.drinkType === "Wine" && <Text>🍷</Text>}{oldbuzz.drinkType === "Liquor" && <Text>🥃</Text>}  {Math.round(oldbuzz.abv * 100)}% ABV</Text>
                                    <Text style={{ fontSize: 15, paddingBottom: 10 }}>{moment(oldbuzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View><TouchableOpacity style={styles.headerButton} onPress={() => this.deleteOldBuzz(id, obid)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>
                            </View>
                        </View>
                    )
                })
            }
            )
            )
        return (
            <View>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh} />} ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz 🍺 🍷 🥃</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteBuzzes()}><Text style={styles.buttonText}>Delete All Buzzes  🗑</Text></TouchableOpacity>
                    </View>
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
                    {this.state.buzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            {buzzes}</View>}
                    {this.state.oldbuzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Old Buzzes 🍺 🍷 🥃</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzzes()}><Text style={styles.buttonText}>Delete All Old Buzzes  🗑</Text></TouchableOpacity>
                        </View>}
                    {this.state.oldbuzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                        </View>}
                    {this.state.showHideBuzzes === false && (
                        this.state.oldbuzzes !== null && (
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Button onPress={() => this.showHideBuzzes()}
                                    title="Show Buzzes" />
                            </View>))}
                    {this.state.showHideBuzzes === true && (
                        this.state.oldbuzzes !== null && (
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Button onPress={() => this.showHideBuzzes()}
                                    title="Hide Buzzes" />
                            </View>))}
                    {this.state.showHideBuzzes === true && (
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
