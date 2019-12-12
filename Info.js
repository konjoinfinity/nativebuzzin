import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, Platform, TouchableOpacity, Vibration, Alert, Dimensions, PixelRatio } from 'react-native'
import ReactNativeHaptic from 'react-native-haptic';
import styles from "./Styles"

var screenWidth = Dimensions.get('window').width * PixelRatio.get()
var screenHeight = Dimensions.get('window').height * PixelRatio.get()

class InfoScreen extends Component {

    componentDidMount() {
        ReactNativeHaptic.generate('impactLight')
    }

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
                    <Text style={{ color: "#000000", marginTop: 10, fontSize: 40, textAlign: "center", padding: 10 }}>Info</Text>
                    <Text style={styles.infoText}>buzzin - a modern alcohol moderation app.</Text>
                    <Text style={styles.infoText}>Users can track blood alcohol content in real time based on individual gender and weight. Other features include weekly
                    and monthly historical charts, realtime and retroactive buzz session editing, demo screen to show friends, a log to keep personal notes about your
                    drinking habits, and a metric switch to change between imperial and metric drink measurements.</Text>
                    <Text style={styles.infoTitle}>About Us</Text>
                    <Text style={styles.infoText}>Co-Founders Charles and Wesley started developing this app in June 2019 to help people drink alcohol responsibly.
                    We both have at one point in our lives struggled with alcohol.  We hope this tool we built helps our users to get a better handle on their drinking habits.
                    We both use the tool daily and we hope you will too.</Text>
                    <Text style={styles.infoTitle}>Disclaimer</Text>
                    <Text style={styles.infoText}>The Blood Alcohol Content (BAC) calculations displayed in buzzin
                    are not 100% accurate.  buzzin is designed to give users a general estimate based on their entered weight and gender.  All user data entered into the app is
                    stored locally on each individual device, no user data is stored externally by buzzin. This app is designed to track and reduce personal alcoholic consumption
                    habits over time using moderation.  Enjoy!</Text>
                    <Text style={styles.infoTitle}>Tips</Text>
                    <Text style={styles.infoText}>We recommend enabling at least one moderation option on the profile page.  All options can be enabled or disabled at any time.
                    Moderation options:</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Happy Hour</Text>
                    <Text style={styles.infoText}>With happy hour enabled, drink entries can only be entered after the set daily happy hour time.  The happy hour card will be shown
                    advising the happy hour time.</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Custom Break</Text>
                    <Text style={styles.infoText}>With custom break enabled, the user can go on a specified duration or indefinite break.
                    When a specified duration is set, a break card is shown with a countdown until the break is completed.  When the indefinite break is set, a break card
                    will show indefinitely until the user turns the option off.  The time since last drink will also be displayed.</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Session Limits</Text>
                    <Text style={styles.infoText}>When session limits are enabled, a total Blood Alcohol Content (BAC) limit and a total drink limit are both set.  If either limit
                    is reached during a current session, the session limits card is displayed preventing additional drinks from being entered.</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Last Call</Text>
                    <Text style={styles.infoText}>When last call is enabled, the user will be prevented from entering additional drinks by the last call card.  This last call card is
                    shown when the current time is after the set last call hour.</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Drink Pacer</Text>
                    <Text style={styles.infoText}>Drink pacer prevents entering drinks too quickly when enabled.  If set to 30 minute intervals, the user is unable to add additional
                    drinks until the 30 minute countdown timer is finished.  Users can adjust the drink pacer based on personal preference to prevent drinking too much in a short
                    period of time.</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Max Recommended</Text>
                    <Text style={styles.infoText}>When max Recommended is enabled, the user will be cut off when they reach the weekly maximum recommended limit as perscribed by the
                    Centers for Disease Control (CDC).  14 drinks weekly for males and 7 drinks weekly for females.</Text>
                    <Text style={[styles.infoText, { fontWeight: "bold" }]}>Auto Break</Text>
                    <Text style={styles.infoText}>Auto break triggers when the user has reached the set auto break BAC threshold, and when the BAC reaches 0.0.  After, the user is
                    automatically placed on an break.  This gives the user time and a reference to think about the last drinking session.</Text>
                    <Text style={styles.infoTitle}>Acknowledgements</Text>
                    <Text style={styles.infoText}>Built using the following third party packages available via npm and github:</Text>
                    <Text style={styles.infoList}>react</Text>
                    <Text style={styles.infoList}>eslint</Text>
                    <Text style={styles.infoList}>jetifier</Text>
                    <Text style={styles.infoList}>lodash</Text>
                    <Text style={styles.infoList}>moment</Text>
                    <Text style={styles.infoList}>eslint-utils</Text>
                    <Text style={styles.infoList}>react-native</Text>
                    <Text style={styles.infoList}>react-native-svg</Text>
                    <Text style={styles.infoList}>react-navigation</Text>
                    <Text style={styles.infoList}>react-native-haptic</Text>
                    <Text style={styles.infoList}>react-native-copilot</Text>
                    <Text style={styles.infoList}>react-native-svg-charts</Text>
                    <Text style={styles.infoList}>react-native-vector-icons</Text>
                    <Text style={styles.infoList}>react-native-speedometer</Text>
                    <Text style={styles.infoList}>react-native-multi-switch</Text>
                    <Text style={styles.infoList}>react-native-dropdownalert</Text>
                    <Text style={styles.infoList}>react-native-numeric-input</Text>
                    <Text style={styles.infoList}>react-native-gesture-handler</Text>
                    <Text style={styles.infoList}>react-native-calendar-picker</Text>
                    <Text style={styles.infoList}>react-native-countdown-component</Text>
                    <Text style={styles.infoList}>@react-native-community/async-storage</Text>
                    <Text style={styles.infoTitle}>Contact</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={[styles.profilebutton, styles.dropShadow1]} onPress={() => {
                            (Platform.OS === 'android')
                                ? Linking.openURL('mailto:info@buzzin.io?cc=?subject=Buzzin&body=Message')
                                : Linking.openURL('mailto:info@buzzin.io?cc=&subject=Buzzin&body=Message')
                        }}><Text style={{ textAlign: "center", color: "#ffffff" }}>Email Us</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.profilebutton, styles.dropShadow1]} onPress={() => { Linking.openURL('http://www.buzzin.io') }}>
                            <Text style={{ textAlign: "center", color: "#ffffff" }}>Our Website</Text></TouchableOpacity>
                    </View>
                </View >
            </ScrollView >
        );
    }
}

export default InfoScreen;