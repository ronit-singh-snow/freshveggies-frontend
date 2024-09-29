import { StyleSheet, TextInput, View, ImageBackground, Text } from 'react-native';
// import auth from "@react-native-firebase/auth";
import { useContext, useEffect,  useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { insertUser } from '../Services/FetchData';
import { CustomButton } from '../Components/CustomButton';
import { useRoute } from '@react-navigation/native';
import { colors } from '../Styles';

export const NewLoginExtraDetails = () => {
    const route = useRoute();
    const bgImage = require("../assets/images/background.png");
    const { signIn } = useContext(AppContext);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [user, setUser] = useState();
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        // auth().onAuthStateChanged(setUser);
        // auth().onAuthStateChanged((user) => {
        //     setUser(user);
        // });
    }, []);



    return <ImageBackground source={bgImage} style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.inputLabel}>Name*</Text>
            <TextInput
                style={styles.textinput}
                placeholder='Enter your full name'
                onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
                style={styles.textinput}
                placeholder='Enter your email address'
                onChangeText={setEmail}
            />
            <CustomButton
                title={"Submit"}
                disabled={!name}
                loading={loading}
                onPress={() => {
                    setLoading(true);
                    insertUser(email, name, route.params?.phoneNumber).then((response) => {
                        setLoading(false);
                        signIn(route.params?.userId, route.params?.phoneNumber, "phone", email);
                    })
                }}
            />
        </View>
    </ImageBackground>
}

const styles = StyleSheet.create({
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
    },
    inputLabel: {
        color: "#041e49b3"
    }
});