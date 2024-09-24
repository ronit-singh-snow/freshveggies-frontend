import { Image } from 'expo-image';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from "@react-native-firebase/auth";
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { findUser } from '../Services/FetchData';

const locationImage = require('../assets/images/location_pin.png');
const avatarImage = require('../assets/images/avatar.png');

export default function Header() {
    const navigation = useNavigation();
    const { authData, getSelectedAddress } = useContext(AppContext);
    const [userData, setUserData] = useState({});
    
    useEffect(() => {
        if (authData.phone_number) {
            findUser(authData.phone_number.replace("+", " ")).then((response) => {
                if (response.data && response.data.length > 0) {
                    setUserData(response.data[0]);
                }
            })
        }
    }, [])

    let selectedAddress = getSelectedAddress();

    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <TouchableOpacity onPress={e => navigation.navigate("AddAddress")}>
                    <View style={styles.headerLeftSection}>
                        <Image
                            style={styles.image}
                            source={locationImage}
                            contentFit="cover"
                            transition={1000}
                        />
                        {selectedAddress
                            ? <Text style={styles.location} numberOfLines={1}>{selectedAddress.full_address}</Text>
                            : <Text>Select an address</Text>
                        }
                    </View>
                </TouchableOpacity>
                <Pressable onPress={() => navigation.navigate("MyProfile")}>
                    <Image
                        style={styles.image}
                        source={avatarImage}
                        contentFit="cover"
                        transition={1000}
                    />
                </Pressable>
            </View>
            <Text style={styles.userName}>Hi, {userData?.username}</Text>
            <Text style={styles.description}>Get fresh fruits and vegetables delivered to your door step.</Text>
            <TextInput style={styles.searchInput} placeholderTextColor={"#C0C0C0"} onFocus={() => navigation.navigate("SearchItem")} placeholder="Search Fruits and Vegetables" />
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
        color: "#345f22",
        flexWrap: "wrap",
        width: "80%",
        fontWeight: "bold"
    },
    main: {
        backgroundColor: "#6cbb8a",
        paddingBottom: 30
    },
    container: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 20
    },
    image: {
        width: 32,
        height: 32
    },
    userName: {
        paddingHorizontal: 15,
        fontWeight: "bold",
        fontSize: 18,
        color: "#345f22"
    },
    description: {
        paddingHorizontal: 15,
        // opacity: 0.9,
        color: "#345f22"
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: "#d3d3d3",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#FFF"
    }
});