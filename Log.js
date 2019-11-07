import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Keyboard, Modal, Dimensions, TextInput, Alert, Vibration, Platform } from 'react-native'
import styles from "./Styles"
import { loginButtonText, logskey } from "./Variables"
import AsyncStorage from '@react-native-community/async-storage'
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ReactNativeHaptic from 'react-native-haptic';

class LogScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logmodal: false, log: "", logs: [], textinputheight: 0, editlog: "", editlogmodal: false, position: "", logselected: ""
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (<View><Text style={{ color: "#ffffff", fontSize: 25, textAlign: "center", fontWeight: '400' }}>buzzin</Text></View>),
            headerStyle: { backgroundColor: '#80cbc4' }
        };
    }

    async componentDidMount() {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('impactLight') : Vibration.vibrate()
        await AsyncStorage.getItem(logskey, (error, result) => { result !== null && result !== "[]" ? this.setState({ logs: JSON.parse(result) }) : this.setState({ logs: [] }) })
    }

    async addLog() {
        if (this.state.log !== "") {
            Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate()
            var newLog = this.state.logs
            var logDate = new Date();
            newLog.unshift({ log: this.state.log, dateCreated: logDate })
            this.setState({ log: "", logmodal: false, logs: newLog })
            await AsyncStorage.setItem(logskey, JSON.stringify(newLog))
            setTimeout(() => { this.scrolltop.scrollTo({ y: 90, animated: true }) }, 750)
        } else {
            Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('notificationWarning') : Vibration.vibrate()
            Alert.alert("Please type some text.")
        }
    }

    async deleteLog(log) {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate()
        var filtered = this.state.logs.filter(deleted => deleted !== log)
        this.setState({ log: "", editlogmodal: false, logs: filtered, editlog: "" })
        await AsyncStorage.setItem(logskey, JSON.stringify(filtered))
        setTimeout(() => { this.scrolltop.scrollTo({ y: 0, animated: true }) }, 750)
    }

    scrollToLogRef(id) {
        this.refs['log' + id].measure((ox, oy, width, height, px, py) => {
            const offsetY = oy + 90;
            this.scrolltop.scrollTo({ y: offsetY })
        });
    }

    async editLog(position) {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate()
        var editlogs = this.state.logs
        editlogs[position].log = this.state.editlog
        this.setState({ logs: editlogs, editlog: "", editlogmodal: false })
        await AsyncStorage.setItem(logskey, JSON.stringify(editlogs))
        setTimeout(() => { this.scrollToLogRef(this.state.position) }, 750)
    }

    confirmDelete(log) {
        Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('notificationWarning') : Vibration.vibrate()
        Alert.alert('Are you sure you want to delete this log?', 'Please confirm.',
            [{ text: 'Yes', onPress: () => { this.deleteLog(log) } }, { text: 'No' }],
            { cancelable: false },
        );
    }

    render() {
        console.log(this.state.textinputheight)
        var eachlog;
        this.state.logs && this.state.logs.length > 0 && (eachlog = this.state.logs.map((log, id) => {
            return (<View key={id} ref={'log' + id} style={[styles.buzzLog, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 18, textAlign: "center", paddingTop: 10, width: Dimensions.get('window').width * 0.6 }}>{log.log}</Text>
                    <Text style={{ fontSize: 14, padding: 5, textAlign: "center" }}>{moment(log.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                <TouchableOpacity style={styles.deleteLogButtons} onPress={() => this.setState({ editlogmodal: true, editlog: log.log, position: id, logselected: log }, () => { Platform.OS === "ios" ? this.loginput.focus() : setTimeout(() => this.loginput.focus(), 50) })}><Icon name="file-document-edit-outline" color="#ffffff" size={20} /></TouchableOpacity>
            </View>
            )
        }))
        // conditional for larger screens
        return (
            <View>
                <Modal animationType="fade" transparent={true} visible={this.state.logmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#00000080', paddingTop: 25 }} onStartShouldSetResponder={() => this.loginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.56 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 5, margin: 5 }}>Add New Log</Text>
                            {/* Will have to make the height value variable for all phones */}
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: this.state.textinputheight <= Dimensions.get('window').height * 0.25 ? Math.max(50, this.state.textinputheight) : Dimensions.get('window').height * 0.25, paddingLeft: 8, paddingRight: 8 }}
                                placeholder="" value={this.state.log} ref={(input) => { this.loginput = input }} onFocus={() => this.loginput.focus()}
                                onChangeText={(log) => this.setState({ log })} multiline={true} onBlur={() => { Keyboard.dismiss() }} blurOnSubmit={false}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 6 }]} onPress={() => { Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate(); this.setState({ log: "", logmodal: false }) }}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 6 }]} onPress={() => this.addLog()}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="fade" transparent={true} visible={this.state.editlogmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#00000080', paddingTop: 25 }} onStartShouldSetResponder={() => this.editloginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.56 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 5, margin: 5 }}>Edit Log</Text>
                            {/* Will have to make the height value variable for all phones */}
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: this.state.textinputheight <= Dimensions.get('window').height * 0.25 ? Math.max(50, this.state.textinputheight) : Dimensions.get('window').height * 0.25, paddingLeft: 8, paddingRight: 8 }}
                                value={this.state.editlog} ref={(input) => { this.editloginput = input }} onFocus={() => this.editloginput.focus()}
                                onChangeText={(editlog) => this.setState({ editlog })} multiline={true} onBlur={() => { Keyboard.dismiss() }} blurOnSubmit={false}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 6, backgroundColor: "#AE0000", borderColor: "#AE0000" }]} onPress={() => { this.confirmDelete(this.state.logselected) }}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 6 }]} onPress={() => { Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate(); this.setState({ editlog: "", editlogmodal: false }) }}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 6 }]} onPress={() => this.editLog(this.state.position)}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}><View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                        {/* Will have to make the marginRiight value variable for all phones */}
                        <View style={styles.hiddenLogButton}><Text style={{ color: "#e0f2f1", fontSize: 28, textAlign: "center" }}>+</Text></View>
                        <Text style={{ fontSize: 28, padding: 10 }}>Logs</Text>
                        <TouchableOpacity style={styles.addLogButton} onPress={() => this.setState({ logmodal: true }, () => { Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 10 ? ReactNativeHaptic.generate('selection') : Vibration.vibrate(); Platform.OS === "ios" ? this.loginput.focus() : setTimeout(() => this.loginput.focus(), 50) })}><Text style={styles.logbuttonText}>+</Text></TouchableOpacity>
                    </View>
                        {this.state.logs && eachlog !== undefined && <View>{eachlog}</View>}
                    </View>
                </ScrollView >
            </View >
        );
    }
}

export default LogScreen;