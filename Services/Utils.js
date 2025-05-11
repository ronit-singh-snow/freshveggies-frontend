import { PixelRatio } from "react-native";
import * as Location from "expo-location";
import { getRazorpayOrderId } from "./FetchData";
import RazorpayCheckout from "react-native-razorpay";
import Toast from "react-native-root-toast";
import { DatabaseService } from "./Appwrite/DatabaseService";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatFruits = (data) => {
    return data.map((d) => {
        d.title = d.name;
        d.unitPrice = parseInt(d.unit_price);
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
        return cartItems[itemIndex].quantity;
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
    
    if (isTimeSlotDisabled(currentDate, 20)) {
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

export const startRazorpayPaymentProcessing = (orderData, envVariables, authData) => {
    let promise = new Promise((resolve, reject) => {
        getRazorpayOrderId(orderData.totalPrice, envVariables).then(razorpayOrder => {
            if (razorpayOrder && razorpayOrder.data && razorpayOrder.data.id) {
                var options = {
                    description: 'Thanks for using V-GRAM Cart services',
                    image: require("../assets/icon.png"),
                    currency: 'INR',
                    key: envVariables.RAZORPAY_KEY_ID,
                    amount: orderData.totalPrice * 100,
                    name: 'V-GRAM CART',
                    order_id: razorpayOrder.data.id,//Replace this with an order_id created using Orders API.
                    prefill: {
                        email: authData.email,
                        contact: authData.phone_number,
                        name: authData.name
                    },
                    theme: { color: '#53a20e' }
                }
                RazorpayCheckout.open(options).then((data) => {
                    console.log(`Success: ${data.razorpay_payment_id}`);
                    resolve(data);
                }).catch((error) => {
                    // handle failure
                    console.log("error while opening the checkout screen");
                    reject(`Error: ${error.code} | ${error.description}`);
                });
            }
        }).catch(err => {
            console.log(err);
            reject("error while getting the order id");
        });
    });

    return promise;
}