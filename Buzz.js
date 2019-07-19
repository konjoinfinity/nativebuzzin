import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: null,
            refreshing: false
        }
        this.deleteBuzzes = this.deleteBuzzes.bind(this);
        this.deleteBuzz = this.deleteBuzz.bind(this);
        this.getBuzzes = this.getBuzzes.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    };

    async componentDidMount() {
        const key = "buzzes"
        await AsyncStorage.getItem(key, (error, result) => {
            this.setState({ buzzes: JSON.parse(result) })
        })
    }

    async getBuzzes() {
        const key = "buzzes"
        await AsyncStorage.getItem(key, (error, result) => {
            this.setState({ buzzes: JSON.parse(result) })
        })
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.getBuzzes();
        this.setState({ refreshing: false });
    }

    async deleteBuzzes() {
        Vibration.vibrate();
        const key = "buzzes"
        await AsyncStorage.removeItem(key, () => {
            this.setState({ buzzes: null })
        })
    }

    async deleteBuzz(id) {
        Vibration.vibrate();
        const key = "buzzes"
        var filtered = this.state.buzzes.filter(buzz => buzz !== this.state.buzzes[id]);
        await AsyncStorage.setItem(key, JSON.stringify(filtered), () => {
            if (filtered.length === 0) {
                this.setState({ buzzes: null })
            } else {
                this.setState({ buzzes: filtered })
            }
        })
    }

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
                        <View style={{ alignItems: "center", paddingBottom: 10 }}><Text>{moment(buzz.dateCreated).format('MMMM Do YYYY, h:mm:ss a')}</Text></View>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteBuzz(id)}><Text style={styles.buttonText}>Delete 🗑</Text></TouchableOpacity>
                    </View>
                )
            }
            )
            )
        return (
            <View>
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz 🍺 🍷 🥃</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteBuzzes()}><Text style={styles.buttonText}>Delete All Buzzes  🗑</Text></TouchableOpacity>
                    </View>
                    {this.state.buzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Congrats, keep up the good work!</Text>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>It's been: </Text>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>3 days, 20 hours, 13 minutes, and 45 seconds</Text>
                            <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>since your last drink.</Text>
                        </View>}
                    {buzzes}
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
