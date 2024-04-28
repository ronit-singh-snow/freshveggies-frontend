import { Image } from 'expo-image';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Pressable } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import AddQuantity from "../Components/AddQuantity.js";
import { getTotalValue, findAddedCartItem } from "../Services/Utils.js";

import {AppContext} from "../Services/AppContextProvider.js";

const FruitDetails = ({ navigation }) => {
    const {addToCart, getCart} = useContext(AppContext);
    const cartItems = getCart();
    const route = useRoute();
    const item = route.params?.item;
    useEffect(() => {
        navigation.setOptions({
            title: item.title
        });
    }, [navigation, item]);

    const [quantityArray, setQuantityArray] = useState([
        {
            title: "1KG",
            value: 1000,
            isSelected: true,
            id: 1
        },
        {
            title: "2KG",
            value: 2000,
            isSelected: false,
            id: 2
        },
        {
            title: "3KG",
            value: 3000,
            isSelected: false,
            id: 3
        },
        {
            title: "5KG",
            value: 5000,
            isSelected: false,
            id: 4
        }
    ]);

    return (
        <View style={styles.container}>
            <ScrollView style={{ ...styles.body, backgroundColor: item.bgColorCode }}>
                <View style={{ ...styles.imageContainer, flex: 1 }}>
                    <Image style={styles.fruitImage} source={item.img} contentFit="cover" transition={1000}></Image>
                </View>
                <View style={{ ...styles.details, flex: 2 }}>
                    <Text style={styles.name}>{item.title}</Text>
                    <View style={[styles.displayRow, styles.alignBottm]}>
                        <View>
                            <Text style={styles.unitValue}>{item.unit}</Text>
                            <Text style={styles.unitPrice}>Rs. {item.unitPrice}</Text>
                     </View>
                        <AddQuantity stock={5} initialQuantity={findAddedCartItem(cartItems, item.id)} onQuantityChange={(quantity) => {
                            addToCart(item, quantity);
                        }}/>
                    </View>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.descriptionTitle}>Benefits</Text>
                    <Text style={styles.description}>{item.benefits}</Text>
                </View>
            </ScrollView>
            <View style={[styles.footer, styles.displayRow]}>
                <Text style={styles.priceDetail}>{getTotalValue(quantityArray, item)}</Text>
                <Pressable onPress={() => navigation.navigate("CartSummary")} style={styles.pillButton}>
                    <Text style={styles.textStyle}>Buy now</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1
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
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
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