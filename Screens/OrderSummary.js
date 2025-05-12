import { useContext, useState } from "react"
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacityBase } from "react-native"
import { RadioButton } from "react-native-paper"
import { AppContext } from "../Services/AppContextProvider"
import { useRoute } from "@react-navigation/native"
import { DatabaseService } from "../Services/Appwrite/DatabaseService"
import { PriceValue } from "../Components/PriceValue";
import Toast from "react-native-root-toast"
import { startRazorpayPaymentProcessing } from "../Services/Utils"

export const OrderSummary = ({ navigation }) => {
    const { authData, clearCart, envVariables } = useContext(AppContext);

    const [paymentMethod, setPaymentMethod] = useState("cod");

    const route = useRoute();
    const { items, itemValue, address, date, timeslot, couponCode, discountValue, GST } = route.params;

    const orderData = {
        date: date + '',
        status: "placed",
        orderCreate: new Date().getTime() + '',
        timeslot: timeslot,
        address: address,
        totalPrice: itemValue.grandTotalPrice,
        coupon: couponCode,
        discount: discountValue,
        itemPrice: itemValue.totalPrice,
        items: items.map((item) => ({
            productId: item.item.$id,
            quantity: item.quantity,
        }))
    };


    const submitOrderRecord = (updatedOrderData) => {
        var databaseService = new DatabaseService();
        databaseService.submitOrder(authData.user_token, updatedOrderData).then(response => {
            Toast.show("Order Submitted successfully!!", Toast.durations.LONG);
            clearCart();
            navigation.navigate("OrderConfirmation", {
                orderId: response.$id,
                orderStatus: "confirmed"
            });
        }).catch((error) => {
            console.log("Failed while submitting order", error);
            Toast.show("Error occurred while submitting the order, please try again!");
        });
    }

    return (<View style={styles.container}>
        <View style={{ flex: 1 }}>
            <View style={styles.cardBackground}>
                <Text style={styles.billdetails}>Bill details</Text>

                <View style={styles.summaryKeyMap}>
                    <Text>Items total</Text>
                    <PriceValue price={itemValue.totalPrice} />
                </View>
                <View style={styles.summaryKeyMap}>
                    <Text>Discount</Text>
                    <PriceValue price={discountValue} />
                </View>
                <View style={styles.summaryKeyMap}>
                    <Text>GST</Text>
                    <PriceValue price={GST} />

                </View>
                <View style={styles.separator} />

                <View style={styles.summaryKeyMap}>
                    <Text style={styles.boldText}>Grand total </Text>
                    <PriceValue price={itemValue.grandTotalPrice} style={styles.boldText} />
                </View>
            </View>
        </View>

        <View>
            <Text style={styles.paymentMethodText}>Payment method</Text>
            <View style={[styles.cardBackground, styles.row]}>
                <Image style={styles.imageContainer} source={require("../assets/images/cash_on_delivery.png")} />
                <Text>Cash on delivery</Text>
                <View style={styles.radioButton}>
                    <RadioButton status={paymentMethod === "cod" ? "checked" : "unchecked"} onPress={() => setPaymentMethod("cod")} />
                </View>
            </View>

            <View style={{ alignSelf: "center" }}>
                <View style={styles.circle}>
                    <Text style={styles.orText}>OR</Text>
                </View>
            </View>

            <View style={[styles.cardBackground, styles.row]}>
                <Image style={styles.imageContainer} source={require("../assets/images/card.png")} />
                <Text>Debit Cart/Credit Card/UPI</Text>
                <View style={styles.radioButton}>
                    <RadioButton status={paymentMethod !== "cod" ? "checked" : "unchecked"} onPress={setPaymentMethod} />
                </View>
            </View>
        </View>

        <View>
            <Pressable onPress={() => {
                if (paymentMethod == "cod") {
                    submitOrderRecord(orderData);
                } else {
                    startRazorpayPaymentProcessing(orderData, envVariables, authData).then(paymentData => {
                        Toast.show("Payment successful", Toast.durations.LONG);

                        const databaseService = new DatabaseService();
                        let updatedOrderData = {
                            ...orderData,
                            razorpay_payment_id: paymentData.razorpay_payment_id,
                            razorpay_order_id: paymentData.razorpay_order_id,
                            razorpay_signature: paymentData.razorpay_signature
                        }

                        submitOrderRecord(updatedOrderData)
                    }).catch(err => {
                        console.log(err);
                        Toast.show("Payment unsuccessful", Toast.durations.LONG);
                    })
                }
            }}>
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
        width: 48,
        height: 48
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
    billdetails: {
        fontWeight: "bold",
        fontSize: 18
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
    },
    summaryKeyMap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        marginHorizontal: 10
    },
    boldText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
})