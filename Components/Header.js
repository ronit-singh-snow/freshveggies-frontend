import { Image } from 'expo-image';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header () {
    const navigation = useNavigation();
    const locationImage = require('../assets/images/location_pin.png');
    const avatarImage = require('../assets/images/avatar.png');
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.headerLeftSection}>
                    <Image
                        style={styles.image}
                        source={locationImage}
                        contentFit="cover"
                        transition={1000}
                    />
                    <Text style={styles.location} onPress={e => navigation.navigate("Location")}>Sunderpur, Varanasi</Text>
                </View>
                <Image
                    style={styles.image}
                    source={avatarImage}
                    contentFit="cover"
                    transition={1000}
                />
            </View>
            <TextInput style={styles.searchInput} placeholder="Search for Fresh Vegetables" />
        </View>
    )
}

const styles = StyleSheet.create({
    headerLeftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7
    },
    location: {
        fontWeight: '700',
        fontSize: 18
    },
    container: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    image: {
        width: 32,
        height: 32
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    }
});