import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import RoundedIconButton from "./RoundedIconButton";
import { colors } from "../Styles";
import { deleteAccount } from "../Services/FetchData";
import { useContext, useState } from "react";
import { AppContext } from "../Services/AppContextProvider";
import Loader from "./Loader";

export const DeleteAccountModal = ({ modalVisible, toggleModal }) => {
    const [loader, toggleLoader] = useState(false);
    const {authData} = useContext(AppContext)
    const deleteAccountHandler = () => {
        toggleLoader(true);
        // deleteAccount(authData.user_token).then((res) => {
        //     Toast.show("Your account has been deleted successfully", Toast.durations.LONG);
        // })
        deleteAccount(authData.user_token)
        .then(() => {
            toggleLoader(false);
            toggleModal(); 
            signOut(); 
        })
        .catch((err) => {
            console.error("Error deleting account:", err);
            toggleLoader(false);
        });
    }

    return <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            toggleModal(!modalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            {loader 
                ? <ActivityIndicator size="small" color="#0000ff" />
                : (<View>
                        <Text style={styles.modalText}>Are you sure to delete the account?</Text>
                        <View style={styles.btnContainer}>
                            <RoundedIconButton onPress={toggleModal} title={"Cancel"} buttonColor={colors.darkGreen} textColor={"#FFF"}/>
                            <RoundedIconButton onPress={deleteAccountHandler} title={"Delete"} buttonColor={colors.warningMessage} textColor={"#FFF"}/>
                        </View>
                    </View>)
            }
            </View>
            
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: "80%",
        minHeight: 150
    },
    btnContainer: {
        flexDirection: "row",
        gap: 20,
        justifyContent: "flex-end"
    },
    modalText: {
        marginBottom: 15,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: 'center',
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})