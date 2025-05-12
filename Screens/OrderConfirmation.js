import { BackHandler, Image, Pressable, StyleSheet, Text, View } from "react-native"
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";

export const OrderConfirmation = ({navigation}) => {
    const route = useRoute();
    const orderStatus = route?.params?.orderStatus || "confirmed";

    useEffect(() => {
        const backAction = () => {
            navigation.navigate("Home");
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    return <View style={styles.container}>
        {
            orderStatus === "confirmed"
            ? <Image style={styles.tickIcon} source={require("../assets/images/success_tick_icon.png")} />
            : <Image style={styles.tickIcon} source={require("../assets/images/transport.png")} />
        }
        
        {orderStatus === "confirmed" ? <Text style={styles.confirmationText}>Your order has been confirmed!!</Text> : null}
        {orderStatus === "cancelled" ? <Text style={styles.confirmationText}>Your order has been Cancelled.</Text> : null}

        {orderStatus == "cancelled" ?
            (
                <View width="60%" style={{paddingVertical: 10}}>
                    <Text style={{textAlign: "justify"}}>If you have made the payment already then amount will be refunded within 5-7 working days.</Text>
                </View>
            )
            : null
        }

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