import axios from "axios";
import { APPWRITE_END_POINT, HOST_URL } from "../Constants";
import { DatabaseService } from "./Appwrite/DatabaseService";
import Toast from "react-native-root-toast";

// export const getBannerImage = (imageName) => {
//     const resourceId = "banner_images";
//     const url = `${HOST_URL}/static/images/` + imageName;
//     return axios.get("https://api.foursquare.com/v3/autocomplete");
// }

// export const getProducts = (category, subCategory, extraConditions, limit) => {
//     return axios.post(`${HOST_URL}/prodcts`, {
//         category: category,
//         subcategory: subCategory,
//         extra_query: extraConditions,
//         limit: limit
//     });
// }

// export const homepageDetails = () => {
//     return axios.get(`${HOST_URL}/homepage`);
// }

// export const getFruitById = (fruitId) => {
//     return axios.get(`${HOST_URL}/fruit/${fruitId}`);
// }

// export const getProductsList = (searchText) => {
//     searchText = searchText ? searchText : '';
//     return axios.get(`${HOST_URL}/getsearchlist?search_text=${searchText}`);
// }

// export const getAddresses = (phoneNo, id) => {
//     return axios.get(`${HOST_URL}/getuseraddresses?phone_number=${phoneNo}&id=${id}`);
// }

// export const insertUser = (emailId, name, phoneNumber) => {
//     return axios.get(`${HOST_URL}/insertuser?email_id=${emailId}&name=${name}&phone_number=${phoneNumber}`)
// }

// export const findUser = (value) => {
//     return axios.get(`${HOST_URL}/finduser?id=${value}`);
// }

// export const submitAddress = (address) => {
//     return axios.post(`${HOST_URL}/submitaddress`, address);
// }

// export const submitOrder = (orderDetails) => {
//     return axios.post(`${HOST_URL}/submitorder`, orderDetails);
// }

// export const listOrders = (phoneNumber) => {
//     return axios.get(`${HOST_URL}/listorders?phone_number=${phoneNumber}`);
// }

// export const deleteRecord = (table, id, columnName) => {
//     return axios.delete(`${HOST_URL}/delete_resource/${table}/${id}/${columnName}`);
// }

// export const getOrderItems = (orderId) => {
//     return axios.get(`${HOST_URL}/order_items?order_id=${orderId}`);
// }

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

export const deleteAccount = (userId) => {
    try {
        const url = APPWRITE_END_POINT + "/delete_account";
        const body = {
            userID: userId
        };
        return axios.delete(url, body);
    } catch(err) {
        console.log(err)
    }
}