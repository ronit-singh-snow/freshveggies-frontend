import { useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { Image } from 'expo-image';
import { getFontSize } from "../Services/Utils";
import { colors } from "../Styles";
import { CustomButton } from "./CustomButton";
import Toast from "react-native-root-toast";
import { AuthService } from "../Services/Appwrite/AuthService";
import { useNavigation } from "@react-navigation/native";

export const LoginWithPhone = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const countryImage = require("../assets/images/india.png");
    const navigation = useNavigation();

    const handleSendOTP = async () => {
        setLoading(true);
        let userId;
        try {
            const auth = new AuthService();
            await auth.deleteSessions();
            
            userId = await auth.sendPhoneToken(phoneNumber);
            
            navigation.navigate("OtpVerification", {
                phoneNumber: phoneNumber,
                userId: userId,
                loginType: "phone",
                phoneNumber,
            });

        } catch (error) {
            console.error("Error sending OTP:", JSON.stringify(error));
            Toast.show("Failed to send OTP. Try again.", Toast.durations.LONG );
        } finally {
            setLoading(false);
        }
    };

    return <View style={styles.container}>
        <Text style={styles.enterNumberText}>Enter your mobile number</Text>
        <Text style={styles.textLightColor}>We will send you a confirmation code</Text>

        <View style={styles.loginInput}>
            <Image
                style={styles.image}
                source={countryImage}
                contentFit="cover"
                transition={1000}
            />

            <Text style={styles.countryCode}>+91</Text>
            <TextInput
                style={styles.signInInput}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder='Enter phone number'
                onChangeText={(val) => setPhoneNumber(`+91${val}`)}
            />
        </View>
        <CustomButton
            title={"Send"}
            loading={loading}
            disabled={loading}
            onPress={handleSendOTP}
        />
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
        width: "100%",
        marginTop: 20,
        borderColor: colors.darkGreen,
        fontSize: getFontSize(18)
    },
    image: {
        width: 32,
        height: 32
    },
    countryCode: {
        padding: 8,
        borderRightWidth: 1,
        borderColor: colors.darkGreen
    },
    signInInput: {
        flex: 1,
        paddingHorizontal: 15,
        borderColor: colors.darkGreen,
        borderRadius: 10,
        width: "100%",
        fontSize: getFontSize(18),

    },
    textLightColor: {
        color: "#3e4740b8",
        fontSize: getFontSize(14)
    },
})