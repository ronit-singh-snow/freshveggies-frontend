import { StyleSheet, ScrollView, TextInput, Button, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import {  getResourceURL } from '../Services/Utils';
import { useContext, useState } from 'react';
import { AppContext } from '../Services/AppContextProvider';

export default function LoginPage() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState();
    const [password, setPassword] = useState();
    const {signIn} = useContext(AppContext);

    return (
        <View style={styles.container}>
            <TextInput style={styles.signInInput} placeholder='Enter user name' onChangeText={setUserId} />
            <TextInput style={styles.signInInput} placeholder='Enter password' onChangeText={setPassword} />
            <Button title='Submit' onPress={() => {
                signIn(userId, password);
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: "column",
        // alignItems: "center",
        justifyContent: "center",
        marginVertical: "auto"
    },
    signInInput: {
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 10
    }
});
