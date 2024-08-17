import { useContext, useEffect, useState } from "react"
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

import { AppContext } from "../Services/AppContextProvider"
import { getAddresses } from "../Services/FetchData"
import BottomSheet from "../Components/BottomSheet";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // padding: 20
    },
    container: {
        // padding: 20,'
        width: "100%",
        textAlign: "center"
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    },
    savedAddrTitle: {
        fontSize: 20,
        marginBottom: 15
    },
    addressType: {
        fontWeight: "bold"
    },
    radioBtn: {
        flexBasis: 70
    },
    addNewAddressBtn: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 30
    },
    currentAddressContainer: {
        borderRadius: 10,
        padding: 8,
        width: "100%"
    },
    chevronRight: {
        height: 18,
        width: 18,
        marginLeft: "auto"
    },
    searchBarContainer: {
        width: '100%',
        flex: 1,
        position: "absolute",
        zIndex: 1,
        top: 15,
        paddingHorizontal: 20
    },
    contentContainer: {
        flex: 5,
        alignItems: "center",
        marginTop: 70,
        padding: 20,
        width: "100%"
    }
});
const autoCompleteStyles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
        zIndex: 1,
    },
    listView: {
        borderColor: '#c8c7cc',
        borderWidth: 1,
        borderRadius: 2,
        position: 'absolute',
        top: 47
    }
});

export const AddAddress = ({ navigation }) => {
    const { authData, setSelectedAddress } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState();
    const [showBS, setShowBS] = useState(false);
    const [CurrentAddress, setCurrentAddress] = useState(null);

    const currentLocationPng = require("../assets/images/current_location.png");
    const chevronRight = require("../assets/images/chevron_right.png");

    const getCurrentLocation = () => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log("please grant location access");
                return;
            }

            let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const response = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (response.length > 0) {
                // let address = `${item.name} ${item.city} ${item.postalCode}`
                setCurrentAddress(response[0].formattedAddress)
            }
        }
        getPermissions();
    }

    // Handle user state changes
    function onAuthStateChanged(user) {
        getAddresses(user.phoneNumber.replace("+", " ")).then(res => {
            setAddresses(res?.data);
            if (res?.data.length > 0) {
                console.log(res.data[0])
                setSelectedAddress(res.data[0]);
            }
        });
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        getCurrentLocation();
        
        return subscriber; // unsubscribe on unmount
    }, []);


    return <View style={styles.mainContainer}>
        <View style={styles.searchBarContainer}>
            <GooglePlacesAutocomplete
                placeholder='Search address'
                debounce={250}
                minLength={2}
                enablePoweredByContainer={false}
                disableScroll={false}
                onPress={(data, details = null) => {
                    setAddress(`${data.description}`);
                    setShowBS(true);
                }}
                query={{
                    key: 'AIzaSyAfAmY_6_d1v52LpV4xEY6eJ8eRCKcDHvc',
                    language: 'en',
                    components: "country:IN"
                }}
                renderRow={(data, index) => {
                    return <View style={{ width: "100%", maxWidth: "100%", overflow: "hidden", flexWrap: "wrap" }}>
                        <Text style={{ fontWeight: "bold" }}>
                            {data.structured_formatting.main_text}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ width: 0, flex: 1, flexWrap: "wrap" }}>
                                {data.structured_formatting.secondary_text}
                            </Text>
                        </View>

                    </View>
                }}
                styles={autoCompleteStyles}
            />

        </View>
        <View style={styles.contentContainer}>
            <TouchableOpacity
                onPress={() => {
                    setAddress(CurrentAddress);
                    setShowBS(true);
                }}
                style={[styles.cardBackground, styles.currentAddressContainer]}>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Image style={{ alignSelf: "baseline", width: 24, height: 24 }} source={currentLocationPng} />
                    <View style={{ minWidth: 0, flexShrink: 1 }}>
                        <Text style={{ fontWeight: "bold" }}>Current Location</Text>
                        <Text style={{ minWidth: 0 }}>{CurrentAddress}</Text>
                    </View>
                    <Image source={chevronRight} style={styles.chevronRight} />
                </View>
            </TouchableOpacity>

            <ScrollView style={styles.container}>
                <Text style={styles.savedAddrTitle}>Saved Addresses</Text>
                {addresses.length > 0 ? (
                    addresses.map(addr => {
                        return (
                            <TouchableOpacity key={addr.idaddress} onPress={() => {
                                setSelectedAddress(addr);
                                navigation.goBack();
                            }}>
                                <View style={[styles.cardBackground, styles.rowDir]}>
                                    <View style={styles.addressDetail}>
                                        <Text style={styles.addressType}>{addr.type}</Text>
                                        <Text>{addr.name} | {addr.phone_number}</Text>
                                        <Text>{addr.street_locality}, {addr.address_line_2}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <View>
                        <Text>No data available</Text>
                    </View>
                )}

                <TouchableOpacity onPress={() => setShowBS(true)}>
                    <Text style={styles.addNewAddressBtn}>Add new address</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        {showBS ? <BottomSheet setStatus={setShowBS} address={address} /> : null}
    </View>
}