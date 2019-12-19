import { StyleSheet, Platform } from "react-native"
import { addButtonSize } from "./Variables"

var amount = Platform.OS === 'android' ? 10 : 0

const styles = StyleSheet.create({
    dropShadow: Platform.OS === "ios" ? { shadowColor: 'black', shadowOpacity: 0.5, shadowOffset: { width: 2, height: 2 } } : { elevation: amount },
    dropShadow1: Platform.OS === "ios" ? { shadowOpacity: 0.35, shadowOffset: { width: 4, height: 4 }, shadowColor: "#000000", shadowRadius: 3 } : { elevation: amount },
    dropShadow2: Platform.OS === "ios" ? { opacity: 0.8, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 5 }, shadowColor: "#000000", shadowRadius: 3 } : { opacity: 0.85, elevation: amount },
    dropShadow3: Platform.OS === "ios" ? { shadowColor: 'black', shadowOpacity: 0.5, shadowOffset: { width: 2, height: 2 } } : { elevation: 0 },
    buzzheaderButton: {
        height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50, margin: 5
    },
    largebuzzheaderButton: {
        height: 90, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50, margin: 5
    },
    largeplusminusButton: {
        height: 90, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b',
        borderRadius: 50, margin: 5
    },
    largeselectedPlusMinusButton: {
        height: 90, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: "#1de9b6", borderRadius: 50, margin: 5
    },
    hiddenlargeplusminusButton: {
        height: 90, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: "#e0f2f1",
        borderRadius: 50, margin: 5
    },
    profilebreakbutton: {
        borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 10, marginTop: 15, marginRight: 90,
        marginLeft: 90, marginBottom: 10, borderRadius: 15
    },
    profilebutton: {
        borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 10, marginTop: 10, marginRight: 70,
        marginLeft: 70, marginBottom: 10, borderRadius: 15
    },
    bac: {
        borderRadius: 15, borderStyle: "solid", borderColor: "teal", borderWidth: 2, padding: 10, marginTop: 10, marginBottom: 5,
        marginLeft: 60, marginRight: 60
    },
    smallbac: {
        borderRadius: 15, borderStyle: "solid", borderColor: "teal", borderWidth: 2, padding: 10, marginTop: 0, marginBottom: 0,
        marginLeft: 60, marginRight: 60
    },
    optimalbac: {
        borderRadius: 15, borderStyle: "solid", borderColor: "teal", borderWidth: 2, padding: 10, marginTop: 10, marginBottom: 5,
        marginLeft: 5, marginRight: 5
    },
    smalloptimalbac: {
        borderRadius: 15, borderStyle: "solid", borderColor: "teal", borderWidth: 2, padding: 10, marginTop: 0, marginBottom: 0,
        marginLeft: 5, marginRight: 5
    },
    addButton: {
        borderRadius: 50, backgroundColor: "#1de9b6", height: 100, width: 100, margin: 5, alignItems: 'center',
        justifyContent: 'center'
    },
    smallAddButton: {
        borderRadius: 50, backgroundColor: "#1de9b6", height: 70, width: 70, margin: 5, alignItems: 'center',
        justifyContent: 'center'
    },
    largeAddButton: {
        borderRadius: 100, backgroundColor: "#1de9b6", height: 200, width: 200, margin: 5, alignItems: 'center',
        justifyContent: 'center'
    },
    xlargeAddButton: {
        borderRadius: 150, backgroundColor: "#1de9b6", height: 250, width: 250, margin: 5, alignItems: 'center',
        justifyContent: 'center'
    },
    smallUndoButton: {
        height: 50, width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50
    },
    largeUndoButton: {
        height: 100, width: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50
    },
    plusMinusButtons: {
        height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', borderRadius: 50
    },
    selectedPlusMinusButton: {
        height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: "#1de9b6", borderRadius: 50
    },
    multiSwitchViews: {
        opacity: Platform.OS === 'android' ? 0.9 : 0.8, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 5 },
        shadowColor: "#000000", shadowRadius: 3
    },
    undoButton: {
        height: 50, width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50, margin: 5
    },
    infoButton: {
        height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginLeft: 15,
        borderRadius: 50, padding: 2
    },
    logButton: {
        height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginRight: 15,
        borderRadius: 50, padding: 2
    },
    largeinfoButton: {
        height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginLeft: 25,
        borderRadius: 50, padding: 2
    },
    largelogButton: {
        height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', marginRight: 25,
        borderRadius: 50, padding: 2
    },
    buzzbutton: {
        borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: addButtonSize === "tablet" ? 10 : 0, marginBottom: addButtonSize === "tablet" ? 10 : 0
    },
    profileSetting: {
        backgroundColor: "#00897b", borderRadius: 50, padding: 5, marginLeft: 12, marginRight: 12
    },
    button: {
        borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 10, margin: 10, borderRadius: 15
    },
    numberofshots: {
        borderRadius: 15, borderStyle: "solid", borderColor: "teal", borderWidth: 2, padding: 10, marginRight: 40
    },
    addLogButton: {
        height: 55, width: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', borderRadius: 50
    },
    hiddenLogButton: {
        height: 55, width: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: "#e0f2f1", borderRadius: 50
    },
    deleteLogButtons: {
        height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00897b', margin: 10, borderRadius: 50
    },
    warningCard: {
        borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 10, margin: 4, marginRight: 100, marginLeft: 100, borderRadius: 15
    },
    profileSettingHidden: { backgroundColor: "#e0f2f1", borderRadius: 50, padding: 5, marginLeft: 12, marginRight: 12 },
    dangerOkButton: { borderWidth: 1, borderColor: "#AE0000", backgroundColor: "#AE0000", padding: 15, margin: 5, borderRadius: 15 },
    warnOkButton: { borderWidth: 1, borderColor: "#f9a825", backgroundColor: "#f9a825", padding: 15, margin: 5, borderRadius: 15 },
    profileCards: { backgroundColor: "#e0f2f1", borderRadius: 15, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10 },
    profileCardText: { textAlign: "center", padding: 5, marginLeft: 5, marginRight: 5 },
    profileSettingTextHidden: { color: "#e0f2f1", textAlign: "center", paddingLeft: 5, paddingRight: 5 },
    profileSettingText: { color: "#FFFFFF", textAlign: "center", paddingLeft: 5, paddingRight: 5 },
    modal1Card: { backgroundColor: "#ffff8d", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, marginBottom: 8, padding: 8 },
    modal2Card: { backgroundColor: "#ff5252", borderRadius: 15, marginTop: 25, marginLeft: 8, marginRight: 8, marginBottom: 8, padding: 8 },
    profileLine: { textAlign: "center", color: "#bdbdbd", paddingBottom: 10 },
    proNumericText: { color: "#000000", fontSize: 15, textAlign: "center", padding: 5 },
    largeproNumericText: { color: "#000000", fontSize: 30, textAlign: "center", padding: 5 },
    buzzCard: { flexDirection: "column", backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 },
    buzzView: { flexDirection: "row", justifyContent: "space-evenly", margin: 10 },
    buzzMap: { flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 },
    scrollCard: { backgroundColor: "#e0f2f1", borderRadius: 15, margin: 10, padding: 10 },
    breakDateText: { fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" },
    plusMinusView: { flexDirection: "row", justifyContent: "center", padding: 5 },
    modalTextTitle: { fontSize: 22, textAlign: "center", padding: 8, fontWeight: "bold" },
    modalTextBody: { fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" },
    modalTextAdvice: { fontSize: 18, textAlign: "center", padding: 8 },
    spaceAroundView: { flexDirection: "row", justifyContent: "space-around" },
    endView: { flexDirection: "row", justifyContent: "flex-end" },
    centerView: { flexDirection: "row", justifyContent: "space-around" },
    buzzInfo: { backgroundColor: "#e0f2f1", borderRadius: 15, marginBottom: 10, marginLeft: 10, marginRight: 10, padding: 10 },
    buzzbuttonText: { color: "#FFFFFF", fontSize: 18, textAlign: "center" },
    logincontainer: { flex: 1 },
    loginheader: { textAlign: "center", margin: 10 },
    logininputContainer: { paddingTop: 15 },
    logintextInput: { color: "#000000", borderColor: "#CCCCCC", borderWidth: 1, height: 50, paddingLeft: 20, paddingRight: 20, borderRadius: 15, textAlign: "center" },
    logindisagreeButton: { borderWidth: 1, borderColor: "#AE0000", backgroundColor: "#AE0000", padding: 15, margin: 5, borderRadius: 15 },
    loginbuttonText: { color: "#FFFFFF", textAlign: "center" },
    loginbutton: { borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 15, margin: 5, borderRadius: 15 },
    profilebuttonText: { color: "#FFFFFF", fontSize: 18, textAlign: "center" },
    buttonText: { color: "#FFFFFF", fontSize: 18, textAlign: "center" },
    largeButtonText: { color: "#FFFFFF", fontSize: 50, textAlign: "center" },
    multiSwitch: { backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: "lightgrey", justifyContent: 'space-between' },
    cardView: { backgroundColor: "#e0f2f1", borderRadius: 15, marginRight: 10, marginLeft: 10, marginBottom: 10, padding: 10 },
    infoText: { color: "#000000", fontSize: 15, textAlign: "center", padding: 10 },
    infoTitle: { color: "#000000", fontSize: 30, textAlign: "center", padding: 15 },
    infoList: { color: "#000000", fontSize: 15, textAlign: "center", padding: 1 },
    largeInfoText: { color: "#000000", fontSize: 30, textAlign: "center", padding: 20 },
    largeInfoTitle: { color: "#000000", fontSize: 50, textAlign: "center", padding: 25 },
    largeInfoList: { color: "#000000", fontSize: 30, textAlign: "center", padding: 3 },
    pacerbutton: { borderWidth: 1, borderColor: "#00897b", backgroundColor: "#00897b", padding: 15, margin: 5, borderRadius: 15 },
    selectedpacerbutton: { borderWidth: 1, borderColor: "#1de9b6", backgroundColor: "#1de9b6", padding: 15, margin: 5, borderRadius: 15 },
    buzzLog: { backgroundColor: "#b2dfdb", margin: 5, padding: 5, borderRadius: 15 },
    logbuttonText: { color: "#FFFFFF", fontSize: 28, textAlign: "center" }
})

export default styles;