import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

export const ForgotPassword = ({navigation}) => {
    return <View style={styles.container}>
        <Text style={styles.forgotMsg}>Enter your email and we will send you instructions to reset your password</Text>
        <TextInput style={styles.signInInput} placeholder="Enter your email address"/>
        <Pressable>
            <Text style={styles.signInButton}>Send email</Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 40
    },
    signInInput: {
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        width: "100%"
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
    },
    forgotMsg: {
        fontSize: 16,
        marginBottom: 10,
        justifyContent: "space-evenly"
    }
})