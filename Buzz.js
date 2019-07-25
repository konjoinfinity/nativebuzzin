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
            oldbuzzes: null,
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
            this.setState({ buzzes: JSON.parse(result) })
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            this.setState({ oldbuzzes: JSON.parse(result) })
        })
        await AsyncStorage.getItem(oldkey, (error, result) => {
            if (_.isArray(JSON.parse(result)) === true) {
                this.setState({ oldbuzzes: JSON.parse(result) })
                setTimeout(() => {
                    var date1 = Date.parse(this.state.oldbuzzes[this.state.oldbuzzes.length - 1].dateCreated)
                    var currentDate = new Date();
                    var date2 = currentDate.getTime();
                    var dayHourMin = this.getDayHourMin(date1, date2);
                    var days = dayHourMin[0];
                    var hours = dayHourMin[1];
                    var minutes = dayHourMin[2];
                    var seconds = dayHourMin[3];
                    this.setState({ timesince: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds since your last drink.` })
                }, 100);
            }
        })
    }

    async getBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.getItem(key, (error, result) => {
            this.setState({ buzzes: JSON.parse(result) })
        })
    }

    async getOldBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.getItem(oldkey, (error, result) => {
            this.setState({ oldbuzzes: JSON.parse(result) })
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

    async deleteOldBuzz(id) {
        Vibration.vibrate();
        var filtered = this.state.oldbuzzes.filter(oldbuzz => oldbuzz !== this.state.oldbuzzes[id]);
        await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => {
            if (filtered.length === 0) {
                this.setState({ oldbuzzes: null })
            } else {
                this.setState({ oldbuzzes: filtered })
            }
        })
    }

    showHideBuzzes() {
        this.setState(prevState => ({
            showHideBuzzes: !prevState.showHideBuzzes
        }));
        Vibration.vibrate();
    }
    // Add animate scroll to bottom when oldbuzz show button triggered
    render() {
        let buzzes;
        this.state.buzzes &&
            (buzzes = this.state.buzzes.map((buzz, id) => {
                return (
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }} key={id}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>1 - {buzz.drinkType}</Text>
                        {buzz.drinkType === "Beer" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🍺</Text>}
                        {buzz.drinkType === "Wine" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🍷</Text>}
                        {buzz.drinkType === "Liquor" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🥃</Text>}
                        <View style={{ alignItems: "center", paddingBottom: 10 }}><Text>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteBuzz(id)}><Text style={styles.buttonText}>Delete 🗑</Text></TouchableOpacity>
                    </View>
                )
            }
            )
            )
        let oldbuzzes;
        this.state.oldbuzzes &&
            (oldbuzzes = this.state.oldbuzzes.map((oldbuzz, id) => {
                return (
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }} key={id}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>1 - {oldbuzz.drinkType}</Text>
                        {oldbuzz.drinkType === "Beer" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🍺</Text>}
                        {oldbuzz.drinkType === "Wine" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🍷</Text>}
                        {oldbuzz.drinkType === "Liquor" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🥃</Text>}
                        <Text style={{ fontSize: 15, textAlign: "center", paddingBottom: 10 }}>{moment(oldbuzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzz(id)}><Text style={styles.buttonText}>Delete 🗑</Text></TouchableOpacity>
                    </View>
                )
            }
            )
            )
        return (
            <View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh} />}>
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
                    {buzzes}
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Old Buzzes 🍺 🍷 🥃</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzzes()}><Text style={styles.buttonText}>Delete All Old Buzzes  🗑</Text></TouchableOpacity>
                    </View>
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
                        <View>
                            {oldbuzzes}
                        </View>
                    )}
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
    mainviewStyle: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 55
    },
    footer: {
        position: 'absolute',
        flex: 0.1,
        left: 0,
        right: 0,
        bottom: -20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#A8A8A8'
    },
    bottomButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    footerText: {
        color: 'black',
        fontWeight: 'bold',
        alignItems: 'center',
        fontSize: 25,
    },
    textStyle: {
        alignSelf: 'center',
        color: 'orange'
    }
})
