import React from 'react';
import { StyleSheet, View } from "react-native"
import { ActivityIndicator } from "react-native-paper"

export default function Loader({bgColor}) {
    return <View style={styles.container}>
        <ActivityIndicator />
    </View>
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "#636262",
        opacity: .5,
        alignItems: "center",
        justifyContent: "center"
    }
})