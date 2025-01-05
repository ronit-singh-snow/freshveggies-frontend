import { StyleSheet, TextInput, View, ImageBackground, Text, Pressable } from 'react-native';

import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { CustomButton } from '../Components/CustomButton';
import { useRoute } from '@react-navigation/native';
import Timer from '../Components/Timer';
import { sendOTP } from '../Services/AppWriteServices';
import { getFontSize } from '../Services/Utils';
import { AuthService } from '../Services/Appwrite/AuthService';

export default function OtpVerification({ navigation }) {
    const route = useRoute();
    const loginType = route.params?.loginType;
    const phoneNumber = route.params?.phoneNumber;
    const email = route.params?.email;
    
    const { signIn } = useContext(AppContext);

    const [otp, setOtp] = useState(new Array(6));
    const [timerActive, setTimerActive] = useState(true);
    const [userId, setUserId] = useState(route.params?.userId);
    const [loading, setLoading] = useState();

    const bgImage = require("../assets/images/background.png");
    const itemRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]

    const signInWithPhone = async () => {
        sendOTP(phoneNumber).then(res => {
            setUserId(res.userId);
        });
    }


    const renderInputs = () => {
        const inputs = [];
        for (let i = 0; i < 6; i++) {
            inputs.push(
                <TextInput
                    key={i}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={itemRefs[i]}
                    onChangeText={(text) => {
                        const newOtp = [...otp];
                        newOtp[i] = text;
                        setOtp(newOtp);
                        if (text !== '') {
                            const nextInput = itemRefs[i + 1];
                            if (nextInput && nextInput.current) {
                                nextInput.current.focus();
                            }
                        }
                    }}
                    onKeyPress={(event) => {
                        
                        if (event.nativeEvent.key === 'Backspace' && otp.length === 0) {
                            return false;
                        } else if (event.nativeEvent.key === 'Backspace') {
                            const previousInput = itemRefs[i - 1];
                            if (previousInput && previousInput.current) {
                                previousInput.current.focus();
                            }
                        } else {
                            if(otp[i]) {
                                const nextInput = itemRefs[i + 1];
                                if (nextInput && nextInput.current) {
                                    nextInput.current.focus();
                                }
                            }
                        }
                    }}
                    value={otp[i] || ''}
                />
            );
        }
        return inputs;
    };

    useEffect(() => {
        setTimeout(() => {
            setTimerActive(false);
        }, 15*60*1000);
    }, [])

    return (
        <ImageBackground source={bgImage} style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.loginContainer}>
                    <Text style={styles.enterNumberText}>Enter verification code</Text>
                    <Text style={[styles.textLightColor, styles.headerDescription]}>
                    {email ? 
                            `6 digit verification code is sent to your email: ${email}` : 
                            `6 digit verification code is sent to your mobile number: ${phoneNumber}`}                        </Text>
                    <View style={styles.otpContainer}>
                        {renderInputs()}
                    </View>
                   
                    <CustomButton 
                        title={"Verify"}
                        disabled={otp.length != 6 || loading}
                        loading={loading}
                        onPress={() => {
                            setLoading(true);
                            const authService = new AuthService();
                            authService.confirmOTPAndCreateSession(userId, otp.join("")).then(userData => {
                                
                                if(userData?.name) {
                                    signIn(userId, phoneNumber, "phone", userData.name);
                                } else {
                                    navigation.navigate("NewLoginExtraDetails", {
                                        phoneNumber: phoneNumber,
                                        userId: userId,
                                        loginType: loginType,
                                    });
                                }    
                            }).catch(err => {
                                console.log(err);
                            }).finally(() => setLoading(false));
                        }}
                    />
                    

                    <View style={styles.resendContainer}>
                        <Text style={[styles.textLightColor]}>Time remaining</Text>
                        <Timer duration={15*60}/>
                        <Pressable style={[styles.resendButton, timerActive ? styles.resendDisabled : ""]} onPress={() => signInWithPhone()}>
                            <Text style={styles.textLink}>RESEND OTP</Text>
                        </Pressable>
                    </View>

                    <View style={styles.changeNumber}>
                        <Text>OR</Text>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text style={styles.textLink}>Change number</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 40,
        marginTop: 70
    },
    textLightColor: {
        color: "#3e4740b8"
    },
    headerDescription: {
        textAlign: "center",
        width: "100%"
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
        fontSize: getFontSize(22)
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
        gap: 10,
        alignItems: "center",
        width: "100%"
    },
    resendButton: {
        alignSelf: "flex-end",
        marginLeft: "auto"
    },
    resendDisabled: {
        opacity: .5
    },
    changeNumber: {
        width: "100%",
        alignItems: "center",
        marginTop: 25,
        gap: 20
    },
    textLink: {
        color: "#0000FF",
        fontWeight: "bold"
    }
});
