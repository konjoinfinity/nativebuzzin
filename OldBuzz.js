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

const oldkey = "oldbuzzes"
const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"

class OldBuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldbuzzes: null,
            refreshing: false
        }
        this.deleteOldBuzzes = this.deleteOldBuzzes.bind(this);
        this.deleteOldBuzz = this.deleteOldBuzz.bind(this);
        this.getOldBuzzes = this.getOldBuzzes.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.LogOut = this.LogOut.bind(this);
    };

    async componentDidMount() {
        await AsyncStorage.getItem(oldkey, (error, result) => {
            this.setState({ oldbuzzes: JSON.parse(result) })
        })
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.getOldBuzzes();
        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 200);
    }

    async getOldBuzzes() {
        Vibration.vibrate();
        await AsyncStorage.getItem(oldkey, (error, result) => {
            this.setState({ oldbuzzes: JSON.parse(result) })
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

    async LogOut() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(oldkey, () => {
            this.setState({ oldbuzzes: null })
        })
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(namekey)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(genderkey)
        await AsyncStorage.removeItem(weightkey)
        this.props.navigation.navigate("Login")
    }

    render() {
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
                        <TouchableOpacity style={styles.button} onPress={() => this.LogOut()}><Text style={styles.buttonText}>Logout 👤</Text></TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Old Buzzes 🍺 🍷 🥃</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzzes()}><Text style={styles.buttonText}>Delete All Old Buzzes  🗑</Text></TouchableOpacity>
                    </View>
                    {this.state.oldbuzzes === null &&
                        <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", padding: 10 }}>No Old Buzzes</Text>
                        </View>}
                    {oldbuzzes}
                </ScrollView>
            </View>
        );
    }
}

export default OldBuzzScreen;

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
    }
})
