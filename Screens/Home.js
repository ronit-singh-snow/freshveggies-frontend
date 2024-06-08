import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import Card from '../Components/Card.js';
import Header from "../Components/Header.js";
import Carousel from '../Components/Carousel.js';
import { Footer } from '../Components/Footer.js';
import { formatFruits, getResourceURL } from '../Services/Utils.js';
import { getFruits, getVegetables } from '../Services/FetchData.js';

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
            <ScrollView style={{flex: 1}}>
                <StatusBar style="auto" />
                <Header />
                <Carousel data={data} renderItem={renderItem} loop={false} />
                <View style={styles.sectionHeader}>
                    <Text style={styles.header}>Seasonal fruits</Text>
                    <Text onPress={() => navigation.navigate("ListItems", {
                        dataItems: seasonalItems,
                        title: "Seasonal Fruits"
                    })} style={styles.textLink} >See all</Text>
                </View>
                <Carousel data={seasonalItems ? seasonalItems.slice(0,3) : []} renderItem={renderItem} loop={false} />

                <View style={styles.sectionHeader}>
                    <Text style={styles.header}>Fresh vegetables</Text>
                    <Text onPress={() => navigation.navigate("ListItems", {
                        dataItems: seasonalVegetableItems,
                        title: "Seasonal vegetables"
                    })} style={styles.textLink}>See all</Text>
                </View>
                <Carousel data={seasonalVegetableItems ? seasonalVegetableItems.slice(0,3) : []} renderItem={renderItem} loop={false} />
            </ScrollView>
            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 12,
        alignItems: "center",
        marginTop: 25
    },
    header: {
        fontSize: 24
    },
    textLink: {
        color: "#0000EE",
        fontWeight: "bold"
    }
});