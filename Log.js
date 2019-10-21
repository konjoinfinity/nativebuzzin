import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration, Keyboard, Modal, Dimensions, TextInput } from 'react-native'
import styles from "./Styles"
import loginButtonText from "./Variables"

class LogScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logmodal: false, log: "", showlogs: false, logs: null, textinputheight: 0
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (<View><Text style={{ color: "#ffffff", fontSize: 25, textAlign: "center", fontWeight: '400' }}>buzzin</Text></View>),
            headerStyle: { backgroundColor: '#80cbc4' }
        };
    }

    componentDidMount() {
        Vibration.vibrate()
    }

    async addLog() {
        // Consider adding a scroll to logs to view
        // Create new log data model here
        // Add ability to delete entries as well
        // Store separately from buzzes
        Vibration.vibrate()
        if (this.state.log !== "") {
            if (this.state.buzzes[this.state.buzzes.length - 1].log) {
                this.state.buzzes[this.state.buzzes.length - 1].log.unshift({ entry: this.state.log })
            } else {
                this.state.buzzes[this.state.buzzes.length - 1].log = [{ entry: this.state.log }]
            }
            this.setState({ log: "", logmodal: false })
            await AsyncStorage.setItem(key, JSON.stringify(this.state.buzzes))
        } else {
            Alert.alert("Please Enter a Note")
        }
    }

    showHideLogs() {
        this.setState(prevState => ({ showlogs: !prevState.showlogs }))
        Vibration.vibrate()
    }

    render() {
        return (
            <View>
                <Modal animationType="fade" transparent={true} visible={this.state.logmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }} onStartShouldSetResponder={() => this.loginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.5 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 10, margin: 10 }}>Add Log Entry</Text>
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: Math.max(50, this.state.textinputheight), paddingLeft: 8, paddingRight: 8 }}
                                placeholder="" blurOnSubmit={true} value={this.state.log} ref={(input) => { this.loginput = input }} onFocus={() => this.loginput.focus()}
                                onChangeText={(log) => this.setState({ log })} onSubmitEditing={() => { Keyboard.dismiss(); this.addLog() }} multiline={true} onBlur={() => { Keyboard.dismiss() }}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} returnKeyType={'done'} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.setState({ log: "", logmodal: false })}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.addLog()}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 20, marginTop: 10 }}><Text style={{ fontSize: 40, textAlign: "center" }}>New Log</Text>
                            <TouchableOpacity style={[styles.plusMinusButtons, { marginTop: 2 }]} onPress={() => this.setState({ logmodal: true }, () => { this.loginput.focus() })}><Text style={styles.buttonText}>+</Text></TouchableOpacity></View>
                        <Text style={styles.infoTitle}>Render Logs Here</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default LogScreen;