// import * as SecureStore from "expo-secure-store";
import { PixelRatio } from "react-native";
import { HOST_URL } from "../Constants.js";
import { submitOrder } from "./FetchData.js";
import * as Location from "expo-location";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const getResourceURL = (resource) => {
    return `${HOST_URL}${resource}`;
}

export const formatFruits = (data) => {
    return data.map((d) => {
        d.title = d.name;
        d.unitPrice = parseInt(d.unitPrice);
        d.unitValue = 1000;
        d.cardWidthRatio = 2;
        d.img = { uri: d.image_path };
        d.bgColorCode = d.color_hex_code;
        return d;
    })
}

export const findAddedCartItem = (cartItems, id) => {
    const itemIndex = cartItems.findIndex((item) => item.item.$id == id);
    if (itemIndex >= 0) {
        return cartItems[itemIndex].quantity
    }
    return 0;
}

export const cartItemsAndValue = (cartItems) => {
    let count = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        count++;
        totalPrice += item.item.unitPrice * item.quantity;
    })

    return {
        count,
        totalPrice
    }
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const getDeliveryDates = () => {
    let dates = [];
    let currentDate = new Date();
    if (isTimeSlotDisabled(20)) {
        currentDate = currentDate.addDays(1);
    }
    for (let i = 0; i < 4; i++) {
        let nextDate = currentDate.addDays(i);
        dates.push({
            day: DAYS[nextDate.getDay()],
            date: nextDate.getDate(),
            dateObj: new Date(nextDate)
        });
    }

    return dates;
}

export const isTimeSlotDisabled = (deliveryDate, hour) => {
    let currentTime = new Date();
    let slotEndTime = new Date(deliveryDate);
    slotEndTime.setHours(hour);
    slotEndTime.setMinutes(0);
    slotEndTime.setSeconds(0);
    slotEndTime.setMilliseconds(0);

    return slotEndTime.getTime() < currentTime.getTime();
}

export const formatDateToLocaleDateTime = (milliseconds) => {
    if (typeof milliseconds === "string")
        milliseconds = parseInt(milliseconds);
    console.log(milliseconds);
    const date = new Date(milliseconds);
    return date.toLocaleString();
}

export const getGSTAmount = (cartItems) => {
    return cartItems.reduce((acc, item) => {
        const itemGST = item.item.GST;
        if (itemGST > 0) {
            acc += (item.item.unitPrice * item.quantity * itemGST) / 100;
        }
        return acc;
    }, 0);
}

export const getFontSize = (size) => {
    return Math.ceil(size/PixelRatio.getFontScale());
}

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Toast.show("please grant location access", Toast.durations.SHORT);
                reject("Please grant location access");
                return;
            }
    
            let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            
            let result = {};
            result.latitude = latitude;
            result.longitude = longitude;
    
            const response = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (response.length > 0) {
                result.formattedAddress = response[0].formattedAddress;
            }
    
            resolve(result);
        }
        getPermissions();
    });
}