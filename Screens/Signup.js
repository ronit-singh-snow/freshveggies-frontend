import { StyleSheet, TextInput, Text, Button, View, ImageBackground, TouchableOpacity } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { colors } from '../Styles';

export const Signup = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [mobile, setMobile] = useState();
    const [name, setName] = useState();
    const { signUp } = useContext(AppContext);
    const bgImage = require("../assets/images/background.png");
    return (
        <ImageBackground source={bgImage} style={{ flex: 1 }}>
            <View style={styles.container}>
                <TextInput style={styles.signInInput} placeholder='Enter full name' onChangeText={setName} />
                <TextInput style={styles.signInInput} placeholder='Enter email' onChangeText={setEmail} />
                <TextInput style={styles.signInInput} placeholder='Enter mobile number' onChangeText={setMobile} />
                <TextInput style={styles.signInInput} placeholder='Enter password' secureTextEntry={true} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => {
                    signUp(email, password, name, mobile);
                }}>
                    <Text style={styles.signUpButton}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        justifyContent: "center",
        marginTop: 150
    },
    signInInput: {
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    signUpButton: {
        backgroundColor: colors.darkGreen,
        marginTop: 30,
        padding: 15,
        borderRadius: 10,
        color: "#FFF",
        textAlign: "center",
        fontSize: 20,
        width: "100%"
    }
});
