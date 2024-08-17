import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import Card from '../Components/Card.js';
import Header from "../Components/Header.js";
import Carousel from '../Components/Carousel.js';
import { Footer } from '../Components/Footer.js';
import { formatFruits, getResourceURL } from '../Services/Utils.js';
import { homepageDetails } from '../Services/FetchData.js';

export default function Home({ navigation }) {
    const [banners, setBanners] = useState([]);
    const [downSections, setDownsections] = useState([]);

    const renderItem = (item) => {
        return <Card item={item} key={`product_${item.id}`} clickHandler={() => {
            navigation.navigate("FruitDetails", {
                item
            })
        }} />;
    }  

    useEffect(() => {
        homepageDetails().then(response => {
            let bannersData = response?.data.banners.map((banner, index) => {
                banner.id = `banner_${index}`;
                banner.type = "banner";
                banner.img = {
                    uri: getResourceURL(banner.imageSource)
                };
                cardWidthRatio = 1;

                return banner;
            });

            setBanners(bannersData);

            setDownsections(response?.data.downSections);
        })
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <StatusBar style="auto" />
                <Header />
                
                {/* Banner */}
                <Carousel 
                    data={banners}
                    loop={false}
                    renderItem={(item) => {
                        return <Card item={item} clickHandler={(item) => {
                            console.log(item);
                            navigation.navigate("ListItems", {
                                title: item.title,
                                query: item.query
                            });
                        }} key={`product_${item.id}`} />
                    }}
                />
                
                {downSections ? downSections.map((section, index) => {
                    return (<View key={`${section.title.replaceAll(" ", "")}_${index}`}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.header}>{section.title}</Text>
                                    <Text onPress={() => navigation.navigate("ListItems", {
                                        dataItems: section.data,
                                        title: section.title,
                                        query: section.query
                                    })} style={styles.textLink} >See all</Text>
                                </View>
                                <Carousel data={formatFruits(section.data)} renderItem={renderItem} loop={false} />
                            </View>);
                }) : null}
                
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