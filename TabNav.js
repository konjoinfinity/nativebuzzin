import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { navigation } from "react-navigation";

class TabNav extends Component {
    render() {
        return (
            <View styles={{ flexDirection: "row", borderColor: 'black', borderWidth: 1 }}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => this.props.navigation.push("Home")}>
                    <View>
                        <Text
                            style={{ fontSize: 30 }}>🏠</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => this.props.navigation.push("Buzz")}>
                    <View>
                        <Text
                            style={{ fontSize: 30 }}>🍺</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => this.props.navigation.push("OldBuzz")}>
                    <View>
                        <Text
                            style={{ fontSize: 30 }}>🐝</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default TabNav;

const styles = StyleSheet.create({
    headerButton: {
        height: 35,
        width: 35,
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
        }
    }
});