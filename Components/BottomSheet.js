import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Pressable } from 'react-native';
import auth from "@react-native-firebase/auth";
import { findUser, submitAddress } from '../Services/FetchData';
import PillButton from './PillButton';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../Services/AppContextProvider';

const BottomSheet = ({ setStatus, address }) => {
    const navigation = useNavigation();
    const slide = React.useRef(new Animated.Value(300)).current;
    const [userDetails, setUserDetails] = useState({
        type: "Home",
        area: address
    });
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const {setSelectedAddress} = useContext(AppContext)

    // Handle user state changes
    function onAuthStateChanged(user) {
        findUser(user.phoneNumber.replace("+", " ")).then((response) => {
            if (response.data && response.data.length > 0) {
                setUserDetails({ ...userDetails, ...response.data[0] });
            }
        })
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);


    const slideUp = () => {
        // Will change slide up the bottom sheet
        Animated.timing(slide, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        // Will slide down the bottom sheet
        Animated.timing(slide, {
            toValue: 300,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };


    React.useEffect(() => {
        slideUp()
    })


    const closeModal = () => {
        slideDown();

        setTimeout(() => {
            setStatus(false);
        }, 400)

    }

    const handleAddressType = (type) => {
        setUserDetails({ ...userDetails, type });
    }

    return (
        <Pressable onPress={closeModal} style={styles.backdrop}>
            <Pressable style={{ width: '100%', height: '72%', }}>
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Enter complete address</Text>
                    <View style={{ marginTop: 20 }}>

                        <Text>Receiver' name</Text>
                        <TextInput
                            placeholder='Enter Username'
                            style={styles.input}
                            value={userDetails.username}
                            editable={userDetails.username ? false : true}
                            onChange={(text) => setUserDetails({ ...userDetails, username: text })}
                        />

                        <Text>Receiver' contact no</Text>
                        <TextInput
                            placeholder='Enter phone number'
                            style={styles.input}
                            value={userDetails.phone_number}
                            editable={userDetails.phone_number ? false : true}
                            onChange={(text) => setUserDetails({ ...userDetails, phone_number: text })}
                        />

                        <Text>Selected address</Text>
                        <TextInput
                            placeholder='Enter address'
                            style={[styles.input, { height: 80 }]}
                            multiline={true}
                            numberOfLines={3}
                            value={address}
                            editable={address ? false : true}
                            onChangeText={(text) => setUserDetails({ ...userDetails, area: text })}
                        />

                        <Text>Locality</Text>
                        <TextInput
                            placeholder='Enter nearby locality'
                            style={styles.input}
                            onChangeText={text =>  setUserDetails({ ...userDetails, locality: text })}
                        />

                        <Text>Address type</Text>
                        <View style={{ flexDirection: "row", gap: 15 }}>
                            <PillButton item={{ title: "Home", isSelected: userDetails.type === "Home" }} clickHandler={() => handleAddressType("Home")} />
                            <PillButton item={{ title: "Office", isSelected: userDetails.type === "Office" }} clickHandler={() => handleAddressType("Office")} />
                            <PillButton item={{ title: "Other", isSelected: userDetails.type === "Other" }} clickHandler={() => handleAddressType("Other")} />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => {
                            setSubmitDisabled(true);
                            console.log(userDetails);
                            submitAddress(userDetails).then((res) => {
                                setSelectedAddress({street_locality: userDetails.area, idaddress: res?.data.insertId})
                                navigation.goBack();
                                setSubmitDisabled(false);
                            })
                        }}>
                            <Text style={styles.btnText} disabled={submitDisabled}>Update address</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Pressable>

        </Pressable>
    )
}


export default BottomSheet;


const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        zIndex: 10
    },
    bottomSheet: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bcbcbc',
        paddingHorizontal: 15,
        marginBottom: 10
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
    }
})