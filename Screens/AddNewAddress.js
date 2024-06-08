import { useContext, useState } from "react";
import { ScrollView, StyleSheet } from "react-native"
import { Button, TextInput } from "react-native-paper";
import { submitAddress } from "../Services/FetchData";
import { AppContext } from "../Services/AppContextProvider";
import FlashMessage, { showMessage } from "react-native-flash-message";

export const AddNewAddress = ({navigation}) => {
    const {authData} = useContext(AppContext)
    const [address, setAddress] = useState({email: authData.email});

    const updateValues = (key, value) => {
        let cloneAddress = { ...address };
        cloneAddress[key] = value;
        setAddress(cloneAddress);
    }

    return <ScrollView style={styles.container}>
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