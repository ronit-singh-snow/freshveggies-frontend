import { createContext, useContext, useEffect, useState } from "react"
import { FIREBASE_AUTH } from "./Firebase";
import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { insertUser } from "./FetchData";

export const AppContext = createContext({});

export const AppContextProvider = ({children}) => {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authData, setAuthData] = useState();
    const [selectedAddress, setUserSelectedAddress] = useState();

    const setToken = async (user, phoneNumber, loginType) => {
        const number = user?.phoneNumber || phoneNumber;
        const storeData = [];
        user.uid ? storeData.push(["user_token", user.uid]) : null;
        user.email ? storeData.push(["email", user.email]) : null;
        number ? storeData.push(["phone_number", number]) : null;
        loginType ? storeData.push(["login_type", loginType]) : null;

        return await AsyncStorage.multiSet(storeData);
    }

    const getToken = async () => {
        const val = await AsyncStorage.multiGet(["user_token", "email", "phone_number", "selected_address"]);
        const serialiseAsyncData = val.reduce((acc, item) => {
            acc[item[0]] = item[1];
            return acc;
        }, {});

        val.forEach(storageItem => {
            if (storageItem[0] == "selected_address") {
                setUserSelectedAddress(JSON.parse(storageItem[1]));
            }
        })

        setAuthData(serialiseAsyncData);
    }

    const setAddressToAsyncStorage = async (addr) => {
        return await AsyncStorage.setItem("selected_address", JSON.stringify(addr));
    }

    const removeToken = () => {
        AsyncStorage.clear();
    }

    useEffect(() => {
        getToken();
    }, [])

    const signIn = async (userCredential, phoneNumber, loginType) => { 
        const user = userCredential.user;
        setToken(user, phoneNumber, loginType);
        const _authData = {
            user_token: user.uid,
            email: user?.email,
            loginType,
            phoneNumber
        }
        setAuthData(_authData);
    };

    const signOut = async () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);
        removeToken();
    };

    const signUp = (email, password, name, mobile) => {
        createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            setToken(user);
            const _authData = {
                user_token: user.refreshToken,
                email: user.email
            }
            setAuthData(_authData);
            updateProfile(user, {
                displayName: name,
                phoneNumber: mobile,
                email: email
            });

            insertUser(email, name, mobile);
        })
        .catch((error) => {
            console.log("Creation failed " + error);
        });
    }

    const addToCart = (item, quantity) => {
        let cart = [...cartData];
        let findItem = cart.find((cartItem) => cartItem.item.id === item.id);
        if (findItem) {
            findItem.quantity = quantity;
            setCartData(cart);
        } else {
            cart.push({
                item, quantity
            });

            setCartData(cart);
        }
    }

    const clearCart = () => {
        setCartData([]);
    }

    const removeFromCart = (itemId) => {
        let cart = [...cartData];
        let itemIndex = cart.findIndex((cartItem) => cartItem.item.id === itemId);
        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
        }
        setCartData(cart);
    }

    const getCart = () => {
        return cartData;
    }

    const getSelectedAddress = () => {
        return selectedAddress;
    }

    const setSelectedAddress = (addr) => {
        setUserSelectedAddress(addr);
        setAddressToAsyncStorage(addr);
    }

    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <AppContext.Provider value={{authData, loading, signIn, signOut, signUp, getToken, cartData, addToCart, clearCart, removeFromCart, getCart, getSelectedAddress, setSelectedAddress}}>
            {children}
        </AppContext.Provider>
    );
}

export function appContext() {
    const context = useContext(AppContext);
  
    if (!context) {
      throw new Error('appContext must be used within an AuthProvider');
    }
  
    return context;
}
