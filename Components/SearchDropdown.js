import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCurrentLocation } from '../Services/Utils';
import Toast from 'react-native-root-toast';
import { searchNearbyPlaces } from '../Services/FetchData';

const SearchDropdown = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [location, setLocation] = useState(null);

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text) {
            console.log(location, text);
            searchNearbyPlaces(location, 5000, text).then(response => {
                console.log(Object.keys(response.data));
                setFilteredData(response.data.results);
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
                        <TouchableOpacity onPress={() => handleSelect(item)}>
                            <Text style={{ fontWeight: "bold" }}>
                                {item.name}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ width: 0, flex: 1, flexWrap: "wrap" }}>
                                    {item.vicinity}
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
