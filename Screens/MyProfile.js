import { Alert, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AppContext } from "../Services/AppContextProvider";
import { useContext, useEffect, useState } from "react";
import { findUser } from "../Services/AppWriteServices";
import Avatar from "../Components/Avatar";
import { colors } from "../Styles";
import { DeleteAccountModal } from "../Components/DeleteAccountModal";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    signOutButton: {
        backgroundColor: colors.darkGreen,
        marginTop: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        color: "#FFF",
        textAlign: "center",
        fontSize: 20,
        width: "100%"
    },
    title: {
        fontWeight: "bold"
    },
    imageContainer: {
        alignSelf: "center",
        width: 32,
        height: 32
    },
    cardContainer: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
    },
    rowDisplay: {
        gap: 10,
        backgroundColor: "#6cbb8a",
        alignItems: "center",
        marginBottom: 20
    },
    profileTextHeader: {
        fontSize: 18,
        overflow: "hidden",
        color: colors.darkGreen
    },
    btns: {
        fontSize: 18,
        borderBottomWidth: 1,
        padding: 10,
        borderBottomColor: colors.lightGrey,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    imageContainer: {
        width: 24,
        height: 24
    },
    btnText: {
        fontSize: 18
    }
})

export const MyProfile = ({ navigation }) => {
    const { authData, signOut } = useContext(AppContext);
    const [profileData, setProfileData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    useEffect(() => {
        findUser().then(res => {
            console.log(res);
            if (res && res.data.length > 0) {
                const data = res.data[0];
                setProfileData({
                    userName: data.name,
                    phoneNumber: data.phone,
                    email: data.email
                });
            }
            else {
                console.log("No user data found.");
            }
        }).catch(err => {
            console.error("Error fetching user data:", err);
        });
    }, [])

    return <View style={styles.container}>
        <DeleteAccountModal modalVisible={modalVisible} toggleModal={toggleModal}/>
        <View style={[styles.cardContainer, styles.rowDisplay]}>
            {profileData.userName ? <Avatar name={profileData.userName} size={60} backgroundColor="#CCC" color="#000" /> : null}
            <Text style={styles.profileTextHeader}>{profileData.userName} | {profileData.phoneNumber}</Text>
            <Text style={styles.profileTextHeader}>{profileData.email}</Text>
        </View>

        <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("OrdersList")}>
                <View style={styles.btns}>
                    <Text style={styles.btnText}>Your orders</Text>
                    <Image style={styles.imageContainer} source={require("../assets/images/chevron_right.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AddAddress")}>
                <View style={styles.btns}>
                    <Text style={styles.btnText}>Address book</Text>
                    <Image style={styles.imageContainer} source={require("../assets/images/chevron_right.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AboutUs")}>
                <View style={styles.btns}>
                    <Text style={styles.btnText}>About us</Text>
                    <Image style={styles.imageContainer} source={require("../assets/images/chevron_right.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.btns}>
                    <Text style={styles.btnText}>Delete account</Text>
                    <Image style={styles.imageContainer} source={require("../assets/images/chevron_right.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("TermsAndConditions")}>
                <View style={styles.btns}>
                    <Text style={styles.btnText}>Terms and conditions</Text>
                    <Image style={styles.imageContainer} source={require("../assets/images/chevron_right.png")} />
                </View>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={signOut}>
            <Text style={styles.signOutButton}>Sign out</Text>
        </TouchableOpacity>
    </View>
}