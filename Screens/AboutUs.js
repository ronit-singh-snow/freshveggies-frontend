import { StyleSheet, Text, View, Button, Linking } from "react-native"
import { getFontSize } from "../Services/Utils"
import { CustomButton } from "../Components/CustomButton";

export const AboutUs = () => {
    const sendEmail = () => {
        const to = 'admin@vgramcart.com';
        const subject = 'Issue with V-Gram Cart app';
        const body = 'Hello V-Gram Cart team, I am facing some issue with the app please resolve it ASAP.';

        const emailUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(emailUrl)
            .catch(err => console.error('An error occurred', err));
    };

    return <View style={styles.container}>
        <Text style={styles.heading}>About US</Text>
        <Text style={styles.description}>Welcome to V-Gram Cart, your premier home delivery service for the finest fruits and vegetables! We are dedicated to bringing the produces to your doorstep, making healthy eating more convenient than ever.</Text>
        <Text style={styles.heading}>Our Mission</Text>
        <Text style={styles.description}>At V-Gram Cart, our mission is to provide families with easy access to fresh, high-quality produce while supporting local vendorss and promoting sustainable practices. We believe that eating well should be effortless, and our goal is to inspire healthier lifestyles through nutritious food choices.</Text>
    
        <View style={styles.footer}>
            <CustomButton
                title="Send Email to connect us"
                onPress={sendEmail}
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    heading: {
        fontWeight: "bold",
        marginTop: 20,
        fontSize: getFontSize(20)
    },
    description: {
        fontSize: getFontSize(14),
        color: "#3e4740b8",
        paddingHorizontal: 15
    },
    footer: {
        marginTop: "auto"
    }
})