import { StyleSheet, TextInput, View, ImageBackground, TouchableOpacity, Text, Pressable } from 'react-native';
import auth from "@react-native-firebase/auth";
import { useContext, useRef, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { Image } from 'expo-image';
import { insertUser } from '../Services/FetchData';
import Loader from '../Components/Loader';

export default function LoginPage({navigation}) {
    const [phoneNumber, setPhoneNumber] = useState();
    const [confirmationResult, setconfirmationResult] = useState();
    const [fetchingOtp, setFetchingOtp] = useState(true);
    const [fetchingConfirmation, setFetchingConfirmation] = useState(false);
    const [extraDetails, setExtraDetails] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [otp, setOtp] = useState([]);
    const [userCredential, setUserCredential] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useContext(AppContext);
    const bgImage = require("../assets/images/background.png");
    const countryImage = require("../assets/images/india.png");
    const itemRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]

    const signInWithPhone = async () => {
        setFetchingOtp(true);
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setIsLoading(false);
        setFetchingOtp(false);
        setFetchingConfirmation(true);
        setconfirmationResult(confirmation);
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
                        const newOtp = otp.slice(0, i) + text + otp.slice(i + 1);
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
                        }
                    }}
                    value={otp[i] || ''}
                />
            );
        }
        return inputs;
    };

    return (
        <ImageBackground source={bgImage} style={{ flex: 1 }}>
           {isLoading ? <Loader /> : null}
            {!extraDetails ?
                <View style={styles.container}>
                    {
                        fetchingOtp ? <View style={styles.loginContainer}>
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
                                    placeholder='Enter phone number'
                                    onChangeText={(val) => {
                                        setPhoneNumber(`+91${val}`)
                                    }} />
                            </View>
                            <TouchableOpacity style={{width: "100%"}} onPress={async () => {
                                setIsLoading(true);
                                signInWithPhone(phoneNumber);
                            }}>
                                <Text style={styles.signInButton}>Send</Text>
                            </TouchableOpacity>
                        </View>
                            : null
                    }
                    {
                        fetchingConfirmation ? <View style={styles.loginContainer}>
                            <Text style={styles.enterNumberText}>Enter verification code</Text>
                            <Text style={[styles.textLightColor, styles.headerDescription]}>6 digit verification code is sent to your mobile number {phoneNumber}</Text>
                            <View style={styles.otpContainer}>
                                {renderInputs()}
                            </View>
                            <TouchableOpacity style={{width: "100%"}} onPress={async () => {
                                setIsLoading(true);
                                const userCred = await confirmationResult.confirm(otp);
                                setIsLoading(false);

                                setFetchingConfirmation(false);
                        
                                if (userCred.additionalUserInfo.isNewUser) {
                                    setUserCredential(userCred);
                                    setExtraDetails(true);
                                } else {
                                    signIn(userCred, phoneNumber, "phone");
                                }
                            }}>
                                <Text style={styles.signInButton}>Verify</Text>
                            </TouchableOpacity>
                            
                            <View style={styles.resendContainer}>
                                <Text style={styles.textLightColor}>Did not receive the OTP?</Text>
                                <Text style={styles.textLink}>Resend OTP</Text>
                            </View>

                            <View style={styles.changeNumber}>
                                <Text>OR</Text>
                                <Pressable onPress={() => {
                                    setFetchingOtp(true);
                                    setFetchingConfirmation(false);
                                    setExtraDetails(false);
                                }}>
                                    <Text style={styles.textLink}>Change number</Text>
                                </Pressable>
                            </View>
                        </View>
                            : null
                    }

                </View>
            : null}
            {extraDetails ? 
                <View style={styles.container}>
                    <TextInput 
                        style={styles.textinput}
                        placeholder='Enter your full name'
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.textinput}
                        placeholder='Enter your email address'
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity onPress={() => {
                        insertUser(email, name, phoneNumber).then((response) => {
                            console.log(response);
                            signIn(userCredential, phoneNumber, "phone", email);
                            setExtraDetails(false);
                        })
                    }}>
                        <Text style={styles.signInButton}>Submit</Text>
                    </TouchableOpacity>
                </View>
            : null}
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
    welcome: {
        textAlign: "center",
        fontSize: 20,
        marginBottom: 20
    },
    textLightColor: {
        color: "#3e4740b8"
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
        marginTop: 20
    },
    textLink: {
        color: "#0000FF"
    },
    countryCode: {
        padding: 8,
        borderRightWidth: 1
    },
    signInInput: {
        borderRadius: 20,
        paddingHorizontal: 15
    },
    signInButton: {
        backgroundColor: "#345f22",
        marginTop: 30,
        paddingVertical: 9,
        borderRadius: 10,
        color: "#FFF",
        textAlign: "center",
        fontSize: 18,
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
        // backgroundColor: '#c6e5c7',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 16,
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
        fontSize: 22
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
