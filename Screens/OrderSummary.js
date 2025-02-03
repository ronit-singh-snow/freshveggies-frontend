import { useContext } from "react"
import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import { RadioButton } from "react-native-paper"
import { AppContext } from "../Services/AppContextProvider"
import { useRoute } from "@react-navigation/native"
import {DatabaseService} from "../Services/Appwrite/DatabaseService"
import { PriceValue } from "../Components/PriceValue";

export const OrderSummary = ({ navigation }) => {
    const { authData, clearCart } = useContext(AppContext);
   
    const route = useRoute();
    const {items, itemValue, address, date, timeslot, couponCode, discountValue, GST} = route.params;
   
    const orderData = {
        date: date + '',
        status: "placed",
        orderCreate:  new Date().getTime() + '',
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
        <View style={styles.cardBackground }>
        <Text style={styles.billdetails}>Bill details</Text>

        <View style={styles.summaryKeyMap}>
                        <Text>Items total</Text>
                        <PriceValue price={itemValue.totalPrice} />
                        </View>
                    <View style={styles.summaryKeyMap}>
                        <Text>Discount</Text>
                        <PriceValue price={discountValue}/>
                    </View>
                    <View style={styles.summaryKeyMap}>
                        <Text>GST</Text>
                        <PriceValue price={GST}/>

                    </View>
                    <View style={styles.separator} />

                    <View style={styles.summaryKeyMap}>
                        <Text style={styles.boldText}>Grand total </Text>
                        <PriceValue  price={itemValue.grandTotalPrice} style={styles.boldText}/>
                    </View>
              </View>
        </View>
        <View>
            <Pressable onPress={() => {
                const databaseService = new DatabaseService();
                databaseService.submitOrder(authData.user_token, orderData).then(response => {
                    clearCart();
                    navigation.navigate("OrderConfirmation", {
                        orderId: response.$id
                    });
                }).catch((error) => {
                    console.log("Failed while submitting order",error);
                });  
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
    billdetails:{
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
    
})