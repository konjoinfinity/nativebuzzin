import { StyleSheet } from "react-native"

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
        fontSize: 22,
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
        }
    },
    logincontainer: {
        flex: 1
    },
    loginheader: {
        fontSize: 30,
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
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 15,
        textAlign: "center"
    },
    loginloginButton: {
        borderWidth: 1,
        borderColor: "#80cbc4",
        backgroundColor: "#80cbc4",
        padding: 15,
        margin: 5,
        borderRadius: 15
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
        fontSize: 20,
        textAlign: "center"
    },
    loginbutton: {
        borderWidth: 1,
        borderColor: "#00897b",
        backgroundColor: "#00897b",
        padding: 15,
        margin: 5,
        borderRadius: 15
    }
})

export default styles;