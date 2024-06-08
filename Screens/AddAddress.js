import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppContext } from "../Services/AppContextProvider"
import { getAddresses } from "../Services/FetchData"
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
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
    }
})

export const AddAddress = ({navigation}) => {
    const { authData, setSelectedAddress } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    
    useEffect(() => {
        console.log("Add Addresses page");
        getAddresses(authData.email).then(res => {
            setAddresses(res?.data);
            if (res?.data.length > 0) {
                setSelectedAddress(res.data[0]);
            }
        });
    }, []);

    useFocusEffect(() => {
        console.log("Page is in focus");
    })

    return <ScrollView style={styles.container}>
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

        <TouchableOpacity onPress={() => navigation.navigate("AddNewAddress")}>
            <Text style={styles.addNewAddressBtn}>Add new address</Text>
        </TouchableOpacity>
    </ScrollView>
}