import { StyleSheet, TextInput, View, ImageBackground, Text } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { CustomButton } from '../Components/CustomButton';
import { useRoute } from '@react-navigation/native';
import { colors } from '../Styles';
import { getFontSize } from '../Services/Utils';
import { updateUserInfo } from '../Services/FetchData';
import Toast from 'react-native-root-toast';

export const NewLoginExtraDetails = () => {
    const route = useRoute();
    const bgImage = require("../assets/images/background.png");
    const { signIn } = useContext(AppContext);

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(route.params?.phoneNumber || '');
    const [email, setEmail] = useState(route.params?.email || '');
    const [loading, setLoading] = useState(false);
    const loginType = route.params?.loginType;

    const handleNameSubmit = async () => {
        setLoading(true);

        try {
            const userId = route.params?.userId;
            if (!userId) {
                Toast.show("User ID is not Valid, sign in again", Toast.durations.LONG);
                return;
            }
            await updateUserInfo({
                userId: userId,
                name: name,
                email: email,
                phoneNumber: phoneNumber
            });
            const userData = {
                userId,
                phoneNumber: phoneNumber || route.params?.phoneNumber || null,
                email: email || route.params?.email || null,
                loginType,
                name
            };
            signIn(userData.userId, userData.phoneNumber, userData.loginType, userData.name, userData.email);
        } catch (error) {
            console.error("Error updating name:", error);
            // Optionally show an error message to the user here
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.wrapper}>
            <ImageBackground source={bgImage} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.enterNumberText}>Enter your Details</Text>
                    <Text style={[styles.textLightColor, styles.headerDescription]}>
                        Fill the required details to proceed
                    </Text>
                    <Text style={styles.inputLabel}>Name*</Text>
                    <TextInput
                        style={styles.textinput}
                        placeholder="Enter your full name"
                        onChangeText={setName}
                    />
                    {loginType === "email" ? (
                        <>
                            <Text style={styles.inputLabel}>Phone Number*</Text>
                            <TextInput
                                style={styles.textinput}
                                placeholder="Enter your phone number"
                                onChangeText={(val) => setPhoneNumber(`+91${val}`)}
                                inputMode='tel'
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.textinput}
                                placeholder="Enter your email ID"
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </>
                    )}

                    <CustomButton
                        title={"Submit"}
                        disabled={!name || (loginType === "email" ? !phoneNumber : false)}
                        loading={loading}
                        onPress={handleNameSubmit}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.lightYellowBG
    },
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 40,
        marginTop: 150
    },
    textinput: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15
    },
    signInInput: {
        borderRadius: 20,
        paddingHorizontal: 15
    },
    signInButton: {
        backgroundColor: colors.darkGreen,
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
    },
    inputLabel: {
        color: "#041e49b3"
    },
    textLightColor: {
        color: "#3e4740b8"
    },
    headerDescription: {
        textAlign: "center",
        width: "100%",
        marginBottom: 20
    },
    enterNumberText: {
        fontWeight: "400",
        fontSize: getFontSize(22),
        textAlign: "center"
    }
});
