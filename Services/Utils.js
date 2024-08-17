// import * as SecureStore from "expo-secure-store";
import { HOST_URL } from "../Constants.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const getResourceURL = (resource) => {
    return `${HOST_URL}${resource}`;
}

export const formatFruits = (data) => {
    return data.map((d) => {
        d.title = d.name;
        d.unitPrice = parseInt(d.unit_price);
        d.unitValue = 1000;
        d.cardWidthRatio = 2;
        d.img = { uri: getResourceURL(d.image_path) };
        d.bgColorCode = d.color_hex_code;
        return d;
    })
}

export const findAddedCartItem = (cartItems, id) => {
    const itemIndex = cartItems.findIndex((item) => item.item.id == id);
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