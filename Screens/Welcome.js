import { StatusBar } from "expo-status-bar"
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, PixelRatio } from "react-native"
import { colors } from "../Styles";
import { getFontSize } from "../Services/Utils";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 35,
        paddingVertical: 50
    },
    welcomeText: {
        fontSize: getFontSize(24),
        fontWeight: "bold",
        paddingBottom: 15,
        color: colors.darkGreen
    },
    signUpButton: {
        paddingHorizontal: 65,
        paddingVertical: 10,
        fontWeight: "bold",
        fontSize: getFontSize(18),
        backgroundColor: colors.darkGreen,
        color: "#FFF",
        borderRadius: 10,
        marginTop: 40,
        width: "100%",
        textAlign: "center"
    },
    moto: {
        alignSelf: "flex-start",
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    appMoto: {
        textAlign: "justify",
        color: "#02A64E"
    },
    textLink: {
        color: "#0000FF"
    },
    login: {
        flexDirection: "row",
        marginTop: 10,
        
    },
    signUpButtonContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    starIcon: {
        color: "#02A64E",
        paddingRight: 10,
        fontSize: getFontSize(18)
    }
})
export const Welcome = ({ navigation }) => {
    const bgImage = require("../assets/images/background.png");
    
    return (<ImageBackground source={bgImage} imageStyle={{
        resizeMode: "cover",
        alignSelf: "flex-end"
      }} style={{flex: 1, width: null, height: "100%"}}>
        <View style={styles.container}>
            <StatusBar />
            <Text style={[styles.welcomeText]}>Welcome to Orange Cart!!</Text>
            
            <View style={styles.moto}>
                <Text style={styles.starIcon}>{`\u2605`}</Text>
                <Text style={styles.appMoto}>We are offering home delivery service of fresh fruits and vegetables to your doorstep.</Text>
            </View>
            <View style={styles.moto}>
                <Text style={styles.starIcon}>{`\u2605`}</Text>
                <Text style={styles.appMoto}>We are ensuring accurate weight specified on the product is very much crucial for us.</Text>
            </View>
            <View style={styles.moto}>
                <Text style={styles.starIcon}>{`\u2605`}</Text>
                <Text style={styles.appMoto}>We always ensure that quality of fruits and vegetables are never compromised.</Text>
            </View>
            
            <TouchableOpacity style={styles.signUpButtonContainer} onPress={() => navigation.navigate("Login")}>
                <Text style={[styles.signUpButton]}>Login</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>)
}