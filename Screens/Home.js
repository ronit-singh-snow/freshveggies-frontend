import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Card from '../Components/Card.js';
import Header from "../Components/Header.js";
import Carousel from '../Components/Carousel.js';
import { formatFruits, getResourceURL } from '../Services/Utils.js';
import { getFruits, getVegetables } from '../Services/FetchData.js';
import { useContext, useEffect, useState } from 'react';


const avatarImage = require('../assets/images/avatar.png');


export default function Home({ navigation }) {
    const data = [
        { id: 1, type: "banner", title: 'Apple', img: { uri: getResourceURL("/static/images/banner_image_1.jpg") }, cardWidthRatio: 1 },
        { id: 2, type: "banner", title: 'Bell pepper', img: { uri: getResourceURL("/static/images/banner_image_2.jpg") }, cardWidthRatio: 1 }
    ];

    const [seasonalItems, setSeasonalItems] = useState();
    const [seasonalVegetableItems, setSeasonalVegetableItems] = useState();

    const renderItem = (item) => {
        return <Card item={item} />;
    }

    useEffect(() => {
        getFruits().then((response) => {
            setSeasonalItems(formatFruits(response.data));
        });
        getVegetables().then((response) => {
            setSeasonalVegetableItems(formatFruits(response.data));
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <StatusBar style="auto" />
                <Header />
                <Carousel data={data} renderItem={renderItem} loop={false} />
                <View style={styles.sectionHeader}>
                    <Text style={styles.header}>Seasonal fruits</Text>
                    <Text style={styles.textLink} >See all</Text>
                </View>
                <Carousel data={seasonalItems} renderItem={renderItem} loop={false} />

                <View style={styles.sectionHeader}>
                    <Text style={styles.header}>Fresh vegetables</Text>
                    <Text onPress={() => navigation.navigate("ListItems")} style={styles.textLink}>See all</Text>
                </View>
                <Carousel data={seasonalVegetableItems} renderItem={renderItem} loop={false} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 12,
        alignItems: "center"
    },
    header: {
        fontSize: 24
    },
    textLink: {
        color: "#0000EE",
        fontWeight: "bold"
    }
});