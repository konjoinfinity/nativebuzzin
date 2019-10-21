import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration, Keyboard, Modal, Dimensions, TextInput } from 'react-native'
import styles from "./Styles"
import { loginButtonText, logskey } from "./Variables"
import AsyncStorage from '@react-native-community/async-storage'
import moment from "moment";

class LogScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logmodal: false, log: "", showlogs: false, logs: [], textinputheight: 0
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (<View><Text style={{ color: "#ffffff", fontSize: 25, textAlign: "center", fontWeight: '400' }}>buzzin</Text></View>),
            headerStyle: { backgroundColor: '#80cbc4' }
        };
    }

    async componentDidMount() {
        Vibration.vibrate()
        await AsyncStorage.getItem(logskey, (error, result) => { result !== null && result !== "[]" ? this.setState({ logs: JSON.parse(result) }) : this.setState({ logs: [] }) })
    }

    async addLog() {
        // Consider adding a scroll to logs to view
        // Create new log data model here
        // Add ability to delete entries as well
        // Store separately from buzzes
        Vibration.vibrate()
        if (this.state.log !== "") {
            console.log(this.state.logs)
            var newLog = this.state.logs
            console.log(newLog)
            var logDate = new Date();
            newLog.unshift({ log: this.state.log, dateCreated: logDate })
            console.log(newLog)
            this.setState({ log: "", logmodal: false, logs: newLog }, () => console.log(this.state.logs))
            await AsyncStorage.setItem(logskey, JSON.stringify(newLog))
        } else {
            Alert.alert("Please Enter a Note")
        }
    }

    async deleteLog(log) {
        var filtered = this.state.logs.filter(deleted => deleted !== log)
        console.log(filtered)
        this.setState({ log: "", logmodal: false, logs: filtered }, () => console.log(this.state.logs))
        await AsyncStorage.setItem(logskey, JSON.stringify(filtered))
    }

    showHideLogs() {
        this.setState(prevState => ({ showlogs: !prevState.showlogs }))
        Vibration.vibrate()
    }

    render() {
        var eachlog;
        this.state.logs && this.state.logs.length > 0 && (eachlog = this.state.logs.map((log, id) => {
            return (<View key={id} style={[styles.buzzLog, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 18, textAlign: "center", padding: 10 }}>{log.log}</Text>
                    <Text style={{ fontSize: 14, padding: 2, textAlign: "center" }}>{moment(log.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                <TouchableOpacity style={styles.buzzheaderButton} onPress={() => this.deleteLog(log)}><Text style={styles.buttonText}>🗑</Text></TouchableOpacity>
            </View>
            )
        }))
        return (
            <View>
                <Modal animationType="fade" transparent={true} visible={this.state.logmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }} onStartShouldSetResponder={() => this.loginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.5 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 10, margin: 10 }}>Add New Log</Text>
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
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 20, marginTop: 10 }}><Text style={styles.infoTitle}>New Log</Text>
                            <TouchableOpacity style={styles.addLogButton} onPress={() => this.setState({ logmodal: true }, () => { this.loginput.focus() })}><Text style={styles.logbuttonText}>+</Text></TouchableOpacity></View>
                    </View>
                    <View style={styles.buzzCard}><View style={{ flexDirection: "row", justifyContent: "space-evenly" }}><Text style={{ fontSize: loginButtonText, textAlign: "center" }}>Logs</Text><TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideLogs()}><Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showlogs === false ? "Show" : "Hide"}</Text></TouchableOpacity></View>
                        {this.state.logs && eachlog !== undefined && this.state.showlogs === true && <View>{eachlog}</View>}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default LogScreen;