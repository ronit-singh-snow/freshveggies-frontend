import { StyleSheet, ScrollView, TextInput, Button, View, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { getResourceURL } from '../Services/Utils';
import { useContext, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';

export default function LoginPage() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const { signIn } = useContext(AppContext);
    const bgImage = require("../assets/images/background.png");
    return (
        <ImageBackground source={bgImage} style={{ flex: 1 }}>
            <View style={styles.container}>
                <TextInput style={styles.signInInput} placeholder='Enter email' onChangeText={setEmail} />
                <TextInput style={styles.signInInput} placeholder='Enter password' secureTextEntry={true} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => {
                    signIn(email, password);
                }}>
                    <Text style={styles.signInButton}>Sign in</Text>
                </TouchableOpacity>
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
    signInInput: {
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    signInButton: {
        backgroundColor: "#345f22",
        marginTop: 30,
        padding: 15,
        borderRadius: 10,
        color: "#FFF",
        textAlign: "center",
        fontSize: 20,
        width: "100%"
    }
});
