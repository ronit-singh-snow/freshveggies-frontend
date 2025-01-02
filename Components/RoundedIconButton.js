import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RoundedIconButton = ({ onPress, title, source, buttonColor, textColor }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        {source ? <Image style={styles.iconSize} source={source} /> : null}
      </View>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, // Rounded border
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 1, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconContainer: {
    // marginRight: 10,
  },
  iconSize: {
    width: 12,
    height: 12
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoundedIconButton;
