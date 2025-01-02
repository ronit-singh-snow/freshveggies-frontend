import { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';


const fetchLocation = async (setSearchText) => {
    const res = await axios.get("https://api.foursquare.com/v3/autocomplete");
    console.log(res);
}

export default function GetLocation() {
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchLocation(setSearchText)
    }, [searchText]);

    const handleChangeText = (newText) => {
        setSearchText(newText);
    };

    return (
        <View>
            <StatusBar style="auto" />
            <Text>Sunderpur, Varanasi</Text>
            <TextInput
                placeholder="Type here to translate!"
                style={styles.searchInput}
                onChangeText={handleChangeText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchInput: {
        height: 100,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1
    }
});