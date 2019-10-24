import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration, Keyboard, Modal, Dimensions, TextInput, Alert } from 'react-native'
import styles from "./Styles"
import { loginButtonText, logskey } from "./Variables"
import AsyncStorage from '@react-native-community/async-storage'
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

class LogScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logmodal: false, log: "", showlogs: false, logs: [], textinputheight: 0, editlog: "", editlogmodal: false
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
        Vibration.vibrate()
        if (this.state.log !== "") {
            var newLog = this.state.logs
            var logDate = new Date();
            newLog.unshift({ log: this.state.log, dateCreated: logDate })
            this.setState({ log: "", logmodal: false, logs: newLog })
            await AsyncStorage.setItem(logskey, JSON.stringify(newLog))
            if (this.state.showlogs === false) {
                this.setState({ showlogs: true }, () => {
                    setTimeout(() => {
                        this.scrolltop.scrollTo({ y: 90, animated: true })
                    }, 750)
                })
            }
        } else {
            Alert.alert("Please type in some text.")
        }
    }

    async deleteLog(log) {
        var filtered = this.state.logs.filter(deleted => deleted !== log)
        this.setState({ log: "", logmodal: false, logs: filtered })
        await AsyncStorage.setItem(logskey, JSON.stringify(filtered))
    }

    showHideLogs() {
        this.setState(prevState => ({ showlogs: !prevState.showlogs }), () => { setTimeout(() => { this.scrolltop.scrollTo(this.state.showlogs === true ? { y: 90, animated: true } : { y: 0, animated: true }) }, 750) })
        Vibration.vibrate()
    }

    confirmDelete(log) {
        Vibration.vibrate()
        Alert.alert('Are you sure you want to delete this log?', 'Please confirm.',
            [{ text: 'Yes', onPress: () => this.deleteLog(log) }, { text: 'No' }],
            { cancelable: false },
        );
    }

    render() {
        console.log(this.state.editlog)
        var currentlogs;
        this.state.logs && this.state.logs.length > 0 && (currentlogs = this.state.logs.slice(0, 5).map((log, id) => {
            return (<View key={id} style={[styles.buzzLog, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 18, textAlign: "center", paddingTop: 10, width: 250 }}>{log.log}</Text>
                    <Text style={{ fontSize: 14, padding: 5, textAlign: "center" }}>{moment(log.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                <TouchableOpacity style={styles.deleteLogButtons} onPress={() => this.setState({ editlogmodal: true, editlog: log.log }, () => { this.editloginput.focus() })}><Icon name="file-document-edit-outline" color="#ffffff" size={20} /></TouchableOpacity>
                {/* () => this.confirmDelete(log) */}
            </View>
            )
        }))
        var eachlog;
        this.state.logs && this.state.logs.length > 0 && (eachlog = this.state.logs.map((log, id) => {
            return (<View key={id} style={[styles.buzzLog, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 18, textAlign: "center", paddingTop: 10, width: 250 }}>{log.log}</Text>
                    <Text style={{ fontSize: 14, padding: 5, textAlign: "center" }}>{moment(log.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                <TouchableOpacity style={styles.deleteLogButtons} onPress={(log) => this.setState({ editlogmodal: true, editlog: log.log }, () => { this.editloginput.focus() })}><Icon name="file-document-edit-outline" color="#ffffff" size={20} /></TouchableOpacity>
            </View>
            )
        }))
        return (
            <View>
                <Modal animationType="fade" transparent={true} visible={this.state.logmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }} onStartShouldSetResponder={() => this.loginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.95 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 5, margin: 5 }}>Add New Log</Text>
                            {/* Will have to make the height value variable for all phones */}
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: this.state.textinputheight <= 236.5 ? Math.max(50, this.state.textinputheight) : 236.5, paddingLeft: 8, paddingRight: 8 }}
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
                <Modal animationType="fade" transparent={true} visible={this.state.editlogmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }} onStartShouldSetResponder={() => this.editloginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.95 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 5, margin: 5 }}>Edit Log</Text>
                            {/* Will have to make the height value variable for all phones */}
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: this.state.textinputheight <= 236.5 ? Math.max(50, this.state.textinputheight) : 236.5, paddingLeft: 8, paddingRight: 8 }}
                                blurOnSubmit={true} value={this.state.editlog} ref={(input) => { this.editloginput = input }} onFocus={() => this.editloginput.focus()}
                                onChangeText={(editlog) => this.setState({ editlog })} onSubmitEditing={() => { Keyboard.dismiss(); this.editLog() }} multiline={true} onBlur={() => { Keyboard.dismiss() }}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} returnKeyType={'done'} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.setState({ editlog: "", editlogmodal: false })}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 10 }]} onPress={() => this.editLog()}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}><View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 10 }}>
                        {/* Will have to make the marginRiight value variable for all phones */}
                        <Text style={{ fontSize: 28, padding: 10, marginRight: 62 }}>Logs</Text>
                        <TouchableOpacity style={styles.addLogButton} onPress={() => this.setState({ logmodal: true }, () => { this.loginput.focus() })}><Text style={styles.logbuttonText}>+</Text></TouchableOpacity>
                    </View>
                        {this.state.logs && eachlog !== undefined && this.state.showlogs === false && <View>{currentlogs}</View>}
                        {this.state.logs && eachlog !== undefined && this.state.showlogs === true && <View>{eachlog}</View>}
                        <View style={{ margin: 8, paddingRight: 50, paddingLeft: 50 }}><TouchableOpacity style={styles.buzzbutton} onPress={() => this.showHideLogs()}><Text style={{ color: "#FFFFFF", fontSize: loginButtonText, textAlign: "center" }}>{this.state.showlogs === false ? "Show All" : "Hide"}</Text></TouchableOpacity></View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default LogScreen;