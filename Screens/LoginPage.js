import { StyleSheet, TextInput, View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { CustomButton } from '../Components/CustomButton';
import { colors } from '../Styles';
import { getFontSize } from '../Services/Utils';
import Toast from 'react-native-root-toast';
import { AuthService } from '../Services/Appwrite/AuthService';
import { LoginWithEmail } from '../Components/LoginWithEmail';
import { LoginWithPhone } from '../Components/LoginWithPhone';

export default function LoginPage({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPhone, setIsPhone] = useState(true);
    const bgImage = require("../assets/images/background.png");

    const handleSendOTP = async () => {
        setLoading(true);
        let userId;
        try {
            const auth = new AuthService();
            await auth.deleteSessions();
            if (isPhone) {
                userId = await auth.sendPhoneToken(phoneNumber);
            }
            else {
                userId = await auth.sendEmailToken(email);
            }
            navigation.navigate("OtpVerification", {
                [isPhone ? 'phoneNumber' : 'email']: isPhone ? phoneNumber : email,
                userId: userId,
                loginType: isPhone ? "phone" : "email",
                phoneNumber,
                email,
            });

        } catch (error) {
            console.error("Error sending OTP:", error);
            Toast.show("Failed to send OTP. Try again.", { duration: Toast.durations.LONG });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={bgImage} style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.loginContainer}>
                    {isPhone ? (
                        <LoginWithPhone />
                    ) : (
                       <LoginWithEmail />
                    )}
                    <TouchableOpacity onPress={() => setIsPhone(!isPhone)} style={styles.switchOptionContainer}>
                        <Text style={styles.switchOption}>
                            {isPhone ? 'Login with Email ID' : 'Login with Phone Number'}
                        </Text>
                    </TouchableOpacity>
                    {/* <CustomButton
                        title={"Send"}
                        loading={loading}
                        disabled={isPhone ? !phoneNumber : !email || loading}
                        onPress={handleSendOTP}
                    /> */}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 40,
        marginTop: 150
    },
    textLightColor: {
        color: "#3e4740b8",
        fontSize: getFontSize(14)
    },
    headerDescription: {
        textAlign: "center",
        width: "90%"
    },
    textinput: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15
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
    textLink: {
        color: colors.textLink
    },
    switchOption: {
        color: colors.textLink,
        textAlign: 'right',
        alignSelf: "flex-end",
        marginTop: 10,
    },
    switchOptionContainer: {
        alignItems: "flex-end",
        flexDirection: "column",
        width: "100%"
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
    forgotPassword: {
        alignSelf: "flex-end",
        color: "#696969"
    },
    image: {
        width: 32,
        height: 32
    },
    otpInput: {
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: getFontSize(16),
        borderColor: "#2b582c",
        borderWidth: 1
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20
    },
    enterNumberText: {
        fontWeight: "400",
        fontSize: getFontSize(22),
        color: colors.darkGreen
    },
    loginContainer: {
        textAlign: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: '100%'
    },
    resendContainer: {
        flexDirection: "row",
        marginTop: 20,
        gap: 10
    },
    changeNumber: {
        width: "100%",
        alignItems: "center",
        marginTop: 25,
        gap: 20
    }
});
