import { StatusBar } from "expo-status-bar"
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 35,
        paddingVertical: 100
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 25
    },
    signUpButton: {
        paddingHorizontal: 65,
        paddingVertical: 10,
        fontWeight: "bold",
        fontSize: 18,
        backgroundColor: "#345f22",
        color: "#FFF",
        borderRadius: 10,
        marginTop: 40,
        width: "100%"
    },
    moto: {
        alignSelf: "flex-start",
        flexDirection: "row",
        paddingVertical: 5
    },
    appMoto: {
        textAlign: "justify"
    },
    textLink: {
        color: "#0000FF"
    },
    login: {
        flexDirection: "row",
        marginTop: 10
    }
})
export const Welcome = ({ navigation }) => {
    const bgImage = require("../assets/images/background.png");
    return (<ImageBackground source={bgImage} style={{flex: 1}}>
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.welcomeText}>Welcome to FreshVeggies!!</Text>
            
            <View style={styles.moto}>
                <Text>{`\u29BF  `}</Text>
                <Text style={styles.appMoto}>We are offering home delivery service of fresh fruits and vegetables to your doorstep.</Text>
            </View>
            <View style={styles.moto}>
                <Text>{`\u29BF  `}</Text>
                <Text style={styles.appMoto}>We are ensuring accurate weight specified on the product is very much crucial for us.</Text>
            </View>
            <View style={styles.moto}>
                <Text>{`\u29BF  `}</Text>
                <Text style={styles.appMoto}>We always ensure that quality of fruits and vegetables is never compromised.</Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signUpButton}>Sign up</Text>
            </TouchableOpacity>
            <View style={styles.login}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.textLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ImageBackground>)
}