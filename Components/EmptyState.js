import { Image, StyleSheet, Text, View } from "react-native"

export const EmptyState = ({message}) => {
    const emptyBox = require("../assets/images/empty_box.png");
    return (
        <View style={styles.container}>
            <Image source={emptyBox} width="128" height="128" />
            <Text style={styles.emptyStateMessage}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyStateMessage: {
        fontSize: 28
    }
})