import axios from "axios";
import { HOST_URL } from "../Constants";

export const getBannerImage = (imageName) => {
    const resourceId = "banner_images";
    const url = `${HOST_URL}/static/images/` + imageName;
    return axios.get("https://api.foursquare.com/v3/autocomplete");
}

export const getFruits = () => {
    return axios.get(`${HOST_URL}/fruits`);
}

export const getVegetables = () => {
    return axios.get(`${HOST_URL}/vegetables`);
}

export const getFruitById = (fruitId) => {
    return axios.get(`${HOST_URL}/fruit/${fruitId}`);
}

export const getProductsList = (searchText) => {
    searchText = searchText ? searchText : '';
    return axios.get(`${HOST_URL}/getsearchlist?search_text=${searchText}`);
}

export const getAddresses = (emailId) => {
    return axios.get(`${HOST_URL}/getuseraddresses/${emailId}`);
}

export const insertUser = (emailId, name, phoneNumber) => {
    return axios.get(`${HOST_URL}/insertuser?email_id=${emailId}&name=${name}&phone_number=${phoneNumber}`)
}

export const findUser = (emailId) => {
    return axios.get(`${HOST_URL}/finduser?email_id=${emailId}`);
}

export const submitAddress = (address) => {
    return axios.post(`${HOST_URL}/submitaddress`, address);
}

export const submitOrder = (orderDetails) => {
    return axios.post(`${HOST_URL}/submitorder`, orderDetails);
}

export const listOrders = (emailId) => {
    return axios.get(`${HOST_URL}/listorders?email_id=${emailId}`);
}