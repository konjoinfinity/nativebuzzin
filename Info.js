import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native'

class InfoScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (<View><Text style={{ color: "#ffffff", fontSize: 25, textAlign: "center", fontWeight: '400' }}>buzzin</Text></View>),
            headerStyle: { backgroundColor: '#80cbc4' }
        };
    }

    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                    <Text style={{ marginTop: 10, fontSize: 40, textAlign: "center", padding: 20 }}>Info</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>About Us</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Feedback</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Disclaimer</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Donate</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Tips and FAQ</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>More Info</Text>
                </View>
            </ScrollView>
        );
    }
}

export default InfoScreen;