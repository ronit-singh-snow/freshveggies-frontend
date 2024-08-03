import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, TextInput } from "react-native-paper";
import { submitAddress } from "../Services/FetchData";
import { AppContext } from "../Services/AppContextProvider";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";


export const AddNewAddress = ({ navigation }) => {
    const { authData } = useContext(AppContext)
    const [address, setAddress] = useState({ email: authData.email });
    

    const updateValues = (key, value) => {
        let cloneAddress = { ...address };
        cloneAddress[key] = value;
        setAddress(cloneAddress);
    }
    
    navigator.geolocation = require('react-native-geolocation-service');

    useEffect(() => {
        const getPermissions = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                console.log("please grant location access");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            console.log(currentLocation);
        }
        getPermissions();
    })

    return <View style={styles.container}>
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder='Search'
                currentLocation={true}
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
        <ScrollView style={styles.container}>

            <TextInput onChangeText={(val) => updateValues("name", val)} activeOutlineColor="#345f22" outlineColor="#345f22" mode="outlined" style={styles.txtInput} placeholder="Enter your name" />
            <TextInput onChangeText={(val) => updateValues("phoneNo", val)} activeOutlineColor="#345f22" outlineColor="#345f22" mode="outlined" style={styles.txtInput} placeholder="Enter your contact no" />
            <TextInput onChangeText={(val) => updateValues("houseFlatNo", val)} activeOutlineColor="#345f22" outlineColor="#345f22" mode="outlined" style={styles.txtInput} placeholder="House/Flat no" />
            <TextInput onChangeText={(val) => updateValues("area", val)} activeOutlineColor="#345f22" outlineColor="#345f22" mode="outlined" style={styles.txtInput} placeholder="Area/Locality" />
            <TextInput onChangeText={(val) => updateValues("city", val)} activeOutlineColor="#345f22" outlineColor="#345f22" mode="outlined" style={styles.txtInput} placeholder="City" />
            <TextInput onChangeText={(val) => updateValues("pincode", val)} activeOutlineColor="#345f22" outlineColor="#345f22" mode="outlined" style={styles.txtInput} placeholder="Pincode" />
            <Button mode="contained" buttonColor="#345f22" style={styles.btn} onPress={() => submitAddress(address).then(res => {
                if (res.data.code)
                    showMessage({
                        message: "Found error while inserting the address record",
                        type: "error",
                    });
                else {
                    showMessage({
                        message: "Successfully inserted address record",
                        type: "info",
                    });
                    navigation.goBack();
                }
            })}>Submit</Button>
            <FlashMessage position="top" />
        </ScrollView>
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    txtInput: {
        marginVertical: 10
    },
    btn: {
        marginTop: 20,
        paddingVertical: 5,
        marginBottom: 25
    }
})