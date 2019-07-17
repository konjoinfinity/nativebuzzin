
import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Vibration
} from 'react-native';

class OldBuzzScreen extends Component {
    render() {
        return (
            <View>
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>Old Buzzes 🍺 🍷 🥃</Text>
                        <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>Delete All Old Buzzes  🗑</Text></TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>1 Beer/Wine/Liquor</Text>
                        <Text style={{ fontSize: 25, textAlign: "center", paddingBottom: 10 }}>Monday July 1st 2019 19:11</Text>
                        <TouchableOpacity style={styles.checkBacButton} onPress={() => Vibration.vibrate()}><Text style={styles.checkBacButtonText}>Delete 🗑</Text></TouchableOpacity>
                    </View>
                    <View paddingBottom={100}></View>
                </ScrollView>
            </View>
        );
    }
}

export default OldBuzzScreen;

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
