import { Image } from 'expo-image';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Pressable } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import AddQuantity from "../Components/AddQuantity.js";
import { getTotalValue, findAddedCartItem, handleOnQuantityChange } from "../Services/Utils.js";
import { Footer } from '../Components/Footer.js';

import { AppContext } from "../Services/AppContextProvider.js";

const FruitDetails = ({ navigation }) => {
    const { addToCart, getCart, removeFromCart } = useContext(AppContext);
    const cartItems = getCart();
    const route = useRoute();
    const item = route.params?.item;
    useEffect(() => {
        navigation.setOptions({
            title: item.title
        });
    }, [navigation, item]);

    return (
        <View style={styles.container}>
            <ScrollView style={{ ...styles.body }}>
                <View style={{ ...styles.imageContainer, backgroundColor: item.bgColorCode }}>
                    <Image style={styles.fruitImage} source={item.img} contentFit="cover" transition={1000}></Image>
                </View>
                <View style={{ ...styles.details }}>
                    <Text style={styles.name}>{item.title}</Text>
                    <View style={[styles.displayRow, styles.alignBottm]}>
                        <View>
                            <Text style={styles.unitValue}>{item.unit}</Text>
                            <Text style={styles.unitPrice}>Rs. {item.unitPrice}</Text>
                        </View>
                        <AddQuantity stock={5} initialQuantity={findAddedCartItem(cartItems, item.$id)} onQuantityChange={(quantity) => {
                            quantity === 0 ? removeFromCart(item.$id) : addToCart(item, quantity);
                        }} />
                    </View>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.descriptionTitle}>Benefits</Text>
                    <Text style={styles.description}>{item.benefits}</Text>
                </View>
            </ScrollView>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        
        flexDirection: "column"
    },
    footer: {
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    name: {
        fontSize: 22,
        fontWeight: "bold"
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 65
    },
    description: {
        fontSize: 16,
        textAlign: "justify"
    },
    details: {
        backgroundColor: "#FFF",
        paddingVertical: 25,
        paddingHorizontal: 15
    },
    fruitImage: {
        width: 200,
        height: 200
    },
    quantityWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    displayRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },
    alignBottm: {
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    pillButton: {
        backgroundColor: "#FFBF34",
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 10,
        width: 200,
        borderColor: "#4caf50"
    },
    textStyle: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    },
    priceDetail: {
        fontWeight: "bold",
        fontSize: 20
    },
    unitValue: {

    },
    unitPrice: {
        marginTop: 8,
        backgroundColor: "#dbdfe3",
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontWeight: "bold",
        borderRadius: 10
    }
});

export default FruitDetails;