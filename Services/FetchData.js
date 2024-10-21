import axios from "axios";
import { GOOGLE_API_KEY, HOST_URL } from "../Constants";

export const getBannerImage = (imageName) => {
    const resourceId = "banner_images";
    const url = `${HOST_URL}/static/images/` + imageName;
    return axios.get("https://api.foursquare.com/v3/autocomplete");
}

export const getProducts = (category, subCategory, extraConditions, limit) => {
    return axios.post(`${HOST_URL}/prodcts`, {
        category: category,
        subcategory: subCategory,
        extra_query: extraConditions,
        limit: limit
    });
}

export const homepageDetails = () => {
    return axios.get(`${HOST_URL}/homepage`);
}

export const getFruitById = (fruitId) => {
    return axios.get(`${HOST_URL}/fruit/${fruitId}`);
}

export const getProductsList = (searchText) => {
    searchText = searchText ? searchText : '';
    return axios.get(`${HOST_URL}/getsearchlist?search_text=${searchText}`);
}

export const getAddresses = (phoneNo, id) => {
    return axios.get(`${HOST_URL}/getuseraddresses?phone_number=${phoneNo}&id=${id}`);
}

export const insertUser = (emailId, name, phoneNumber) => {
    return axios.get(`${HOST_URL}/insertuser?email_id=${emailId}&name=${name}&phone_number=${phoneNumber}`)
}

export const findUser = (value) => {
    return axios.get(`${HOST_URL}/finduser?id=${value}`);
}

export const submitAddress = (address) => {
    return axios.post(`${HOST_URL}/submitaddress`, address);
}

export const submitOrder = (orderDetails) => {
    return axios.post(`${HOST_URL}/submitorder`, orderDetails);
}

export const listOrders = (phoneNumber) => {
    return axios.get(`${HOST_URL}/listorders?phone_number=${phoneNumber}`);
}

export const deleteRecord = (table, id, columnName) => {
    return axios.delete(`${HOST_URL}/delete_resource/${table}/${id}/${columnName}`);
}

export const getOrderItems = (orderId) => {
    return axios.get(`${HOST_URL}/order_items?order_id=${orderId}`);
}

export const searchNearbyPlaces = (location, radius = 5000, searchText) => {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_API_KEY}&location=${location.latitude},${location.longitude}&radius=${radius}&keyword=${searchText}`
    // console.log(url);
    const response =  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_API_KEY}&location=${location.latitude},${location.longitude}&radius=5000&keyword=${searchText}`).then(res => {
        console.log(response)
        response.json().then(data => {
            console.log(data.results)
        });
    });
    
   
    return axios.get(url);
}