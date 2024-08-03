import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import Geolocation from 'react-native-geolocation-service'

import { AppContext } from "../Services/AppContextProvider"
import { getAddresses } from "../Services/FetchData"
import BottomSheet from "../Components/BottomSheet";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    container: {
        padding: 20
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
        margin: 20,
        marginTop: 40,
        padding: 8
    },
    chevronRight: {
        alignSelf: "flex-end",
        height: 32,
        width: 32,
        marginLeft: "auto"
    }
})

export const AddAddress = ({ navigation }) => {
    const { authData, setSelectedAddress } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    const [showBS, setShowBS] = useState(false);
    const [CurrentAddress, setCurrentAddress] = useState(null);
    
    const currentLocationPng = require("../assets/images/current_location.png");
    const chevronRight = require("../assets/images/chevron_right.png");

    const getCurrentLocation = () => {
        const getPermissions = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                console.log("please grant location access");
                return;
            }

            let {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({});
            const response = await Location.reverseGeocodeAsync({latitude, longitude});
            if(response.length > 0){
                // let address = `${item.name} ${item.city} ${item.postalCode}`
                setCurrentAddress(response[0].formattedAddress)
            }
        }
        getPermissions();
    }

    useEffect(() => {
        getAddresses(authData.email).then(res => {
            setAddresses(res?.data);
            if (res?.data.length > 0) {
                setSelectedAddress(res.data[0]);
            }
        });
        getCurrentLocation();
    }, []);

    useFocusEffect(() => {
        
    })

    return <View style={styles.mainContainer}>
        <View>
            <View style={{ height: 40, padding: 20 }}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    debounce={250}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                    }}
                    query={{
                        key: 'AIzaSyAfAmY_6_d1v52LpV4xEY6eJ8eRCKcDHvc',
                        language: 'en',
                    }}
                />
            </View>
            <Pressable style={[styles.cardBackground, styles.currentAddressContainer]}>
                <View style={{flexDirection: "row",  gap: 10, alignItems: "center"}}>
                    <Image source={currentLocationPng} />
                    <Text style={{fontWeight: "bold"}}>Current Location</Text>
                    <Image source={chevronRight} style={styles.chevronRight} />
                </View>
                <Text>{CurrentAddress}</Text>
            </Pressable>
        </View>
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
                                    <Text >{addr.house_flat_no}, {addr.street_locality}, {addr.address_line_2}</Text>
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

            <TouchableOpacity onPress={() => setShowBS(true) /*navigation.navigate("AddNewAddress")*/}>
                <Text style={styles.addNewAddressBtn}>Add new address</Text>
            </TouchableOpacity>
        </ScrollView>
        {showBS ? <BottomSheet setStatus={setShowBS} /> : null}
    </View>
}