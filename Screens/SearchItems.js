import { useContext, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { getFruits, getProductsList } from "../Services/FetchData";
import { findAddedCartItem, formatFruits } from "../Services/Utils";
import { PriceValue } from "../Components/PriceValue";
import AddQuantity from "../Components/AddQuantity";
import { AppContext } from "../Services/AppContextProvider";
import { Footer } from "../Components/Footer";
import { useNavigation } from "@react-navigation/native";
import { DatabaseService } from "../Services/Appwrite/DatabaseService";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: "#d3d3d3",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#FFF"
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
    }
});

export const SearchItem = () => {
    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState();
    const [listItems, setListItems] = useState([]);

    const { addToCart, getCart, removeFromCart } = useContext(AppContext);
    const cartItems = getCart();

    
    async function getProducts(searchText) {
        let databaseService = new DatabaseService();
        const products = await databaseService.searchProducts(searchText);
        setListItems(formatFruits(products));
    };

    useEffect(() => {
        getProducts();
    }, [])

    const handleSearch = (text) => {
        setSearchTerm(text);
        getProducts(text);
    }

    return (<View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={searchTerm}
            placeholder="Search Fruits and Vegetables" />
        <FlatList
            data={listItems}
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
                        <AddQuantity stock={5} initialQuantity={findAddedCartItem(cartItems, item.$id)} onQuantityChange={(quantity) => {
                            quantity === 0 ? removeFromCart(item.$id) : addToCart(item, quantity);
                        }} />
                    </View>
                </Pressable>
            }}
        />
        <Footer />
    </View>)
}