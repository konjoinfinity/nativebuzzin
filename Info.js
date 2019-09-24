import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, Platform, TouchableOpacity } from 'react-native'
import styles from "./Styles"

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
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>About Us</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Feedback</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Disclaimer</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Donate</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Tips and FAQ</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>More Info</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Contact</Text>
                    <TouchableOpacity style={styles.profilebutton} onPress={() => {
                        (Platform.OS === 'android')
                            ? Linking.openURL('mailto:info@buzzin.io?cc=?subject=Buzzin&body=Message')
                            : Linking.openURL('mailto:info@buzzin.io?cc=&subject=Buzzin&body=Message')
                    }}><Text style={{ textAlign: "center", color: "#ffffff" }}>Send Email</Text></TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

export default InfoScreen;