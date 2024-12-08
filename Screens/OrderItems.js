import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { PriceValue } from "../Components/PriceValue";
import AddQuantity from "../Components/AddQuantity";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
// import { getOrderItems } from "../Services/FetchData";
import { formatFruits } from "../Services/Utils";
import { DatabaseService } from "../Services/Appwrite/DatabaseService"

export const OrderItems = () => {
    const route = useRoute();
    const [orderItems, setOrderItems] = useState([])
    useEffect(() => {
        const databaseService = new DatabaseService();
        databaseService.getOrderItems(route.params?.orderId).then(response => {
            setOrderItems(formatFruits(response));
        })
    }, [route.params?.orderId]);

    return <ScrollView>
        {orderItems.map((item, index) => {
            return <View style={[styles.container, styles.cardBackground]} key={index}>
                <Image style={styles.image} source={item.img} contentFit="cover" transition={1000} />
                <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.unit}>{item.unit}</Text>
                    <PriceValue price={item.unitPrice} />
                </View>
                <View style={styles.listActions}>
                    <Text style={styles.quantity}>&times; {item.quantity}</Text>
                </View>
            </View>
        })}
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 15,
        gap: 15,
        alignItems: "center"
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    image: {
        width: 64,
        height: 64
    },
    title: {
        fontWeight: "bold"
    },
    listActions: {
        marginLeft: "auto",
        alignItems: "flex-end",
    },
    quantity: {
        fontSize: 16,
        fontWeight: "bold"
    }
})