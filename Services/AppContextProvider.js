import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteSession } from "./AppWriteServices";
import { DatabaseService } from "./Appwrite/DatabaseService";
import { fetchEnvironmentVariables } from "./FetchData";
export const AppContext = createContext({});

export const AppContextProvider = ({children}) => {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authData, setAuthData] = useState();
    const [selectedAddress, setUserSelectedAddress] = useState();
    const [userDetails, setUserDetails] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [envVariables, setEnvVariables] = useState({});

    const setToken = async (userId, phoneNumber, loginType, name, email) => {
        const storeData = [];
        userId ? storeData.push(["user_token", userId]) : null;
        phoneNumber ? storeData.push(["phone_number", phoneNumber]) : null;
        loginType ? storeData.push(["login_type", loginType]) : null;
        name ? storeData.push(["name", name]) : null;
        email ? storeData.push(["email", email]) : null;
        userDetails ? storeData.push(["user_details", JSON.stringify(userDetails)]) : null;
        console.log("Setting AsyncStorage data:", storeData);
        return await AsyncStorage.multiSet(storeData);
    }

    const getToken = async () => {
        const val = await AsyncStorage.multiGet(["user_token", "email", "phone_number", "selected_address", "name","user_details"]);
       
        const serialiseAsyncData = val.reduce((acc, item) => {
            acc[item[0]] = item[1];
            return acc;
        }, {});
        console.log("Fetched token data:", serialiseAsyncData);
        val.forEach(storageItem => {
            if (storageItem[0] == "selected_address") {
                setUserSelectedAddress(JSON.parse(storageItem[1]));
            }
        })
        
        setAuthData(serialiseAsyncData);
        setLoading(false);
    }

    const setAddressToAsyncStorage = async (addr) => {
        return await AsyncStorage.setItem("selected_address", JSON.stringify(addr));
    }

    const removeToken = () => {
        AsyncStorage.clear();
    }

    useEffect(() => {
        getToken();
        fetchEnvironmentVariables().then((response) => {
            console.log(response.data);
            setEnvVariables(response.data);
        })
    }, [])

    const signIn = async (userId, phoneNumber, loginType, name, userDetails, email) => { 
        setToken(userId, phoneNumber, loginType, name, userDetails, email);
        const _authData = {
            user_token: userId,
            loginType,
            phone_number: phoneNumber,
            name,
            email,
        }
        console.log("Signing in with data:", _authData);
        setAuthData(_authData);
        setUserDetails(userDetails);
    };

    const signOut = async () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);
        setUserDetails(null);
        removeToken();
        deleteSession()
    };

    const signUp = (email, password, name, mobile) => {
    }

    const addToCart = (item, quantity) => {
        let cart = [...cartData];
        let findItem = cart.find((cartItem) => cartItem.item.$id === item.$id);
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
        let itemIndex = cart.findIndex((cartItem) => cartItem.item.$id === itemId);
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

    
    
    
    
    // console.log("userDetails in context: ", userDetails);
    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <AppContext.Provider value={
            {
                authData,
                loading,
                signIn,
                signOut,
                signUp,
                getToken,
                cartData,
                addToCart,
                clearCart,
                removeFromCart,
                getCart,
                getSelectedAddress,
                setSelectedAddress,
                addresses,
                setAddresses,
                setUserDetails,
                userDetails,
                envVariables
            }
        }>
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