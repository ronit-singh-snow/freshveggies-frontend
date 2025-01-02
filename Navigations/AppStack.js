import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/Home.js"; 4
import FruitDetails from "../Screens/FruitDetails.js";
import ListItems from "../Screens/ListItems.js";
import CartSummary from "../Screens/CartSummary.js";
import { SearchItem } from "../Screens/SearchItems.js";
import { MyProfile } from "../Screens/MyProfile.js";
import { AddAddress } from "../Screens/AddAddress.js";
import { OrderSummary } from "../Screens/OrderSummary.js";
import { OrderConfirmation } from "../Screens/OrderConfirmation.js";
import OrdersList from "../Screens/OrdersList.js";
import { UpdateAddress } from "../Screens/UpdateAddress.js";
import { OrderItems } from "../Screens/OrderItems.js";
import { AboutUs } from "../Screens/AboutUs.js";
// import CouponSelectionScreen from "../Screens/CouponSelectionScreen.js";
import Coupons from "../Screens/Coupons.js";
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
                name="Coupons"
                component={Coupons}
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
            <Stack.Screen
                name="UpdateAddress"
                component={UpdateAddress}
                options={{title: "Enter complete address"}}
            />
            <Stack.Screen
                name="OrderItems"
                component={OrderItems}
                options={{title: "Selected order items"}}
            />
            <Stack.Screen
                name="AboutUs"
                component={AboutUs}
                options={{title: "About Orange Cart"}}
            />
        </Stack.Navigator>
    );
}