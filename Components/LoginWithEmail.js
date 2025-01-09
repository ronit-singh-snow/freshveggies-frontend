import { useContext, useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { getFontSize } from "../Services/Utils";
import { colors } from "../Styles";
import { CustomButton } from "./CustomButton";
import Toast from "react-native-root-toast";
import { AuthService } from "../Services/Appwrite/AuthService";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Services/AppContextProvider";
import { Checkbox } from "react-native-paper";

export const LoginWithEmail = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [flow, setFlow] = useState("login");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const {signIn} = useContext(AppContext);

    const handleSendOTP = async () => {
        setLoading(true);
        let userData;
        try {
            const auth = new AuthService();
            await auth.deleteSessions();
            if (flow === "login")
                userData = await auth.signInWithEmail(email, password);
            else {
                userData = await auth.signUpWithEmail(email, password);
                if (userData?.$id || userData?.userId) {
                    Toast.show("Account has been created successfully, Login again with the same credentials.", Toast.durations.LONG);
                    setFlow("login");
                    setEmail("");
                    setPassword("");
                }

                return;
            }

            const userId = userData.userId || userData.$id;
            if(userData?.name) {
                signIn(userId, userData?.phone, "email", userData?.name, email);
            } else {
                navigation.navigate("NewLoginExtraDetails", {
                    phoneNumber: "",
                    userId: userId,
                    loginType: "email",
                    email: email,
                    password: password
                });
            } 

        } catch (error) {
            console.log("Error in signing in", JSON.stringify(error));
            if (error && error.response)
                Toast.show(error.response.message, Toast.durations.LONG );
        } finally {
            setLoading(false);
        }
    };

    return <View style={styles.container}>
        <Text style={styles.boldText}>{flow == "login" ? "Login" : "Sign up"}</Text>
        <Text style={styles.textLightColor}>Enter your email ID and password to connect</Text>
        <TextInput
            style={styles.loginInput}
            value={email}
            keyboardType="email-address"
            placeholder="Enter email ID"
            onChangeText={(val) => setEmail(val)}
        />
        <TextInput
            style={styles.loginInput}
            secureTextEntry={showPassword ? false : true}
            value={password}
            keyboardType="password"
            placeholder="Enter password"
            onChangeText={(val) => setPassword(val)}
        />
        <View style={styles.row}>
            <Checkbox
                status={showPassword ? "checked" : "unchecked"}
                onPress={() => setShowPassword(!showPassword)}
            />
            <Text>Show password</Text>
        </View>
        

        <CustomButton
            title={"Submit"}
            loading={loading}
            disabled={loading}
            onPress={handleSendOTP}
        />

        {flow === "login" ? (<View  style={styles.row}>
            <Text>Don't have an account? </Text>
            <Pressable onPress={() => {
                setFlow("signup");
            }}>
                <Text style={styles.link}>Register here!</Text>
            </Pressable>
        </View>)
        : (<View style={styles.row}>
            <Text>Already a member? </Text>
            <Pressable onPress={() => {
                setFlow("login");
            }}>
                <Text style={styles.link}>Login!</Text>
            </Pressable>
        </View>
        )}
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    enterNumberText: {
        fontWeight: "400",
        fontSize: getFontSize(22),
        color: colors.darkGreen
    },
    loginInput: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: "100%",
        marginTop: 20,
        borderColor: colors.darkGreen,
        fontSize: getFontSize(18)
    },
    boldText: {
        fontWeight: "bold",
        fontSize: getFontSize(28),
        color: colors.darkGreen,
    },
    textLightColor: {
        color: "#3e4740b8",
        fontSize: getFontSize(14)
    },
    row: {
        flexDirection: "row",
        marginVertical: 10,
        alignItems: "center"
    },
    link: {
        color: colors.textLink
    }
})