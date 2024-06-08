import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    currencySymbol: {
        fontWeight: "bold"
    }
})

export const PriceValue = ({price}) => {
    return (<View style={styles.container}>
        <Text style={styles.currencySymbol}>{'\u20B9'}</Text>
        <Text>{price}</Text>
    </View>)
};