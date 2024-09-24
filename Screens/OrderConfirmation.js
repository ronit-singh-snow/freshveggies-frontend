import { useContext, useEffect, useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { AppContext } from "../Services/AppContextProvider"
import { submitOrder } from "../Services/FetchData";
import { useRoute } from "@react-navigation/native";

export const OrderConfirmation = ({navigation}) => {
    const route = useRoute();

    return <View style={styles.container}>
        <Image style={styles.tickIcon} source={require("../assets/images/success_tick_icon.png")} />
        <Text style={styles.confirmationText}>Your order has been confirmed</Text>
        <Text>Order no #{route.params?.orderId}</Text>


        <Pressable onPress={() => navigation.navigate("Home")}>
            <Text style={styles.continueShopping}>Continue shopping</Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    tickIcon: {
        alignSelf: "center",
        width: 100,
        height: 100
    },
    confirmationText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    continueShopping: {
        backgroundColor: "#32cd32",
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: "#FFF",
        borderRadius: 10,
        fontWeight: "bold"
    }
})