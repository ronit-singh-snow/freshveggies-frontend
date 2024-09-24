import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"

export const CustomButton = ({title, loading, extraStyles, onPress, disabled=false}) => {
    return <Pressable onPress={onPress} style={{width: "100%"}} disabled={disabled}>
        <View style={[styles.button, disabled ? styles.disabledButton : ""]}>
            <Text style={styles.title}>{title}</Text>
            {loading ? <ActivityIndicator /> : null}
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: "#FFF"
    }, 
    button: {
        backgroundColor: "#345f22",
        marginTop: 30,
        paddingVertical: 9,
        borderRadius: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 20
    },
    disabledButton: {
        opacity: .5
    }
});