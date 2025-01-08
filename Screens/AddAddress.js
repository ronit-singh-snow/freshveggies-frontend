import { useContext, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import * as Location from "expo-location";
import Toast from "react-native-root-toast";
import { AppContext } from "../Services/AppContextProvider";
import RoundedIconButton from "../Components/RoundedIconButton";
import { DatabaseService } from "../Services/Appwrite/DatabaseService";
import SearchDropdown from "../Components/SearchDropdown";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        width: "100%",
        textAlign: "center",
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    savedAddrTitle: {
        fontSize: 20,
        marginBottom: 15,
    },
    addressType: {
        fontWeight: "bold",
    },
    currentAddressContainer: {
        borderRadius: 10,
        padding: 8,
        width: "100%",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    chevronRight: {
        height: 24,
        width: 24,
        marginLeft: "auto",
    },
    searchBarContainer: {
        width: "100%",
        flex: 1,
        position: "absolute",
        zIndex: 1,
        top: 15,
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 5,
        alignItems: "center",
        marginTop: 70,
        padding: 20,
        width: "100%",
    },
    selectedAddress: {
        backgroundColor: "#73c8cac7",
    },
    addressHeaderItems: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardOverflowActions: {
        width: 16,
        height: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#44b678",
    },
    cardBottomShadow: {
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    currentLocationText: {
        fontWeight: "bold",
        color: "#44b678",
    },
    currentLocationIcon: {
        alignSelf: "baseline",
        width: 24,
        height: 24,
    },
    addAddressBtn: {
        color: "#44b678",
        fontWeight: "bold",
        borderTopWidth: 1,
        borderColor: "#ddd",
        paddingTop: 10,
        paddingLeft: 20,
        fontSize: 16,
    },
});

export const AddAddress = ({ navigation }) => {
    const {
        authData,
        setSelectedAddress,
        getSelectedAddress
    } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    const [latLong, setLatLong] = useState({});
    const [CurrentAddress, setCurrentAddress] = useState(null);

    const currentLocationPng = require("../assets/images/current_location.png");
    const chevronRight = require("../assets/images/chevron_right.png");

    const getCurrentLocation = () => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.show("please grant location access", Toast.durations.SHORT);
                return;
            }

            let {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync({});
            setLatLong({
                latitude,
                longitude,
            });
            const response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
            if (response.length > 0) {
                setCurrentAddress(response[0].formattedAddress);
            }
        };
        getPermissions();
    };

    useEffect(() => {
        getCurrentLocation();
        const databaseService = new DatabaseService();
        databaseService.fetchAddresses().then((res) => {
            setAddresses(res);
        });
    }, []);

    const navigateToUpdateAddress = (selectedAddress) => {
        let routeParams = {};
        if (selectedAddress) {
            routeParams = {
                address: selectedAddress,
            };
        }
        navigation.navigate("UpdateAddress", {
            address: selectedAddress,
            onSave: (updatedAddress) => {
                setAddresses((prevAddresses) => {
                    const index = prevAddresses.findIndex(
                        (addr) => addr.$id === updatedAddress.$id
                    );
                    if (index !== -1) {
                        prevAddresses[index] = updatedAddress;
                    } else {
                        prevAddresses.push(updatedAddress);
                    }
                    return [...prevAddresses];
                });
            },
        });
    };

    const selectedAddress = getSelectedAddress();
    
    return (
        <View style={styles.mainContainer}>
            <View style={styles.searchBarContainer}>
                <SearchDropdown />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.cardBackground}>
                    <TouchableOpacity
                        onPress={() => {
                            navigateToUpdateAddress({
                                full_address: CurrentAddress,
                            });
                        }}
                    >
                        <View
                            style={[styles.currentAddressContainer, styles.cardBottomShadow]}
                        >
                            <Image
                                style={styles.currentLocationIcon}
                                source={currentLocationPng}
                            />
                            <View style={{ minWidth: 0, flexShrink: 1 }}>
                                <Text style={styles.currentLocationText}>Current Location</Text>
                                <Text style={{ minWidth: 0, color: "#777" }}>
                                    {CurrentAddress}
                                </Text>
                            </View>
                            <Image source={chevronRight} style={styles.chevronRight} />
                        </View>
                    </TouchableOpacity>
                    <Pressable onPress={() => navigateToUpdateAddress()}>
                        <Text style={styles.addAddressBtn}> &#x2b; Add address</Text>
                    </Pressable>
                </View>

                {addresses.length > 0 ? (
                    <ScrollView
                        style={styles.container}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.savedAddrTitle}>Saved Addresses</Text>
                        {addresses
                            .filter((addr) => addr.phone_number === authData?.phone_number)
                            .map((addr, index) => {
                                const isAddressSelected =
                                    selectedAddress &&
                                    selectedAddress.idaddress == addr.idaddress;
                                return (
                                    <TouchableOpacity
                                        key={addr.$id}
                                        onPress={() => {
                                            setSelectedAddress(addr);
                                            navigation.goBack();
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.cardBackground,
                                                styles.rowDir,
                                                isAddressSelected ? styles.selectedAddress : "",
                                            ]}
                                        >
                                            <View style={styles.addressDetail}>
                                                <View style={styles.addressHeaderItems}>
                                                    <Text style={styles.addressType}>{addr.type}</Text>
                                                    <View style={{ flexDirection: "row", gap: 12 }}>
                                                        <RoundedIconButton
                                                            onPress={() => {
                                                                navigation.navigate("UpdateAddress", {
                                                                    address: addr,
                                                                    editAddress: true,
                                                                });
                                                            }}
                                                            buttonColor="#ddd"
                                                            source={require("../assets/images/pen.png")}
                                                        />
                                                        <RoundedIconButton
                                                            onPress={() => {
                                                                const databaseService = new DatabaseService();
                                                                databaseService
                                                                    .deleteAddress(addr.$id)
                                                                    .then(() => {
                                                                        Toast.show("Address deleted successfully", {
                                                                            duration: Toast.durations.LONG,
                                                                        });
                                                                        setAddresses((prevAddresses) =>
                                                                            prevAddresses.filter(
                                                                                (address) => address.$id !== addr.$id
                                                                            )
                                                                        );

                                                                        if (
                                                                            selectedAddress &&
                                                                            selectedAddress.$id === addr.$id
                                                                        ) {
                                                                            setSelectedAddress(null);
                                                                        }
                                                                    })
                                                                    .catch((error) =>
                                                                        Toast.show("Failed to delete address", {
                                                                            duration: Toast.durations.LONG,
                                                                        })
                                                                    );
                                                            }}
                                                            buttonColor="#ddd"
                                                            source={require("../assets/images/delete.png")}
                                                        />
                                                    </View>
                                                </View>
                                                <Text>
                                                    {addr.name} | {addr.phone_number}
                                                </Text>
                                                <Text style={{ color: "#777" }}>
                                                    {addr.full_address}
                                                </Text>
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
    );
};
