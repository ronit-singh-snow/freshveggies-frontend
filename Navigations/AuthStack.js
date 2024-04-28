import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginPage from "../Screens/LoginPage.js";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginPage}
            />
        </Stack.Navigator>
    );
}