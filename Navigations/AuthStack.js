import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginPage from "../Screens/LoginPage.js";
import { Welcome } from "../Screens/Welcome.js";
import { ForgotPassword } from "../Screens/ForgotPassword.js";
import OtpVerification from "../Screens/OTPVerification.js";
import { NewLoginExtraDetails } from "../Screens/NewLoginExtraDetails.js";

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
                name="OtpVerification"
                component={OtpVerification}
            />
            <Stack.Screen
                name="NewLoginExtraDetails"
                component={NewLoginExtraDetails}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
            />
        </Stack.Navigator>
    );
}