
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
    };

    async componentDidMount() {
        const key = "buzzes"
        await AsyncStorage.getItem(key, (error, result) => {
            this.setState({ buzzes: JSON.parse(result) }
            )
        })
        console.log(this.state.buzzes)
    }

    render() {
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
