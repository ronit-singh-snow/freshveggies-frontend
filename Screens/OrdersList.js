import { StyleSheet, FlatList, Text, View, Pressable } from 'react-native';
import { AppContext } from '../Services/AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { formatDateToLocaleDateTime } from '../Services/Utils';
import { PriceValue } from '../Components/PriceValue';
import { listOrders } from '../Services/FetchData';
import { colors } from '../Styles';
import { CustomButton } from '../Components/CustomButton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        padding: 20,
        margin: 10,
        gap: 5
    },
    image: {
        width: 64,
        height: 64
    },
    title: {
        fontWeight: "bold"
    },
    cardBackground: {
        backgroundColor: "#FFF",
        borderRadius: 10
    },
    unitPrice: {
        fontWeight: "bold"
    },
    price: {
        flexDirection: "row"
    },
    active: {
        backgroundColor: "#24ca4f",
        color: "#FFF"
    },
    delivered: {
        backgroundColor: "#dbdfe3"
    },
    highlightedText: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignSelf: "flex-start",
        fontWeight: "600"
    },
    cartFooter: {
        marginTop: 5,
        borderTopWidth: 1,
        alignItems: "flex-end",
        borderTopColor: colors.lightGrey,
        flexDirection: "row-reverse",
        gap: 15
    },
    cancelOrderBtn: {
        backgroundColor: "#dc143c",
        color: "#FFF"
    },
    returnOrderBtn: {
        backgroundColor: colors.orange,
        color: "#FFF"
    }
});

export default function OrdersList({ navigation }) {
    const { authData } = useContext(AppContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        listOrders(authData.phone_number).then(res => {
            setOrders(res.data);
        });
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={({ item }) => {
                    return <View style={[styles.row, styles.cardBackground]} >
                        <Pressable onPress={() => {
                            navigation.navigate("OrderItems", {
                                orderId: item.idorder
                            })
                        }} >
                            <Text style={styles.title}>Order ID: {item.idorder}</Text>
                            {item.order_date && item.status === "placed" ? <Text style={styles.unit}>Delivery by: {item.order_date}</Text> : null}
                            {item.delivered_at && item.status === "delivered" ? <Text style={styles.unit}>Delivered at: {item.delivered_at}</Text> : null}
                            <View style={styles.price}>
                                <Text>Total value: </Text>
                                <PriceValue price={item.total_price} />
                            </View>
                            {item.status === "delivered"
                                ? <Text style={[styles.delivered, styles.highlightedText]}>Delivered</Text>
                                : <Text style={[styles.active, styles.highlightedText]}>{item.status}</Text>
                            }
                        </Pressable>
                        <View style={styles.cartFooter}>
                            {item.status === "placed" ? 
                                <View style={{width: "30%"}}>
                                    <CustomButton
                                        title={"Cancel order"}
                                        extraStyles={{
                                            buttonStyle: styles.cancelOrderBtn,
                                            titleStyle: {
                                                fontSize: 12
                                            }
                                        }}
                                        onPress={() => {
                                            console.log("Button pressed")
                                        }}
                                    />
                                </View>
                                : null
                            }
                            {
                                item.status === "delivered" ?
                                    <View style={{width: "30%"}}>
                                        <CustomButton
                                            title={"Return order"}
                                            extraStyles={{
                                                buttonStyle: styles.returnOrderBtn,
                                                titleStyle: {
                                                    fontSize: 12
                                                }
                                            }}
                                            onPress={() => {
                                                console.log("Button pressed")
                                            }}
                                        />
                                    </View>
                                : null
                            }
                            
                        </View>
                    </View>
                }}
            />
        </View>
    );
}

