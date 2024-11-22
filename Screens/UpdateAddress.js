import { useState, useEffect, useContext } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import PillButton from "../Components/PillButton";
import { CustomButton } from "../Components/CustomButton";
import { AppContext } from "../Services/AppContextProvider";
import { DatabaseService } from "../Services/Appwrite/DatabaseService";

export const UpdateAddress = ({ navigation }) => {
    const { authData, setSelectedAddress } = useContext(AppContext);
    const route = useRoute();
    const address = route.params?.address || {};
    const isEdit = route.params?.editAddress || false;

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: address?.name || "",
        phone_number: address?.phone_number || "",
        full_address: address?.full_address || "",
        locality: address?.locality || "",
        pinCode: address?.zip_code || "",
        type: address?.type || "Home",
        isDefaultAddress: address?.isDefaultAddress || false,
        isEdit,
    });
console.log("pin code: ",address.zip_code);
    useEffect(() => {
        console.log("Updated userDetails:", userDetails);
    }, [userDetails]);

    useEffect(() => {
        const currentAddress = userDetails.full_address?.trim() || "";
        const pinCodeMatch = currentAddress.match(/\b\d{6}\b/); 
        const extractedPinCode = pinCodeMatch ? pinCodeMatch[0] : "";
        if (userDetails.pinCode !== extractedPinCode) {
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                pinCode: extractedPinCode,
            }));
        }
    }, [userDetails.full_address]);

    useEffect(() => {
        const { username, phone_number, full_address, pinCode } = userDetails;
        const disable =
            !username?.trim() || !phone_number?.trim() || !full_address?.trim() || !pinCode?.trim();
        setButtonDisabled(disable);
    }, [userDetails]);

    const handleAddressType = (type) => {
        setUserDetails((prev) => ({ ...prev, type }));
    };

    const addressData = {
        name: userDetails.username,
        phone_number: userDetails.phone_number,
        full_address: userDetails.full_address,
        locality: userDetails.locality,
        type: userDetails.type,
        zip_code: userDetails.pinCode,
        email: authData.email,
    };

    const handleSubmit = () => {
        setLoading(true);
        const dbService = new DatabaseService();
        if (isEdit){
            dbService.updateAddress(address.$id, addressData).then((res) => {
                console.log("Address updated successfully:", res);
                setSelectedAddress(res); 
                navigation.goBack();
            })
            .catch((error) => console.error("Error updating address:", error))
            .finally(() => setLoading(false));
        }
        else{  
        dbService.insertAddresses(authData.user_token, addressData).then((res) => {
                console.log("Address updated successfully:", res);
                setSelectedAddress(res); 
                navigation.goBack();
            })
            .catch((error) => console.error("Error updating address:", error))
            .finally(() => setLoading(false));
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            keyboardVerticalOffset={50}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView>
                {/* Receiver Name */}
                <Text style={styles.inputLabel}>Receiver's Name*</Text>
                <TextInput
                    placeholder="Enter name"
                    style={styles.input}
                    value={userDetails.username}
                    editable={!isEdit}
                    onChangeText={(text) => setUserDetails({ ...userDetails, username: text })}
                />

                {/* Phone Number */}
                <Text style={styles.inputLabel}>Phone Number*</Text>
                <TextInput
                    placeholder="Enter phone number"
                    style={styles.input}
                    value={userDetails.phone_number}
                    editable={!isEdit}
                    onChangeText={(text) => setUserDetails({ ...userDetails, phone_number: text })}
                />

                {/* Full Address */}
                <Text style={styles.inputLabel}>Full Address*</Text>
                <TextInput
                    placeholder="Enter full address"
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={userDetails.full_address}
                    onChangeText={(text) =>
                        setUserDetails({ ...userDetails, full_address: text })
                    }
                />

                {/* Locality */}
                <Text style={styles.inputLabel}>Locality</Text>
                <TextInput
                    placeholder="Enter locality"
                    style={styles.input}
                    value={userDetails.locality}
                    onChangeText={(text) =>
                        setUserDetails({ ...userDetails, locality: text })
                    }
                />

                {/* Pin Code */}
                <Text style={styles.inputLabel}>Pin Code*</Text>
                <TextInput
                    placeholder="Enter pin code"
                    style={styles.input}
                    value={userDetails.pinCode}
                    onChangeText={(text) =>
                        setUserDetails({ ...userDetails, pinCode: text })
                    }
                />

                {/* Address Type */}
                <Text style={styles.inputLabel}>Address Type</Text>
                <View style={{ flexDirection: "row", gap: 15 }}>
                    {["Home", "Office", "Other"].map((type) => (
                        <PillButton
                            key={type}
                            item={{ title: type, isSelected: userDetails.type === type }}
                            clickHandler={() => handleAddressType(type)}
                        />
                    ))}
                </View>

                {/* Default Address Checkbox */}
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                        status={userDetails.isDefaultAddress ? "checked" : "unchecked"}
                        onPress={() =>
                            setUserDetails((prev) => ({
                                ...prev,
                                isDefaultAddress: !prev.isDefaultAddress,
                            }))
                        }
                    />
                    <Text>Make this your default address</Text>
                </View>

                {/* Submit Button */}
                <CustomButton
                    title="Update Address"
                    loading={loading}
                    disabled={loading || buttonDisabled}
                    onPress={handleSubmit}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    inputLabel: { fontWeight: "500", marginBottom: 5 },
    input: {
        width: "100%",
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#bcbcbc",
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#FFF",
    },
    button: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#345f22',
        alignItems: 'center',
        marginTop: 15
    },
    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    buttonDisabled: {
        opacity: 0.6
    }
});