import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCurrentLocation } from '../Services/Utils';
import Toast from 'react-native-root-toast';
import { autocompletePlaces } from '../Services/FetchData';
import { useNavigation } from '@react-navigation/native';
const SearchDropdown = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [location, setLocation] = useState(null);
    const navigation = useNavigation();
    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text) {
            console.log(location, text);
            autocompletePlaces(location, 5000, text).then(response => {
                console.log(response.data);
                setFilteredData(response.data.suggestions);
                setDropdownVisible(true);
            }).catch(err => {
                console.log(err);
            });
        } else {
            setDropdownVisible(false);
        }
    };
    
    const handleSelect = (item) => {
        setSearchTerm(item);
        setDropdownVisible(false);
        console.log("Selected Address: ", item.placePrediction.structuredFormat.mainText.text);
        console.log("Selected Address Details: ", item);
        const mainText = item.placePrediction.structuredFormat.mainText.text;
        const secondaryText = item.placePrediction.structuredFormat.secondaryText.text;
        const fullDetails = item.placePrediction.structuredFormat;
    
        console.log("Main Text (Address):", mainText);
        console.log("Secondary Text (Sub Address):", secondaryText);
        navigation.navigate("UpdateAddress", {
            address: mainText,
            details: secondaryText, 
        })
    };

    useEffect(() => {
		getCurrentLocation().then(res => {
			console.log(res);
			setLocation(res);
		}).catch(message => {
			Toast.show(message, Toast.durations.SHORT);
		})
	}, []);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={searchTerm}
                onChangeText={handleSearch}
                placeholder="Search..."
            />
            {isDropdownVisible && (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => `search_result${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelect(item)} style={{padding: 10, borderBottomWidth: 1}}>
                            <Text style={{ fontWeight: "bold" }}>
                                {item.placePrediction.structuredFormat.mainText.text}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ width: 0, flex: 1, flexWrap: "wrap" }}>
                                    {item.placePrediction.structuredFormat.secondaryText.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={styles.dropdown}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 45, // Adjust based on input height
        left: 0,
        right: 0,
        backgroundColor: 'white',
        elevation: 3,
        zIndex: 1,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});

export default SearchDropdown;
