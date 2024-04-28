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