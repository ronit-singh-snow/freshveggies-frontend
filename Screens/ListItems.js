import { useRoute } from '@react-navigation/native';
import { StyleSheet, FlatList, Text, Button, View, Image, Pressable } from 'react-native';
import AddQuantity from '../Components/AddQuantity';
import { Footer } from '../Components/Footer';
import { AppContext } from '../Services/AppContextProvider';
import { useContext, useEffect } from 'react';
import { findAddedCartItem } from '../Services/Utils';
import { PriceValue } from '../Components/PriceValue';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        padding: 10,
        gap: 15,
        alignItems: "center",
        flexDirection: "row"
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
        alignItems: "flex-end"
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    unitPrice: {
        fontWeight: "bold"
    }
});

export default function ListItems({ navigation }) {
    const route = useRoute();
    const dataItems = route.params?.dataItems;
    const title = route.params?.title;
    const { addToCart, getCart, removeFromCart } = useContext(AppContext);
    const cartItems = getCart();

    useEffect(() => {
        navigation.setOptions({
            title: title
        })
    }, [navigation, title])

    return (
        <View style={styles.container}>
            <FlatList
                data={dataItems}
                renderItem={({ item }) => {
                    return <Pressable style={[styles.row, styles.cardBackground]} onPress={() => navigation.navigate("FruitDetails", {
                        item
                    })}>
                        <Image style={styles.image} source={item.img} contentFit="cover" transition={1000} />
                        <View>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.unit}>{item.unit}</Text>
                            <PriceValue price={item.unitPrice} />
                        </View>
                        <View style={styles.listActions}>
                            <AddQuantity stock={5} initialQuantity={findAddedCartItem(cartItems, item.id)} onQuantityChange={(quantity) => {
                                quantity === 0 ? removeFromCart(item.id) : addToCart(item, quantity);
                            }} />
                        </View>
                    </Pressable>
                }}
            />
            <Footer />
        </View>
    );
}

