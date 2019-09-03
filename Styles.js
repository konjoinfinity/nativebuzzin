import { StyleSheet, Platform } from "react-native"

var amount = Platform.OS === 'android' ? 10 : 0
var undoTrash = Platform.OS === 'android' ? 40 : 0

const styles = StyleSheet.create({
    buzzbutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        borderRadius: 15
    },
    buzzbuttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: "center"
    },
    buzzheaderButton: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 5,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        elevation: amount
    },
    logincontainer: {
        flex: 1
    },
    loginheader: {
        textAlign: "center",
        margin: 10
    },
    logininputContainer: {
        paddingTop: 15
    },
    logintextInput: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 15,
        textAlign: "center"
    },
    logindisagreeButton: {
        borderWidth: 1,
        borderColor: "#AE0000",
        backgroundColor: "#AE0000",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    loginbuttonText: {
        color: "#FFFFFF",
        textAlign: "center"
    },
    loginbutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    profilebreakbutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        marginTop: 15,
        marginRight: 90,
        marginLeft: 90,
        marginBottom: 10,
        borderRadius: 15
    },
    profilebutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        marginTop: 10,
        marginRight: 70,
        marginLeft: 70,
        marginBottom: 10,
        borderRadius: 15
    },
    profilebuttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: "center"
    },
    button: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 10,
        margin: 10,
        borderRadius: 15
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center"
    },
    bac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 60,
        marginRight: 60,
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        elevation: amount
    },
    smallbac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 60,
        marginRight: 60,
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        elevation: amount
    },
    optimalbac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        elevation: amount
    },
    smalloptimalbac: {
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "teal",
        borderWidth: 2,
        padding: 10,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 5,
        marginRight: 5,
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        elevation: amount
    },
    addButton: {
        borderRadius: 50,
        backgroundColor: "#1de9b6",
        opacity: 0.8,
        height: 100,
        width: 100,
        margin: 10,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: amount
    },
    smallAddButton: {
        borderRadius: 50,
        backgroundColor: "#1de9b6",
        opacity: 0.8,
        height: 70,
        width: 70,
        margin: 5,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: amount
    },
    smallUndoButton: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        elevation: undoTrash
    },
    plusMinusButtons: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00897b',
        borderRadius: 50,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        elevation: amount
    },
    selectedPlusMinusButton: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1de9b6",
        borderRadius: 50,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        elevation: amount
    },
    multiSwitch: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "lightgrey",
        justifyContent: 'space-between'
    },
    cardView: {
        backgroundColor: "#e0f2f1",
        borderRadius: 15,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        padding: 10
    },
    multiSwitchViews: {
        opacity: 0.8,
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowColor: "#000000",
        shadowRadius: 3,
        elevation: amount
    },
    undoButton: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.7)',
        borderRadius: 50,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        elevation: undoTrash
    },
    dangerOkButton: {
        borderWidth: 1,
        borderColor: "#AE0000",
        backgroundColor: "#AE0000",
        padding: 15,
        margin: 5,
        borderRadius: 15
    },
    warnOkButton: {
        borderWidth: 1,
        borderColor: "#f9a825",
        backgroundColor: "#f9a825",
        padding: 15,
        margin: 5,
        borderRadius: 15
    }
})

export default styles;