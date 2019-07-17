
import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration
} from 'react-native';

class BuzzScreen extends Component {

    render() {
        return (
            <View>
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz 🍺 🍷 🥃</Text>
                        <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>Delete All Buzzes 🗑</Text></TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Current Buzz</Text>
                        <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>Congrats, keep up the good work!</Text>
                        <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>It's been: </Text>
                        <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>3 days, 20 hours, 13 minutes, and 45 seconds</Text>
                        <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}>since your last drink.</Text>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>1 Beer/Wine/Liquor</Text>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>Monday July 15th 2019 14:31</Text>
                        <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>Delete 🗑</Text></TouchableOpacity>
                    </View>
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
