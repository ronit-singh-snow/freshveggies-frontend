import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AppContext } from "../Services/AppContextProvider";
import { useContext } from "react";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    signOutButton: {
        backgroundColor: "#345f22",
        marginTop: 30,
        padding: 15,
        borderRadius: 10,
        color: "#FFF",
        textAlign: "center",
        fontSize: 20,
        width: "100%"
    },
    title: {
        fontWeight: "bold"
    },
    imageContainer: {
        alignSelf: "center",
        width: 128,
        height: 128
    }
})

export const MyProfile = () => {
    const {authData: {user}, signOut} = useContext(AppContext);

    return <View style={styles.container}>
        <Image style={styles.imageContainer} source={require("../assets/images/avatar.png")} />
        {/* <Text style={styles.title}>Hi {user.displayName ? user.displayName : user.email},</Text> */}
        <TouchableOpacity onPress={signOut}>
            <Text style={styles.signOutButton}>Sign out</Text>
        </TouchableOpacity>
    </View>
}