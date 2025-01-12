import axios from "axios";
import { APPWRITE_END_POINT } from "../Constants";
import { DatabaseService } from "./Appwrite/DatabaseService";
import { findUser } from "../Services/AppWriteServices";

export const autocompletePlaces = (location, radius = 5000, searchText, apiKey) => {
    const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText"
    };
    const body = {
        "input": searchText,
        "locationBias": {
            "circle": {
                "center": {
                    "latitude": location.latitude,
                    "longitude": location.longitude
                },
                "radius": radius
            }
        }
    }
    return axios.post("https://places.googleapis.com/v1/places:autocomplete", body, {headers});
}

export const fetchEnvironmentVariables = () => {
    const url = APPWRITE_END_POINT + "/api_keys";
    return axios.get(url);
}

export const fetchCoupons = async () => {
    try {
        const databaseService = new DatabaseService();
        const fetchedCoupons = await databaseService.getAllCoupons();    
        if (Array.isArray(fetchedCoupons)) {
            return fetchedCoupons; 
        } else {
            console.error("Fetched coupons is not an array.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return [];
    }
};


export const deleteAccount = async (userId) => {
    try {
        const userResponse = await findUser(userId); 
        if (userResponse && userResponse.data && Array.isArray(userResponse.data) && userResponse.data.length > 0) {
            const user = userResponse.data[0]; 
            const email = user.email || ""; 
            const phone = user.phone || ""; 

            if (email || phone) {
                const url = APPWRITE_END_POINT + "/delete_account";
            
                const body = {
                    email: email,  
                    phone: phone   
                };
                return  await axios.delete(url, { data: body });

            } else {
                console.log("Neither email nor phone is available for deletion");
            }
        } else {
            console.log("User not found or invalid response structure");
        }
    } catch (err) {
        console.error("Error in deleting account:", err);
    }
};


export const validateCoupon = (userId, couponCode, cartPrice) => {
    try {
        const url = APPWRITE_END_POINT + "/validate_coupon";
        const body = {
            userID: userId,
            couponCode,
            totalCartValue: cartPrice
        };
        return axios.post(url, body);
    } catch(err) {
        console.log(err)
    }
}