import { useContext, useEffect, useState } from "react"
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";
import Toast from 'react-native-root-toast';

import { AppContext } from "../Services/AppContextProvider"
import { deleteRecord, getAddresses } from "../Services/FetchData"
import RoundedIconButton from "../Components/RoundedIconButton";
import { useIsFocused } from "@react-navigation/native";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        width: "100%",
        textAlign: "center"
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20
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
        width: "100%",
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    chevronRight: {
        height: 24,
        width: 24,
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
    },
    selectedAddress: {
        backgroundColor: "#73c8cac7"
    },
    addressHeaderItems: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardOverflowActions: {
        width: 16,
        height: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#44b678"

    },
    placesSearchContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderRadius: 5,
        borderLeftWidth: 0,
        borderColor: '#ddd'
    },
    cardBottomShadow: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    currentLocationText: {
        fontWeight: "bold",
        color: "#44b678"
    },
    currentLocationIcon: {
        alignSelf: "baseline",
        width: 24,
        height: 24
    },
    addAddressBtn: {
        color: "#44b678",
        fontWeight: "bold",
        borderTopWidth: 1,
        borderColor: "#ddd",
        paddingTop: 10,
        paddingLeft: 20,
        fontSize: 16
    }
});
const autoCompleteStyles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
        zIndex: 1
    },
    listView: {
        borderColor: '#c8c7cc',
        borderWidth: 1,
        borderRadius: 2,
        position: 'absolute',
        top: 47
    },
    textInputContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRightWidth: 0,
        borderRadius: 5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        paddingHorizontal: 10,
        fontSize: 16,
        flex: 1,
    }
});

export const AddAddress = ({ navigation }) => {
    const { authData, setSelectedAddress, getSelectedAddress } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState();
    const [CurrentAddress, setCurrentAddress] = useState(null);
    const isInFocus = useIsFocused();

    const currentLocationPng = require("../assets/images/current_location.png");
    const chevronRight = require("../assets/images/chevron_right.png");

    const getCurrentLocation = () => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.show("please grant location access", Toast.durations.SHORT);
                return;
            }

            let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const response = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (response.length > 0) {
                setCurrentAddress(response[0].formattedAddress)
            }
        }
        getPermissions();
    }

    useEffect(() => {
        getCurrentLocation();
    }, []);
    
    useEffect(() => {
        getAddresses(authData.phone_number.replace("+", " "), -1).then(res => {
            setAddresses(res?.data);
        });
    }, [isInFocus]);

    const navigateToUpdateAddress = (selectedAddress) => {
        let routeParams = {};
        if (selectedAddress)
            routeParams = {
                address: selectedAddress
            }
        navigation.navigate("UpdateAddress", {
            address: selectedAddress
        });
    }

    const selectedAddress = getSelectedAddress();
    return <View style={styles.mainContainer}>
        <View style={styles.searchBarContainer}>
            <GooglePlacesAutocomplete
                placeholder='Sunderpur, Varanasi'
                debounce={250}
                minLength={2}
                enablePoweredByContainer={false}
                disableScroll={false}
                onPress={(data, details = null) => {
                    navigateToUpdateAddress( {full_address: data.description });
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
                renderRightButton={() => (
                    <View style={styles.placesSearchContainer}>
                        <Image style={{ width: 22, height: 22, alignSelf: "center" }} source={require("../assets/images/search.png")} />
                    </View>
                )}
                styles={autoCompleteStyles}
            />

        </View>
        <View style={styles.contentContainer}>
            <View style={styles.cardBackground}>
                <TouchableOpacity
                    onPress={() => {
                        setAddress(CurrentAddress);
                        navigateToUpdateAddress({
                            full_address: CurrentAddress
                        });
                    }}
                >
                    <View style={[styles.currentAddressContainer, styles.cardBottomShadow]}>
                        <Image style={styles.currentLocationIcon} source={currentLocationPng} />
                        <View style={{ minWidth: 0, flexShrink: 1 }}>
                            <Text style={styles.currentLocationText}>Current Location</Text>
                            <Text style={{ minWidth: 0, color: "#777" }}>{CurrentAddress}</Text>
                        </View>
                        <Image source={chevronRight} style={styles.chevronRight} />
                    </View>
                </TouchableOpacity>
                <Pressable onPress={() => navigateToUpdateAddress()}>
                    <Text style={styles.addAddressBtn}>      &#x2b;   Add address</Text>
                </Pressable>
            </View>

            {addresses.length > 0 ? (
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <Text style={styles.savedAddrTitle}>Saved Addresses</Text>
                    {addresses.map((addr, index) => {
                        const isAddressSelected = selectedAddress && selectedAddress.idaddress == addr.idaddress;
                        return (
                            <TouchableOpacity key={addr.idaddress} onPress={() => {
                                setSelectedAddress(addr);
                                navigation.goBack();
                            }}>
                                <View style={[styles.cardBackground, styles.rowDir, isAddressSelected ? styles.selectedAddress : ""]}>
                                    <View style={styles.addressDetail}>
                                        <View style={styles.addressHeaderItems}>
                                            <Text style={styles.addressType}>{addr.type}</Text>
                                            <View style={{ flexDirection: "row", gap: 12 }}>
                                                <RoundedIconButton 
                                                    onPress={() => {
                                                        navigation.navigate("UpdateAddress", {
                                                            address: addr,
                                                            editAddress: true
                                                        });
                                                    }}
                                                    buttonColor="#ddd"
                                                    source={require("../assets/images/pen.png")}
                                                />
                                                <RoundedIconButton
                                                    onPress={() => {
                                                        deleteRecord("address", addr.idaddress, "idaddress");
                                                        Toast.show('Address deleted successfully', {
                                                            duration: Toast.durations.LONG
                                                        });
                                                        let clonedAddresses = Array.from(addresses);
                                                        clonedAddresses.splice(index, 1);
                                                        setAddresses(clonedAddresses);
                                                        if (isAddressSelected)
                                                            setSelectedAddress(null);
                                                    }}
                                                    buttonColor="#ddd"
                                                    source={require("../assets/images/delete.png")}
                                                />
                                            </View>
                                        </View>
                                        <Text>{addr.name} | {addr.phone_number}</Text>
                                        <Text style={{ color: "#777" }}>{addr.full_address}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                </ScrollView>
            ) : (
                <View>
                    <Text>No data available</Text>
                </View>
            )}
        </View>
    </View>
}