import { StyleSheet, TextInput, View, ImageBackground, Text } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import { CustomButton } from '../Components/CustomButton';
import { colors } from '../Styles';
import { getFontSize } from '../Services/Utils';
import { deleteExistingSession, sendOTP } from '../Services/AppWriteServices';
import Toast from 'react-native-root-toast';

export default function LoginPage({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState();
    const [loading, setLoading] = useState(false);
    const bgImage = require("../assets/images/background.png");
    const countryImage = require("../assets/images/india.png");
    
    return (
        <ImageBackground source={bgImage} style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.loginContainer}>
                    <Text style={styles.enterNumberText}>Enter your mobile number</Text>
                    <Text style={styles.textLightColor}>We will send you a confirmation code</Text>
                    <View style={styles.countryInput}>
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
                            onChangeText={(val) => {
                                setPhoneNumber(`+91${val}`)
                            }}
                        />
                    </View>
                    <CustomButton
                        title={"Send"}
                        loading={loading}
                        onPress={async () => {
                            setLoading(true);
                            await deleteExistingSession();
                            sendOTP(phoneNumber).then(res => {
                                navigation.navigate("OtpVerification", {
                                    phoneNumber: phoneNumber,
                                    userId: res.userId
                                });
                            }).catch(err => {
                                Toast.show("Error while sending OTP", Toast.durations.SHORT);
                            }).finally(() => {
                                setLoading(false);
                            });
                        }}
                    />
                </View>
            </View>
        </ImageBackground>
    )
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
    countryInput: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        width: "100%",
        marginTop: 20,
        borderColor: colors.darkGreen
    },
    textLink: {
        color: colors.textLink
    },
    countryCode: {
        padding: 8,
        borderRightWidth: 1,
        borderColor: colors.darkGreen
    },
    signInInput: {
        borderRadius: 20,
        paddingHorizontal: 15,
        borderColor: colors.darkGreen,
        // fontWeight: "bold"
    },
    signInButton: {
        backgroundColor: colors.darkGreen,
        marginTop: 30,
        paddingVertical: 9,
        borderRadius: 10,
        color: "#FFF",
        textAlign: "center",
        fontSize: getFontSize(18),
        width: "100%"
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
