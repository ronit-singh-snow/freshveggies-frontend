// import * as SecureStore from "expo-secure-store";
import {HOST_URL} from "../Constants.js";

// export const saveToSecureStore = (key, value) => {
//     SecureStore.setItem(key, value);
// }

// export const fetchFromSecureStore = (key, value) => {
//     SecureStore.getItem(key);
// }

export const getResourceURL = (resource) => {
    return `${HOST_URL}${resource}`;
}

export const getTotalValue = (quantityArray, item) => {
    let selectedItem = quantityArray.find((item) => item.isSelected);
    if (!selectedItem)
        return "Rs. " + 0;

    return "Rs. " + (selectedItem.value/item.unitValue) * item.unitPrice;
}

export const formatFruits = (data) => {
    return data.map((d) => {
        d.title = d.name;
        d.unitPrice = parseInt(d.unit_price);
        d.unitValue = 1000;
        d.cardWidthRatio = 2;
        d.img = {uri: getResourceURL(d.image_path)};
        d.bgColorCode = d.color_hex_code;
        return d;
    })
}

export const findAddedCartItem = (cartItems, id) => {
    const itemIndex = cartItems.findIndex((item) => item.item.id == id);
    if(itemIndex >= 0) {
        return cartItems[itemIndex].quantity
    }
    return 0;
}