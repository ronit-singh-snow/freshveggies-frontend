import { Image } from 'expo-image';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';
import { findUser } from '../Services/FetchData';
import { colors } from '../Styles';

const locationImage = require('../assets/images/location_pin.png');
const avatarImage = require('../assets/images/avatar.png');

export default function Header() {
    const navigation = useNavigation();
    const { authData, getSelectedAddress } = useContext(AppContext);

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
                            : <Text style={{color: colors.almostWhite}}>Select an address</Text>
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
            <Text style={styles.userName}>Hi, {authData?.name}</Text>
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
        color: colors.almostWhite,
        flexWrap: "wrap",
        width: "80%",
        fontWeight: "bold"
    },
    main: {
        backgroundColor: "#0F3460",
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
        color: colors.almostWhite
    },
    description: {
        paddingHorizontal: 15,
        color: colors.almostWhite
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
        backgroundColor: "#F2F3F4"
    }
});