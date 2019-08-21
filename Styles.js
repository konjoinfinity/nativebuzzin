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
    }
})

export default styles;