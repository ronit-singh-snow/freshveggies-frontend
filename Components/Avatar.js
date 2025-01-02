import React from 'react';
import { View, Text } from 'react-native';

const Avatar = ({ name, size = 40, backgroundColor = '#E0E0E0', color = '#FFF' }) => {
    const initials = name.split(' ')[0][0].toUpperCase();

    const styles = {
        container: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            fontSize: size / 2,
            fontWeight: 'bold',
            color,
        },
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{initials}</Text>
        </View>
    );
};

export default Avatar;
