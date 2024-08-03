import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/Home.js"; 4
import FruitDetails from "../Screens/FruitDetails.js";
import ListItems from "../Screens/ListItems.js";
import CartSummary from "../Screens/CartSummary.js";
import { SearchItem } from "../Screens/SearchItems.js";
import { MyProfile } from "../Screens/MyProfile.js";
import { AddAddress } from "../Screens/AddAddress.js";
import { AddNewAddress } from "../Screens/AddNewAddress.js";
import { OrderSummary } from "../Screens/OrderSummary.js";
import { OrderConfirmation } from "../Screens/OrderConfirmation.js";
import OrdersList from "../Screens/OrdersList.js";

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ title: "Fresh Vegetables and Fruits", headerShown: false }}
            />
            <Stack.Screen
                name="FruitDetails"
                component={FruitDetails}
            />
            <Stack.Screen
                name="ListItems"
                component={ListItems}
            />
            <Stack.Screen
                name="CartSummary"
                component={CartSummary}
                options={{ title: "Cart Summary" }}
            />
            <Stack.Screen
                name="SearchItem"
                component={SearchItem}
                options={{ title: "Search fruits and vegetables" }}
            />
            <Stack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{ title: "My Profile" }}
            />
            <Stack.Screen
                name="AddAddress"
                component={AddAddress}
                options={{title: "My Addresses"}}
            />
            <Stack.Screen
                name="AddNewAddress"
                component={AddNewAddress}
                options={{title: "Add New Address"}}
            />
            <Stack.Screen
                name="OrderSummary"
                component={OrderSummary}
                options={{title: "Order summary"}}
            />
            <Stack.Screen
                name="OrderConfirmation"
                component={OrderConfirmation}
                options={{title: "Order confirmed", headerShown: false}}
            />
            <Stack.Screen
                name="OrdersList"
                component={OrdersList}
                options={{title: "Your orders"}}
            />
        </Stack.Navigator>
    );
}