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
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>The buzzin app helps to reduce, moderate, and track personal alcohol consumption habits.  Alcohol is a problem for many people around the world.  We want to help people control the amount of alcohol they consume in a responsible manner.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>About Us</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Co-Founders Charles and Wesley started developing this app in June 2019 to help people drink alcohol responsibly.  We both have at one point in our lives struggled with alcohol.  We hope this tool we built helps our users to get a better handle on their drinking habits.  We both use the tool daily and we hope you will too.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Feedback</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Disclaimer</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Buzzin' will not be held liable for any decisions made based on the information provided.  The Blood Alcohol Content (BAC) calculations are not 100% accurate and are aimed to give our users a general ballpark estimate based on their approximate weight and gender.  Users are liable for all data they input, as it is stored on their personal local device.  No user data is stored externally, Buzzin' does not store inputted user data externally.  By pressing agree, the user forfeits their rights to hold Buzzin' or LifeSystems LLC liable for any incidents, accidents, decisions based on information provided, risky activities, personal bodily injury, or accidental death.  This application is designed to reduce and track personal alcoholic consumption habits.  Enjoy!</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Donate</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Paypal (register buzzin.io email for paypal)Instructions for moderation options, how to use other parts of the app, etc.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Tips and FAQ</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Instructions for moderation options, how to use other parts of the app, etc.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>More Info</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Acknowledgements</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Built using the following third party packages:</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>eslint</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>jetifier</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>lodash</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>moment</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>eslint-utils</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-svg</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-navigation</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-copilot</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-svg-charts</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-vector-icons</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-speedometer</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-multi-switch</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-dropdownalert</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-numeric-input</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>react-native-gesture-handler</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", padding: 1 }}>@react-native-community/async-storage</Text>
                    <Text style={{ fontSize: 30, textAlign: "center", padding: 15 }}>Contact</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={styles.profilebutton} onPress={() => {
                            (Platform.OS === 'android')
                                ? Linking.openURL('mailto:info@buzzin.io?cc=?subject=Buzzin&body=Message')
                                : Linking.openURL('mailto:info@buzzin.io?cc=&subject=Buzzin&body=Message')
                        }}><Text style={{ textAlign: "center", color: "#ffffff" }}>Email Us</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.profilebutton} onPress={() => { Linking.openURL('http://www.buzzin.io') }}>
                            <Text style={{ textAlign: "center", color: "#ffffff" }}>Our Website</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default InfoScreen;