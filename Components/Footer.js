import { Pressable, StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Services/AppContextProvider";
import { useContext } from "react";

import { cartItemsAndValue } from "../Services/Utils";

const styles = StyleSheet.create({
    footer: {
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#345f22"
    },
    displayRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceDetail: {
        fontWeight: "bold",
        fontSize: 20
    },
    textStyle: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    },
    buttonStyle: {
        color: "#FFF",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 18,
        fontWeight: "bold"
    }
})

export const Footer = () => {
    const navigation = useNavigation();
    const {getCart} = useContext(AppContext);
    const cartItems = getCart();
    let cartDetails = cartItemsAndValue(cartItems);

    if (cartDetails.count === 0)
        return null;
    return (
        <View style={[styles.footer, styles.displayRow]}>
            <Text style={styles.textStyle}>{cartDetails.count} items | RS. {cartDetails.totalPrice}</Text>
            <Pressable onPress={() => navigation.navigate("CartSummary")}>
                <Text style={styles.buttonStyle}>View cart</Text>
            </Pressable>
        </View>
    )
}