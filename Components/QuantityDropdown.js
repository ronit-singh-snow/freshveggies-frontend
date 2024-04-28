import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const QuantityDropdown = ({ initialQuantity, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(initialQuantity || 1); // Default to 1
    const [selectedValue, setSelectedValue] = useState('java');
    const quantityValues = [1, 2, 3, 4, 5]; // Array of possible quantities

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
        onQuantityChange?.(newQuantity); // Call external function if provided
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.quantityLabel}>Quantity:</Text> */}
            <TouchableOpacity style={styles.dropdownButton}>
                <Picker
                    selectedValue={selectedValue}
                    style={{ height: 50, width: 150 }}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="100 gm" value={100} key="100gm" />
                    <Picker.Item label="250 gm" value={250} key="250gm" />
                    <Picker.Item label="500 gm" value={500} key="500gm" />
                    <Picker.Item label="1 kg" value={1000} key="1kg" />
                </Picker>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityLabel: {
        // marginRight: 10,
    },
    dropdownButton: {
        // padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
    },
});

export default QuantityDropdown;
