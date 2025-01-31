import { useContext, useState } from "react"
import { Image, StyleSheet, Text, TextInput, View } from "react-native"
import { CustomButton } from "../Components/CustomButton";
import { useRoute } from "@react-navigation/native";
import { updateUserInfo } from "../Services/FetchData";
import { getFontSize } from "../Services/Utils";
import { colors } from "../Styles";
import Toast from "react-native-root-toast";
import { AppContext } from "../Services/AppContextProvider";

export const EditProfile = ({navigation}) => {
    const route = useRoute();
    const { authData, signIn } = useContext(AppContext);
    const [name, setName] = useState(route.params?.name);
    const [email, setEmail] = useState(route.params?.email);
    let routePhone = route.params?.phoneNumber;
    if(routePhone.indexOf('+91') > -1) {
        routePhone = routePhone.replace("+91", "");
    }
    const [phoneNumber, setPhoneNumber] = useState(routePhone);
    const [userId, setUserId] = useState(route.params?.userId)

    const countryImage = require("../assets/images/india.png");

    return <View style={styles.container}>
        <Text>Name</Text>
        <TextInput style={styles.textinput} value={name} placeholder="Enter name" onChangeText={(val) => setName(val)} />

        <Text>Email</Text>
        <TextInput style={styles.textinput} value={email} placeholder="Enter Email" onChangeText={setEmail} />

        <Text>Phone number</Text>
        <View style={styles.loginInput}>
            <Image
                style={styles.image}
                source={countryImage}
                contentFit="cover"
                transition={1000}
            />
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
                value={phoneNumber}
                style={styles.signInInput}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder='Enter phone number'
                onChangeText={(val) => setPhoneNumber(`+91${val}`)}
            />
        </View>
        <CustomButton
            title={"Submit"}
            onPress={() => {
                updateUserInfo({
                    name,
                    phoneNumber,
                    email,
                    userId
                }).then(res => {
                    if (res.data && res.data.status == "success") {
                        Toast.show("Profile updated successfully", Toast.durations.LONG);
                        signIn(userId, phoneNumber, authData.loginType, name,  email);
                        navigation.goBack();
                    }
                    else
                        Toast.show("Try again, profile updation failed", Toast.durations.LONG);
                });
            }}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    image: {
        width: 32,
        height: 32
    },
    textinput: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15
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
        fontSize: getFontSize(14),

    },
    loginInput: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        width: "100%",
        borderColor: colors.darkGreen,
        fontSize: getFontSize(18)
    },
})