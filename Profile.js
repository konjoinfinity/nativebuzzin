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
import MultiSwitch from "react-native-multi-switch";
import _ from 'lodash';

const oldkey = "oldbuzzes"
const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const highkey = "highbac"
const defaultkey = "defaultacltype"

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            gender: "",
            weight: "",
            alctype: ""
        }
        this.LogOut = this.LogOut.bind(this);
        this.setDefaultDrink = this.setDefaultDrink.bind(this);
    };

    async componentDidMount() {
        await AsyncStorage.getItem(namekey, (error, result) => {
            this.setState({ name: JSON.parse(result) })
        })
        await AsyncStorage.getItem(genderkey, (error, result) => {
            this.setState({ gender: JSON.parse(result) })
        })
        await AsyncStorage.getItem(weightkey, (error, result) => {
            this.setState({ weight: JSON.parse(result) })
        })
        await AsyncStorage.getItem(defaultkey, (error, result) => {
            if (result !== null) {
                this.setState({ alctype: result })
            } else {
                this.setState({ alctype: "Beer" })
            }
        })
    }

    async setDefaultDrink(drink) {
        Vibration.vibrate();
        await AsyncStorage.setItem(defaultkey, drink)
    }

    async LogOut() {
        Vibration.vibrate();
        await AsyncStorage.removeItem(oldkey)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(namekey)
        await AsyncStorage.removeItem(key)
        await AsyncStorage.removeItem(genderkey)
        await AsyncStorage.removeItem(weightkey)
        await AsyncStorage.removeItem(highkey)
        this.props.navigation.navigate("Login")
    }

    render() {
        let data = [{ value: 'Beer' }, { value: 'Wine' }, { value: 'Liquor' }];
        let activeStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }]
        return (
            <View>
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>👤 {this.state.name}</Text>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{this.state.gender === "Male" ? "♂" : "♀"} {this.state.gender}</Text>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{this.state.weight} lbs.</Text>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10, alignSelf: "center" }}>
                        <Text style={{ fontSize: 25, textAlign: "center", padding: 20 }}>Default Drink Choice</Text>
                        <View style={[styles.multiSwitchViews, { alignSelf: "center", paddingBottom: 15 }]}>
                            {this.state.alctype === "Beer" &&
                                <MultiSwitch choiceSize={90}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                    onActivate={(number) => { this.setDefaultDrink(data[number].value) }}
                                    active={0}>
                                    <Text style={{ fontSize: 35 }}>🍺</Text>
                                    <Text style={{ fontSize: 35 }}>🍷</Text>
                                    <Text style={{ fontSize: 35 }}>🥃</Text>
                                </MultiSwitch>}
                            {this.state.alctype === "Wine" &&
                                <MultiSwitch choiceSize={90}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                    onActivate={(number) => { this.setDefaultDrink(data[number].value) }}
                                    active={1}>
                                    <Text style={{ fontSize: 35 }}>🍺</Text>
                                    <Text style={{ fontSize: 35 }}>🍷</Text>
                                    <Text style={{ fontSize: 35 }}>🥃</Text>
                                </MultiSwitch>}
                            {this.state.alctype === "Liquor" &&
                                <MultiSwitch choiceSize={90}
                                    activeItemStyle={activeStyle}
                                    layout={{ vertical: 0, horizontal: -1 }}
                                    containerStyles={_.times(3, () => (styles.multiSwitch))}
                                    onActivate={(number) => { this.setDefaultDrink(data[number].value) }}
                                    active={2}>
                                    <Text style={{ fontSize: 35 }}>🍺</Text>
                                    <Text style={{ fontSize: 35 }}>🍷</Text>
                                    <Text style={{ fontSize: 35 }}>🥃</Text>
                                </MultiSwitch>}
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.LogOut()}>
                            <Text style={styles.buttonText}>Logout ➡️🚪</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default ProfileScreen;

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
    multiSwitchViews: {
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3
    }
})
