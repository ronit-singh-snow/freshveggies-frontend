import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginPage from "../Screens/LoginPage.js";
import { Signup } from "../Screens/Signup.js";
import { Welcome } from "../Screens/Welcome.js";
import { ForgotPassword } from "../Screens/ForgotPassword.js";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
            />
            <Stack.Screen
                name="Login"
                component={LoginPage}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
            />
        </Stack.Navigator>
    );
}