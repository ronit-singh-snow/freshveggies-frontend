import { useRoute } from '@react-navigation/native';
import { StyleSheet, FlatList, Text, Button, View, Image, Pressable } from 'react-native';
import AddQuantity from '../Components/AddQuantity';
import { Footer } from '../Components/Footer';
import { AppContext } from '../Services/AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { findAddedCartItem } from '../Services/Utils';
import { PriceValue } from '../Components/PriceValue';
import { listOrders } from '../Services/FetchData';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        padding: 20,
        margin: 10,
        gap: 5
    },
    image: {
        width: 64,
        height: 64
    },
    title: {
        fontWeight: "bold"
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        borderWidth: 1
    },
    unitPrice: {
        fontWeight: "bold"
    },
    price: {
        flexDirection: "row"
    },
    active: {
        backgroundColor: "#24ca4f",
        color: "#FFF"
    },
    delivered: {
        backgroundColor: "#dbdfe3"
    },
    highlightedText: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignSelf: "flex-start",
        fontWeight: "600"
    }
});

export default function OrdersList({ navigation }) {
    const { authData } = useContext(AppContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        listOrders(authData.phone_number).then(res => {
            setOrders(res.data);
        });
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={({ item }) => {
                    return <Pressable style={[styles.row, styles.cardBackground]} >
                        <Text style={styles.title}>Order ID: {item.idorder}</Text>
                        {item.order_date ? <Text style={styles.unit}>{item.order_date}</Text> : null}
                        <View style={styles.price}>
                            <Text>Total value: </Text>
                            <PriceValue price={item.total_price} />
                        </View>
                        {item.status === "delivered"
                            ? <Text style={[styles.delivered, styles.highlightedText]}>Delivered</Text>
                            : <Text style={[styles.active, styles.highlightedText]}>{item.status}</Text>
                        }
                    </Pressable>
                }}
            />
        </View>
    );
}

