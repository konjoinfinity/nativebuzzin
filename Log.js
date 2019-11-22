import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Keyboard, Modal, Dimensions, TextInput, Alert, Platform } from 'react-native'
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
        ReactNativeHaptic.generate('impactLight')
        await AsyncStorage.getItem(logskey, (error, result) => { result !== null && result !== "[]" ? this.setState({ logs: JSON.parse(result) }) : this.setState({ logs: [] }) })
    }

    async addLog() {
        if (this.state.log !== "") {
            ReactNativeHaptic.generate('selection')
            var newLog = this.state.logs
            var logDate = new Date();
            newLog.unshift({ log: this.state.log, dateCreated: logDate })
            this.setState({ log: "", logmodal: false, logs: newLog })
            await AsyncStorage.setItem(logskey, JSON.stringify(newLog))
            setTimeout(() => { this.scrolltop.scrollTo({ y: 90, animated: true }) }, 750)
        } else {
            ReactNativeHaptic.generate('notificationWarning')
            Alert.alert("Please enter some text.", "", [{ text: "Ok", onPress: () => ReactNativeHaptic.generate("selection") }], { cancelable: false })
        }
    }

    async deleteLog(log) {
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
        ReactNativeHaptic.generate('selection')
        var editlogs = this.state.logs
        editlogs[position].log = this.state.editlog
        this.setState({ logs: editlogs, editlog: "", editlogmodal: false })
        await AsyncStorage.setItem(logskey, JSON.stringify(editlogs))
        setTimeout(() => { this.scrollToLogRef(this.state.position) }, 750)
    }

    confirmDelete(log) {
        ReactNativeHaptic.generate('notificationWarning')
        Alert.alert('Are you sure you want to delete this log?', 'Please confirm.', [{ text: 'Yes', onPress: () => { ReactNativeHaptic.generate("notification"); this.deleteLog(log) } }, { text: 'No', onPress: () => { ReactNativeHaptic.generate("selection") } }], { cancelable: false });
    }

    render() {
        var eachlog;
        this.state.logs && this.state.logs.length > 0 && (eachlog = this.state.logs.map((log, id) => {
            return (<View key={id} ref={'log' + id} style={[styles.buzzLog, { flexDirection: "row", justifyContent: "space-evenly" }]}>
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 18, padding: 4, textAlign: "left", paddingTop: 10, width: Dimensions.get('window').width * 0.58 }}>{log.log}</Text>
                    <Text style={{ fontSize: 13, padding: 4, textAlign: "left" }}>{moment(log.dateCreated).format('ddd MMM Do YYYY, h:mm a')}</Text></View>
                <TouchableOpacity style={styles.deleteLogButtons} onPress={() => this.setState({ editlogmodal: true, editlog: log.log, position: id, logselected: log }, () => { ReactNativeHaptic.generate('selection'); Platform.OS === "ios" ? this.editloginput.focus() : setTimeout(() => this.editloginput.focus(), 10) })}><Icon name="file-document-edit-outline" color="#ffffff" size={20} /></TouchableOpacity>
            </View>
            )
        }))
        return (
            <View>
                <Modal animationType="fade" transparent={true} visible={this.state.logmodal}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#00000080', paddingTop: 25 }} onStartShouldSetResponder={() => this.loginput.blur()}>
                        <View style={[styles.cardView, { margin: 10, width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').height * 0.56 }]}>
                            <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "400", padding: 5, margin: 5 }}>Add New Log</Text>
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: this.state.textinputheight <= Dimensions.get('window').height * 0.25 ? Math.max(50, this.state.textinputheight) : Dimensions.get('window').height * 0.25, paddingLeft: 8, paddingRight: 8 }}
                                placeholder="" value={this.state.log} ref={(input) => { this.loginput = input }} onFocus={() => this.loginput.focus()}
                                onChangeText={(log) => this.setState({ log })} multiline={true} onBlur={() => { Keyboard.dismiss() }} blurOnSubmit={false}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 8 }]} onPress={() => { ReactNativeHaptic.generate('selection'); this.setState({ log: "", logmodal: false }) }}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 8 }]} onPress={() => this.addLog()}>
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
                            <TextInput style={{ borderColor: "#CCCCCC", borderWidth: 1, margin: 10, borderRadius: 15, textAlign: "left", fontSize: loginButtonText, height: this.state.textinputheight <= Dimensions.get('window').height * 0.25 ? Math.max(50, this.state.textinputheight) : Dimensions.get('window').height * 0.25, paddingLeft: 8, paddingRight: 8 }}
                                value={this.state.editlog} ref={(input) => { this.editloginput = input }} onFocus={() => this.editloginput.focus()}
                                onChangeText={(editlog) => this.setState({ editlog })} multiline={true} onBlur={() => { Keyboard.dismiss() }} blurOnSubmit={false}
                                onContentSizeChange={(event) => { this.setState({ textinputheight: event.nativeEvent.contentSize.height }) }} />
                            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 8, backgroundColor: "#AE0000", borderColor: "#AE0000" }]} onPress={() => { this.confirmDelete(this.state.logselected) }}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 8 }]} onPress={() => { ReactNativeHaptic.generate('selection'); this.setState({ editlog: "", editlogmodal: false }) }}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buzzbutton, { margin: 8 }]} onPress={() => this.editLog(this.state.position)}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 20, textAlign: "center" }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal >
                <ScrollView ref={(ref) => { this.scrolltop = ref }}>
                    <View style={{ backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 }}><View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                        <View style={styles.hiddenLogButton}><Text style={{ color: "#e0f2f1", fontSize: 28, textAlign: "center" }}>+</Text></View>
                        <Text style={{ fontSize: 28, padding: 10 }}>Logs</Text>
                        <TouchableOpacity style={styles.addLogButton} onPress={() => this.setState({ logmodal: true }, () => { ReactNativeHaptic.generate('selection'); Platform.OS === "ios" ? this.loginput.focus() : setTimeout(() => this.loginput.focus(), 10) })}><Text style={styles.logbuttonText}>+</Text></TouchableOpacity>
                    </View>
                        {this.state.logs && eachlog !== undefined && <View>{eachlog}</View>}
                    </View>
                </ScrollView >
            </View >
        );
    }
}

export default LogScreen;