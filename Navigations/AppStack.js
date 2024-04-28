import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/Home.js";4
import FruitDetails from "../Screens/FruitDetails.js";
import ListItems from "../Screens/ListItems.js";
import CartSummary from "../Screens/CartSummary.js";

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
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
            />
        </Stack.Navigator>
    );
}