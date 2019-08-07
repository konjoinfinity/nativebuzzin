// imports to be used within the BuzzScreen
import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Button
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import _ from 'lodash'
import { NavigationEvents } from "react-navigation";

// constant keys used for asyncstorage
const key = "buzzes"
const oldkey = "oldbuzzes"

// Main ProfileScreen component
class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null,
            oldbuzzes: null,
            timesince: null,
            showHideBuzzes: false
        }
        // Bind statements are used to ensure data is changed in state by a function/method defined below
        // Binding respective state changes above 
        this.deleteBuzzes = this.deleteBuzzes.bind(this);
        this.deleteBuzz = this.deleteBuzz.bind(this);
        this.deleteOldBuzzes = this.deleteOldBuzzes.bind(this);
        this.deleteOldBuzz = this.deleteOldBuzz.bind(this);
        this.showHideBuzzes = this.showHideBuzzes.bind(this);
    };

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

    // Requests data from device storage for buzzes and oldbuzzes, writes them to state.
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
                // Checking the current break time using the timestamp and setting the breaktime state, because oldbuzzes are arrays 
                // within an array, the syntax is oldbuzzes[0][0].dateCreated
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
    }

    // Deletes all buzzes from state and device storage
    async deleteBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(key, () => {
            this.setState({ buzzes: null })
        })
    }

    // Deletes single (selected buzz) from state and device storage
    async deleteBuzz(id) {
        Vibration.vibrate();
        // Using the filter method we put all buzzes that do not equal the buzz selected into an array
        var filtered = this.state.buzzes.filter(buzz => buzz !== this.state.buzzes[id]);
        // We then write the filtered array to state and to device storage
        await AsyncStorage.setItem(key, JSON.stringify(filtered), () => {
            if (filtered.length === 0) {
                this.setState({ buzzes: null })
            } else {
                this.setState({ buzzes: filtered })
            }
        })
    }

    // Deletes all oldbuzzes from state and device storage
    async deleteOldBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(oldkey, () => {
            this.setState({ oldbuzzes: null })
        })
    }

    // Deletes single (selected oldbuzz) from state and device storage, we pass in the oldbuzz array (id) and sub array (obid) 
    async deleteOldBuzz(id, obid) {
        var newArray = this.state.oldbuzzes;
        Vibration.vibrate();
        // Using the filter method we put all oldbuzzes that do not equal the oldbuzz selected into an array
        // We use the this.state.oldbuzzes[obid][id] syntax to correctly filter a single oldbuzz from the arrays within the array
        var filtered = this.state.oldbuzzes[obid].filter(buzz => buzz !== this.state.oldbuzzes[obid][id])
        newArray[obid] = filtered;
        // We then write the filtered array to state and to device storage
        await AsyncStorage.setItem(oldkey, JSON.stringify(newArray), () => {
            if (newArray.length === 0) {
                this.setState({ oldbuzzes: null })
            } else {
                this.setState({ oldbuzzes: newArray })
            }
        })
    }

    // When triggered the oldbuzzes are shown or hidden, the opposite boolean state is written to state when triggered.
    showHideBuzzes() {
        this.setState(prevState => ({
            showHideBuzzes: !prevState.showHideBuzzes
        }), () => setTimeout(() => {
            if (this.state.showHideBuzzes === true) {
                // Animation to scroll the view to the end is triggered after the state is changed to true
                this.scrolltop.scrollToEnd({ animated: true });
            } else {
                // Animation to scroll the view to the top is triggered after the state is changed to false
                this.scrolltop.scrollTo({ y: 0, animated: true });
            }
        }, 300));
        Vibration.vibrate();
    }

    render() {
        // Defining buzzes variable and if this.state.buzzes is present, we map the array
        let buzzes;
        this.state.buzzes &&
            // The map function translates all data in the buzz array into the return function
            (buzzes = this.state.buzzes.map((buzz, id) => {
                // We display/render the buzz number of ounces, drink type icon, drink abv, and the dateCreated timestamp converted to localtime 
                return (
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 }} key={id}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 20, paddingBottom: 10 }}>{buzz.oz}oz  {buzz.drinkType === "Beer" && <Text>🍺</Text>}{buzz.drinkType === "Wine" && <Text>🍷</Text>}{buzz.drinkType === "Liquor" && <Text>🥃</Text>}  {Math.round(buzz.abv * 100)}% ABV</Text>
                            <Text style={{ fontSize: 15, paddingBottom: 10 }}>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm a')}</Text></View><TouchableOpacity style={styles.headerButton} onPress={() => this.deleteBuzz(id)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>
                    </View>
                )
            }))
        // Defining oldbuzzes variable and if this.state.olduzzes is present, we map the array
        let oldbuzzes;
        this.state.oldbuzzes !== null &&
            // The map function translates all data in the oldbuzz array into the return function
            (oldbuzzes = this.state.oldbuzzes.map((buzz, obid) => {
                return buzz.map((oldbuzz, id) => {
                    return (
                        // We display/render the oldbuzz number of ounces, drink type icon, drink abv, and the dateCreated timestamp converted to localtime 
                        // Because the oldbuzzes are stored in arrays inside of an array, we have to map twice to get the Session Date, id, and obid
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
            }))
        return (
            <View>
                {/* When this screen is loaded after the first time, a fresh copy of data is requested and written to state */}
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                {/* The scroll view is given a reference to scroll to end or to the top from within another function (show/hide oldbuzzes) */}
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    {/* When this.state.buzzes is not null, the current buzz card is rendered with a Delete all buzzes button */}
                    {this.state.buzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz 🍺 🍷 🥃</Text>
                            {/* This button triggers the deleteBuzzes function deleting all buzzes in the current buzz array */}
                            <TouchableOpacity style={styles.button} onPress={() => this.deleteBuzzes()}>
                                <Text style={styles.buttonText}>Delete All Buzzes  🗑</Text></TouchableOpacity>
                        </View>}
                    {/* When this.state.buzzes is null, the time since card view is rendered */}
                    {this.state.buzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Congrats, keep up the good work!</Text>
                            {/* When this.state.timesince is present, the time since the users last drink is rendered */}
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>It's been: </Text>}
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>{this.state.timesince}</Text>}
                            {this.state.timesince !== null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>since your last drink.</Text>}
                            {this.state.timesince === null &&
                                <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>You haven't had any drinks.</Text>}
                        </View>}
                    {/* Mapped buzzes are displayed here */}
                    {this.state.buzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            {buzzes}</View>}
                    {/* When this.state.oldbuzzes does not equal null, the oldbuzz title card is shown */}
                    {this.state.oldbuzzes !== null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Old Buzzes 🍺 🍷 🥃</Text>
                            {/* When this.state.showHideBuzzes is equal to true, the delete all old buzzes button is rendered.  When 
                            pressed, it deletes all oldbuzzes */}
                            {this.state.showHideBuzzes === true && (
                                this.state.oldbuzzes !== null && (<TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzzes()}><Text style={styles.buttonText}>Delete All Old Buzzes  🗑</Text></TouchableOpacity>))}
                        </View>}
                    {/* When this.state.showHideBuzzes is equal to null, the no old buzzes card is rendered */}
                    {this.state.oldbuzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                        </View>}
                    {/* Whne this.state.showHideBuzzes is equal to false and this.state.showHideBuzzes is not equal to null
                        a button is rendered.  When pressed, it shows all the old buzzes */}
                    {this.state.showHideBuzzes === false && (
                        this.state.oldbuzzes !== null && (
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Button onPress={() => this.showHideBuzzes()}
                                    title="Show Old Buzzes" />
                            </View>))}
                    {/* When the oldbuzzes are rendered, the hide old buzzes button is rendered.  When pressed, it hides the oldbuzzes */}
                    {this.state.showHideBuzzes === true && (
                        this.state.oldbuzzes !== null && (
                            <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                                <Button onPress={() => this.showHideBuzzes()}
                                    title="Hide Old Buzzes" />
                            </View>))}
                    {/* Mapped oldbuzzes are displayed here when this.state.showHideBuzzes is equal to true */}
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
// Noraml export of BuzzScreen for use throughout the App
export default BuzzScreen;

// Styles are defined
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
