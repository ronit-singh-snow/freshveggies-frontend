import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { colors } from "../Styles";
import { getFontSize } from "../Services/Utils";

export const CustomButton = ({title, loading, extraStyles, onPress, disabled=false}) => {
    extraStyles = extraStyles ? extraStyles : {};
    const {buttonStyle, titleStyle} = extraStyles;

    return <Pressable onPress={onPress} style={{width: "100%"}} disabled={disabled || loading}>
        <View style={[styles.button, buttonStyle ? buttonStyle : {}, disabled || loading ? styles.disabledButton : {}]}>
            <Text style={[styles.title, titleStyle ? titleStyle : {}]}>{title}</Text>
            {/* {loading ? <ActivityIndicator color={colors.orange}/> : null} */}
            {loading ? (
    <ActivityIndicator color={colors.orange} />
) : (
    <Text style={[styles.title, titleStyle || {}]}>{title}</Text>
)}

        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    title: {
        fontSize: getFontSize(18),
        color: "#FFF",
        fontWeight: "bold"
    },
    button: {
        backgroundColor: colors.darkGreen,
        marginTop: 10,
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