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
    const [orderItems, setOrderItems] = useState([]);
    const [products, setProducts] = useState({});
    useEffect(() => {
        const databaseService = new DatabaseService();
        databaseService.getOrderItems(route.params?.orderId).then(response => {
            let productIds = [];
            response.forEach(orderItem => productIds.push(orderItem.product_id));
            databaseService.getProducts(`$id=${productIds.join(",")}`).then(productsResponse => {
                if (productsResponse && productsResponse.length > 0) {
                    let formatProducts = formatFruits(productsResponse)
                    let productsMap = formatProducts.reduce((accu, product) => {
                        accu[product.$id] = product;
                        return accu;
                    }, {});

                    setProducts(productsMap);
                    setOrderItems(response);
                }
            });
        });
    }, [route.params?.orderId]);
    
    return <ScrollView>
        {orderItems.map((item, index) => {
            const product = products[item.product_id];
            return <View style={[styles.container, styles.cardBackground]} key={index}>
                <Image style={styles.image} source={product.img} contentFit="cover" transition={1000} />
                <View>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.unit}>{product.unit}</Text>
                    <PriceValue price={product.unitPrice} />
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