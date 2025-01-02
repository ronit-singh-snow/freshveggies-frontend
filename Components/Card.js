import { Image } from 'expo-image';
import { useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import AddQuantity from './AddQuantity';
import { findAddedCartItem, getFontSize } from '../Services/Utils';
import { AppContext } from '../Services/AppContextProvider';
import { PriceValue } from './PriceValue';


const { width: screenWidth } = Dimensions.get('window');

const getBannerContent = (item) => {
    const {img} = item;
    return (
        <View>
            {img ? <Image style={styles.bannerImage} source={img} contentFit="cover" transition={1000} /> : null}
        </View>
    )
}

const getCardContent = (item, addToCart, cartItems, removeFromCart) => {
    const {title, img, unitPrice, unit} = item;
    let initialQuantity = findAddedCartItem(cartItems, item.$id);

    return (
        <View style={{alignItems: "center"}}>
            {img ? <Image style={styles.image} source={img} contentFit="cover" transition={1000} /> : null}
            <View style={{justifyContent: "space-between", alignItems: "center", flexGrow: 2}}>
                <Text style={{ color: "#000", fontWeight: "bold", fontSize: getFontSize(15) }}> {title}</Text>
                <View style={{...styles.smMargin, marginBottom: 10, flexDirection: "row", alignItems: "center"}}>
                    <Text>{unit} / </Text>
                    <PriceValue price={unitPrice} />
                </View>
            
                <AddQuantity stock={5} initialQuantity={initialQuantity} onQuantityChange={(quantity) => {
                    quantity === 0 ? removeFromCart(item.$id) : addToCart(item, quantity);
                }} />
            </View>
            
        </View>
    )
}

export default function Card({ item, clickHandler }) {
    const {addToCart, getCart, removeFromCart} = useContext(AppContext);
    const {cardWidthRatio, bgColorCode} = item;
    const width = cardWidthRatio ? (screenWidth/cardWidthRatio - 24) : (screenWidth -24);
    const bgColor = bgColorCode ? bgColorCode : "#FFF";
    const cartItems = getCart();
    

    return (
        <TouchableOpacity 
            style={{...styles.container, width, backgroundColor: bgColor}}
            onPress={() => clickHandler(item)}>
                {item.type == "banner" ? getBannerContent(item) : getCardContent(item, addToCart, cartItems, removeFromCart)}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
        gap: 10,
        width: (screenWidth/2 - 24),
        height: 200,
        margin: 12,
        elevation: 3,
        shadowOffset: {
            width: 1,
            height: 1
        }
    },
    smMargin: {
        marginTop: 5
    },
    image: {
        width: 64,
        height: 64,
        textAlign: "center"
    },
    bannerImage: {
        flex: 1,
        width: (screenWidth - 24),
        height: 200,
        resizeMode: 'stretch'
    }

});