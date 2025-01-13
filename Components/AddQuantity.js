import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFontSize } from '../Services/Utils';

const AddQuantity = ({ initialQuantity, onQuantityChange, stock }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const handleIncrement = () => {
        if (quantity < stock) { // Check for stock availability (optional) 
            setQuantity(quantity + 1);
            onQuantityChange?.(quantity + 1); // Call external function if provided
        }
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
            onQuantityChange?.(quantity - 1); // Call external function if provided
        }
    };

    const renderAddButton = () => {
        return <TouchableOpacity onPress={handleIncrement}>
            <Text style={styles.addButton}>Add</Text>
        </TouchableOpacity>
    }

    const renderAddQuantity = () => {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={handleDecrement} disabled={quantity === 0}>
                    <Text style={styles.quantityButtons}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={handleIncrement} disabled={quantity > stock}>
                    <Text style={styles.quantityButtons}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {initialQuantity === 0 ? renderAddButton() : renderAddQuantity()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-end",
        justifyContent: "center",
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 15,
        fontSize: getFontSize(18),
    },
    quantityButtons: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: getFontSize(16),
        fontWeight: "bold",
        color: "#FFF",
        backgroundColor: "#24ca4f",
        borderRadius: 10
    },
    addButton: {
        fontWeight: "bold",
        fontSize: getFontSize(16),
        backgroundColor: "#24ca4f",
        borderRadius: 10,
        textAlign: "center",
        paddingVertical: 6,
        paddingHorizontal: 20,
        color: "#FFF"
    }
});

export default AddQuantity;
