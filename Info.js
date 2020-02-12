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
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Max Recommended</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Maximum recommended limits as prescribed by the Centers for Disease Control (CDC).  14 drinks weekly for males and 7 drinks weekly for females.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { color: "blue", fontWeight: "bold", margin: 10 }]} onPress={() => { Linking.openURL('https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm') }}>Link to CDC Guidelines</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold", margin: 10 }]}>Standard Drink Calculation</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>Conversion from fluid ounces (US) to mililiters (multiply the volume value by 29.574)</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>Total Drink Volume = fluidounces * 29.574</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>Alcohol has a density of 789.24 g/L (at 20 °C)</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>Total Drink Volume * Alcohol by Volume (ABV %) * Volumetric Mass Density</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>Total = Total Drink Volume * ABV * 0.78924</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>US standard drink - Standard Drink defined as 0.6 fl oz (US) or 14g</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2 }]}>Divide the Total by the Standard Drink Size - 14</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 2, marginBottom: 10 }]}>Total Standard Drinks = Total / 14</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold", margin: 10 }]}>Our standard drink function:</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 1 }]}>standardDrinks(oz, abv)</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 1 }]}>var total, volume;</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 1 }]}>volume = oz * 29.574</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 1 }]}>total = volume * abv * 0.78924</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 1 }]}>total = total / 14</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoList : styles.infoList, { padding: 1, marginBottom: 10 }]}>return parseFloat(total.toFixed(1))</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { color: "blue", fontWeight: "bold", margin: 10 }]} onPress={() => { Linking.openURL('https://pubs.niaaa.nih.gov/publications/practitioner/PocketGuide/pocket_guide2.htm') }}>Link to NIH Standard Drink Guidelines</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { color: "blue", fontWeight: "bold", margin: 10 }]} onPress={() => { Linking.openURL('https://en.wikipedia.org/wiki/Standard_drink') }}>Link to Wikipedia Standard Drink Info</Text>

                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Happy Hour</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Set a daily break with happy hour, prevents entering drinks before set time.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Custom Break</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Take a break from drinking for a specified duration or an indefinite amount of time.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Drink Limits</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Set limits to moderate total drinks consumed.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Drink Counter</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Keep track and count your drinks over time.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Last Call</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>Set last call to moderate consumption too late into the evening.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { fontWeight: "bold" }]}>Weekly, Monthly, and Cumulative Charts</Text>
                    <Text style={addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText}>View and track consumption habits over time with multiple charts.</Text>

                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle, { padding: 1, margin: 10, padding: 10 }]}>Disclaimer</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoText : styles.infoText, { padding: 1, margin: 10 }]}>Any information provided by this application is for entertainment purposes only. All information displayed should not be considered or construed as medical, legal, or lifestyle advice on any subject matter.
        One moderation function in this application is max recommended (Maximum Recommended Weekly Consumption) based on information published by the Centers for Disease Control (CDC).  Actual drink numbers may be higher or lower than displayed
        in this app due to many factors including age, food consumption, missing drink entries, standard drink measurements, medication, hydration, or dehydration levels.  These factors are not taken into account by
        this application when estimating total drink numbers over time.  People are affected by alcohol consumption differently and we make no claim or guarantee that any person is safe or legal to operate any machinery, equipment, or vehicles before
        or after consuming any amount of alcohol.  All data entered into buzzin is stored locally, buzzin does not store personal data externally.  This app is designed as an estimation tool and to moderate alcohol consumption habits over time.</Text>
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle, { padding: 1, margin: 10, padding: 10 }]}>Acknowledgements</Text>
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
                    <Text style={[addButtonSize === "tablet" ? styles.largeInfoTitle : styles.infoTitle, { margin: 15, padding: 15 }]}>Contact</Text>
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