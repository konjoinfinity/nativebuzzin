import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    TouchableHighlight
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";

class OldBuzzScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldbuzzes: null
        }
        this.deleteOldBuzzes = this.deleteOldBuzzes.bind(this);
        this.deleteOldBuzz = this.deleteOldBuzz.bind(this);
    };

    async componentDidMount() {
        const oldkey = "oldbuzzes"
        await AsyncStorage.getItem(oldkey, (error, result) => {
            this.setState({ oldbuzzes: JSON.parse(result) })
        })
    }

    async deleteOldBuzzes() {
        Vibration.vibrate();
        const oldkey = "oldbuzzes"
        await AsyncStorage.removeItem(oldkey, () => {
            this.setState({ oldbuzzes: null })
        })
    }

    async deleteOldBuzz(id) {
        Vibration.vibrate();
        const oldkey = "oldbuzzes"
        var filtered = this.state.oldbuzzes.filter(oldbuzz => oldbuzz !== this.state.oldbuzzes[id]);
        await AsyncStorage.setItem(oldkey, JSON.stringify(filtered), () => {
            if (filtered.length === 0) {
                this.setState({ oldbuzzes: null })
            } else {
                this.setState({ oldbuzzes: filtered })
            }
        })
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
                        <Text style={{ fontSize: 15, textAlign: "center", paddingBottom: 10 }}>{moment(oldbuzz.dateCreated).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteOldBuzz(id)}><Text style={styles.buttonText}>Delete 🗑</Text></TouchableOpacity>
                    </View>
                )
            }
            )
            )
        return (
            <View>
                <ScrollView>
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
                <View style={styles.mainviewStyle}>
                    <View style={styles.footer}>
                        <TouchableHighlight style={styles.bottomButtons} onPress={() => this.props.navigation.push("Home")}>
                            <Text style={styles.footerText}>🏠</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomButtons} onPress={() => this.props.navigation.push("Buzz")}>
                            <Text style={styles.footerText}>🍺</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomButtons} onPress={() => this.props.navigation.push("OldBuzz")}>
                            <Text style={styles.footerText}>🐝</Text>
                        </TouchableHighlight>
                    </View>
                </View>
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
    },
    mainviewStyle: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 400
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
