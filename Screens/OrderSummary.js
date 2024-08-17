import { useContext } from "react"
import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import { RadioButton } from "react-native-paper"
import { AppContext } from "../Services/AppContextProvider"
import { useRoute } from "@react-navigation/native"

export const OrderSummary = ({ navigation }) => {
    const { authData, getCart, getSelectedAddress } = useContext(AppContext);
    const route = useRoute();
    const {items, itemValue, address, date, timeslot} = route.params;
    console.log(items, itemValue, address, date, timeslot);
    return (<View style={styles.container}>
        <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.paymentMethodText}>Payment method</Text>
                <View style={[styles.cardBackground, styles.row]}>
                    <Image style={styles.imageContainer} source={require("../assets/images/cash_on_delivery.png")} />
                    <Text>Cash on delivery</Text>
                    <View style={styles.radioButton}>
                        <RadioButton status="checked" />
                    </View>
                </View>

                <View style={styles.cardBackground}>
                    <Text>Other payment methods are coming soon!!!</Text>
                </View>
            </View>
        </View>
        <View>
            <Pressable onPress={() => navigation.navigate("OrderConfirmation")}>
                <Text style={styles.orderNow}>Order now</Text>
            </Pressable>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
        flex: 1
    },
    imageContainer: {
        width: 24,
        height: 24
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    totalValue: {
        flexDirection: "row",
        fontWeight: "bold",
        justifyContent: "space-between",
        fontWeight: 22
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    paymentMethodText: {
        fontWeight: "bold",
        fontSize: 20
    },
    orderNow: {
        backgroundColor: "#32cd32",
        padding: 10,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "bold",
        color: "#FFF"
    },
    radioButton: {
        marginLeft: "auto"
    }
})