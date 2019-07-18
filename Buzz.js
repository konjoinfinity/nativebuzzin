
import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class BuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buzzes: ""
        }
        this.deleteBuzzes = this.deleteBuzzes.bind(this);
        this.deleteBuzz = this.deleteBuzz.bind(this);
    };

    async componentDidMount() {
        const key = "buzzes"
        await AsyncStorage.getItem(key, (error, result) => {
            this.setState({ buzzes: JSON.parse(result) })
        })
    }

    async deleteBuzzes() {
        Vibration.vibrate();
        const key = "buzzes"
        await AsyncStorage.removeItem(key, (error, result) => {
            this.setState({ buzzes: "" })
        })
    }

    async deleteBuzz(id) {
        Vibration.vibrate();
        const key = "buzzes"
        var filtered = this.state.buzzes.filter(buzz => buzz !== this.state.buzzes[id]);
        await AsyncStorage.setItem(key, JSON.stringify(filtered), () => {
            this.setState({ buzzes: filtered })
        })
    }

    render() {
        this.componentDidMount();
        console.log(this.state.buzzes)
        let buzzes;
        this.state.buzzes &&
            (buzzes = this.state.buzzes.map((buzz, id) => {
                return (
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }} key={id}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>1 - {buzz.drinkType}</Text>
                        {buzz.drinkType === "Beer" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🍺</Text>}
                        {buzz.drinkType === "Wine" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🍷</Text>}
                        {buzz.drinkType === "Liquor" && <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>🥃</Text>}
                        <Text style={{ fontSize: 15, textAlign: "center", paddingBottom: 10 }}>{buzz.dateCreated}</Text>
                        <TouchableOpacity style={styles.checkBacButton} onPress={() => this.deleteBuzz(id)}><Text style={styles.checkBacButtonText}>Delete 🗑</Text></TouchableOpacity>
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
                        <TouchableOpacity style={styles.checkBacButton} onPress={() => this.deleteBuzzes()}><Text style={styles.checkBacButtonText}>Delete All Buzzes  🗑</Text></TouchableOpacity>
                    </View>
                    {this.state.buzzes === "" &&
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
    checkBacButton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    checkBacButtonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    }
})
