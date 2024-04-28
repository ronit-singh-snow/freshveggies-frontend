import { useContext } from "react"
import { AppContext } from "../Services/AppContextProvider";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import AddQuantity from "../Components/AddQuantity";

export default function CartSummary() {
    const {getCart} = useContext(AppContext);
    return (<FlatList data={getCart()} renderItem={({item}) => {
        return <View style={styles.container}>
            <Image style={styles.image} source={item.item.img} contentFit="cover" transition={1000} />
            <View>
                <Text style={styles.title}>{item.item.title}</Text>
                <Text style={styles.unit}>{item.item.unit}</Text>
                <Text style={styles.unitPrice}>{item.item.unitPrice}</Text>
            </View>
            <View style={styles.listActions}>
                <Text>Delte</Text>
                <AddQuantity initialQuantity={item.quantity} />
            </View>
        </View>
    }} />)
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        gap: 15,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "gray"
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
    }
});