import { createContext, useContext, useState } from "react"
import { getResourceURL } from "./Utils";
import axios from "axios";

export const AppContext = createContext({});

export const AppContextProvider = ({children}) => {
    const [authData, setAuthData] = useState({
        token: null,
        userId: null,
        name: null
    });

    const [cartData, setCartData] = useState([]);
    
    const [loading, setLoading] = useState(true);

    const signIn = (userId, password) => {
        //call the service passing credential (email and password).
        //In a real App this data will be provided by the user from some InputText components.
        // axios.post(getResourceURL("/validate_login"), {
        //     userId,
        //     password
        // })
        // .then((response) => {
        //     // saveToSecureStore("isSignedIn", true);
        //     const _authData = {
        //         token: "XYZ",
        //         name: "Rahul Singh",
        //         email: "xyz@gmail.com"
        //     }

        //     //Set the data in the context, so the App can be notified
        //     //and send the user to the AuthStack
        //     setAuthData(_authData);
        // })
        // .catch( (err) => {
        //     console.log(err);
        // });
        
        const _authData = {
            token: "XYZ",
            name: "Rahul Singh",
            email: "xyz@gmail.com"
        }

        //Set the data in the context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(_authData);
    };

    const signOut = async () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);
    };

    const addToCart = (item, quantity) => {
        let cart = [...cartData];
        console.log(cartData);
        let findItem = cart.find((cartItem) => cartItem.item.id === item.id);
        if (findItem) {
            console.log("Found item");
            findItem.quantity = quantity;
            setCartData(cart);
        } else {
            console.log("Did not find item");
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
        let itemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
        }
        
        setCartData(cart);
    }

    const getCart = () => {
        return cartData;
    }

    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <AppContext.Provider value={{authData, loading, signIn, signOut, cartData, addToCart, clearCart, removeFromCart, getCart}}>
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
