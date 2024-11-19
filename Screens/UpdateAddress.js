import { useState, useEffect, useContext } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import PillButton from "../Components/PillButton";
import { Checkbox } from "react-native-paper";
import { findUser, submitAddress } from "../Services/FetchData";
import { AppContext } from "../Services/AppContextProvider";
import { useRoute } from "@react-navigation/native";
import { CustomButton } from "../Components/CustomButton";


export const UpdateAddress = ({navigation}) => {
    const {authData, setSelectedAddress} = useContext(AppContext);
    const route = useRoute();
    const address = route.params?.address;
    const isEdit = route.params?.editAddress || false;

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({
        ...address,
        isEdit,
        type: address?.type ? address.type : "Home"
    });

    const handleAddressType = (type) => {
        setUserDetails({ ...userDetails, type });
    }

    const disableSubmitButton = (forceDisable, username, phone_number, full_address) => {
        let disabled = false;
        if (forceDisable)
            disabled = true;
        else if (!username || !phone_number || !full_address)
            disabled = true;
        else 
            disabled = false;
        setButtonDisabled(disabled);
    }


    useEffect(() => {
        setLoading(true);
        findUser(authData.phone_number.replace("+", " ")).then((response) => {
            if (response.data && response.data.length > 0) {
                const {username, phone_number} = response.data[0];
                setUserDetails({ ...userDetails, username, phone_number });
                disableSubmitButton(false, username, phone_number, userDetails.full_address);
            }
        }).finally(() => setLoading(false));
        
    }, [])
    return (
        <KeyboardAvoidingView
            style={styles.container}
            keyboardVerticalOffset={50}
            behavior={(Platform.OS === 'ios') ? "padding" : "height"}>
            <ScrollView>
                <Text style={styles.inputLabel}>Receiver' name*</Text>
                <TextInput
                    placeholder='Enter Username'
                    style={styles.input}
                    value={userDetails.username}
                    editable={userDetails.username ? false : true}
                    onChange={(text) => setUserDetails({ ...userDetails, username: text })}
                />

                <Text style={styles.inputLabel}>Receiver's contact no*</Text>
                <TextInput
                    placeholder='Enter phone number'
                    style={styles.input}
                    value={userDetails.phone_number}
                    editable={userDetails.phone_number ? false : true}
                    onChange={(text) => {
                        setUserDetails({ ...userDetails, phone_number: text });
                        disableSubmitButton(false, userDetails.username, text, userDetails.full_address);
                    }}
                />

                <Text style={styles.inputLabel}>Address*</Text>
                <TextInput
                    placeholder='Enter address'
                    style={[styles.input, { height: 80 }]}
                    multiline={true}
                    numberOfLines={3}
                    value={userDetails?.full_address}
                    onChangeText={(text) => {
                        setUserDetails({ ...userDetails, full_address: text })
                        disableSubmitButton(false, userDetails.username, userDetails.phone_number, text);
                    }}
                />
                <Text style={styles.inputLabel}>Locality</Text>
                <TextInput
                    placeholder='Enter nearby locality'
                    style={styles.input}
                    value={userDetails?.locality}
                    onChangeText={text => {
                        setUserDetails({ ...userDetails, locality: text });
                        disableSubmitButton(false, userDetails.username, userDetails.phone_number, userDetails.full_address);
                    }}
                />

                <Text style={styles.inputLabel}>Address type</Text>
                <View style={{ flexDirection: "row", gap: 15 }}>
                    <PillButton item={{ title: "Home", isSelected: userDetails.type === "Home" }} clickHandler={() => handleAddressType("Home")} />
                    <PillButton item={{ title: "Office", isSelected: userDetails.type === "Office" }} clickHandler={() => handleAddressType("Office")} />
                    <PillButton item={{ title: "Other", isSelected: userDetails.type === "Other" }} clickHandler={() => handleAddressType("Other")} />
                </View>

                <View style={{marginTop: 10, flexDirection: "row", alignItems: "center"}}>
                    <Checkbox 
                        status={userDetails.isDefaultAddress ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setUserDetails({...userDetails, isDefaultAddress: !userDetails.isDefaultAddress});
                        }}/>
                    <Text>Make this your default address</Text>
                </View>
                <CustomButton
                    title={"Update address"}
                    loading={loading}
                    disabled={loading || buttonDisabled}
                    onPress={() => {
                        console.log("user details: ",userDetails );
                        setLoading(true);
                        submitAddress(userDetails).then((res) => {
                            setSelectedAddress({ full_address: userDetails.full_address, idaddress: res?.data.insertId })
                            navigation.goBack();
                            navigation.navigate("AddAddress", { userDetails });

                        }).finally(() => {
                            setLoading(false);
                        })
                    }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    inputLabel: {
        fontWeight: "500"
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bcbcbc',
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: "#FFF"
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
})