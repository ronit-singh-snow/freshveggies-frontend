import { Button, Pressable, StyleSheet, Text } from "react-native"

const PillButton = ({item, clickHandler}) => {
    const {title, isSelected} = item;
    
    const selectedStyle = isSelected ? {
        backgroundColor: "#ffffe0"
    } : null;
    
    return( 
        <Pressable onPress={clickHandler.bind(null, item)} style={[styles.pillButton, selectedStyle]}>
            <Text style={styles.textStyle}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    pillButton: {
        borderColor: "#FFBF34",
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 10,
        width: 60
    },
    textStyle: {
        color: "#4caf50",
        textAlign: "center"
    }
})

export default PillButton;