import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, Platform, TouchableOpacity, Dimensions } from 'react-native'
import ReactNativeHaptic from 'react-native-haptic';
import styles from "./Styles"
import { addButtonSize } from "./Variables"

class InfoScreen extends Component {

    componentDidMount() {
        ReactNativeHaptic.generate('impactLight')
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (<View><Text style={{ color: "#ffffff", fontSize: addButtonSize === "tablet" ? 40 : 25, textAlign: "center", fontWeight: '400' }}>buzzin</Text></View>),
            headerStyle: { backgroundColor: '#80cbc4', height: Dimensions.get('window').height * 0.066 },
            headerBackTitleStyle: { fontSize: addButtonSize === "tablet" ? 30 : 22 }
        };
    }

    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle}>Features</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Happy Hour</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Set a daily break with happy hour, prevents entering drinks before set time.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Custom Break</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Take a break from drinking for a specified duration or an indefinite amount of time.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Session Limits</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Set session limits to moderate total drinks consumed or BAC session level.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>BAC Estimation</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Track your current drinking session and view your estimated BAC (Blood Alcohol Content).</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Last Call</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Set last call to moderate consumption too late into the evening.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Drink Pacer</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Drink pacer helps moderate drinking too quickly.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Max Recommended</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Maximum recommended limits as prescribed by the Centers for Disease Control (CDC).  14 drinks weekly for males and 7 drinks weekly for females.</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle}>Disclaimer</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Any information provided by this application is for entertainment purposes only. All information displayed should not be considered or construed as medical, legal, or lifestyle advice on any subject matter.
One moderation function in this application estimates blood alcohol content (BAC) based on body weight and gender using information published by the National Institutes for Health (NIH).  Maximum recommended alcoholic consumption amounts are based on information provided by the Centers for Disease Control (CDC).  Actual BAC may be higher or lower than displayed in this app due to many factors including age, food consumption, medication, and hydration or dehydration levels.  These factors are not taken into account by this application when estimating BAC.
People are affected by alcohol consumption differently and we make no claim or guarantee that any person is safe or legal to operate any machinery, equipment, or vehicles before or after consuming any amount of alcohol.
All data entered into buzzin is stored locally, buzzin does not store personal data externally.  This app is designed as an estimation tool and to moderate alcohol consumption habits over time.</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle}>Acknowledgements</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Built using the following third party packages available via npm and github:</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>eslint</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>jetifier</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>lodash</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>moment</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>eslint-utils</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-svg</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-navigation</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-haptic</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-copilot</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-svg-charts</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-vector-icons</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-speedometer</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-multi-switch</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-dropdownalert</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-numeric-input</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-gesture-handler</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-calendar-picker</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>react-native-countdown-component</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList}>@react-native-community/async-storage</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle}>Contact</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={[styles.profilebutton, styles.dropShadow1]} onPress={() => {
                            (Platform.OS === 'android')
                                ? Linking.openURL('mailto:info@buzzin.io?cc=?subject=Buzzin&body=Message')
                                : Linking.openURL('mailto:info@buzzin.io?cc=&subject=Buzzin&body=Message')
                        }}><Text style={addButtonSize === "tablet" ? styles.largeButtonText : { textAlign: "center", color: "#ffffff" }}>Email Us</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.profilebutton, styles.dropShadow1]} onPress={() => { Linking.openURL('http://www.buzzin.io') }}>
                            <Text style={addButtonSize === "tablet" ? styles.largeButtonText : { textAlign: "center", color: "#ffffff" }}>Our Website</Text></TouchableOpacity>
                    </View>
                    <Text style={[styles.profileLine, { paddingTop: 20 }]}>_________________________________________</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { paddingTop: 10 }]}>​© 2020 LifeSystem LLC</Text>
                </View>
            </ScrollView >
        );
    }
}

export default InfoScreen;