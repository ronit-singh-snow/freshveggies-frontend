import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AppContext } from '../Services/AppContextProvider';
import { DatabaseService } from "../Services/Appwrite/DatabaseService";
import { validateCoupon } from "../Services/FetchData";
import Toast from "react-native-root-toast";
const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState("");
    const route = useRoute();
    const navigation = useNavigation();
    const databaseService = new DatabaseService();
    const { authData } = useContext(AppContext);

    const cartPrice = route.params?.totalPrice || 0;
    const appliedCouponCode = route.params?.couponCode || null;

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const validCoupons = await databaseService.getAllCoupons();
                setCoupons(validCoupons);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        };

        fetchCoupons();
    }, []);

    const handleCouponSelect = async (coupon) => {
       
        try {
            const response = await validateCoupon(authData.user_token, coupon, cartPrice);
            if (response.data && response.data.status === "error") {
                Toast.show(response.data.message, Toast.durations.LONG);
            } else {
                navigation.navigate('CartSummary', {
                    selectedCoupon: {
                        code: coupon.code,
                        discount: coupon.discount,
                        maxDiscount: response.data.maxDiscount,
                    },
                });
            }

        } catch (error) {
            setError(error.message);
        }
    };


    const renderCoupon = (coupon) => {
        const expiryDate = coupon.expiry_date.split("T")[0];
        const isNotApplicable = coupon.min_purchase_amount > cartPrice;
        return (
            <View
                style={[
                    styles.couponContainer,
                    coupon.code === appliedCouponCode && styles.highlightedCoupon,
                ]}
            >
                <Text style={styles.couponDiscount}>Get {coupon.discount_value}% off</Text>

                <View style={styles.couponDetailsContainer}>
                    <Text style={styles.couponCode}>Use code {coupon.code}</Text>

                    <TouchableOpacity
                        onPress={() => handleCouponSelect(coupon)}
                        style={[styles.applyButton,
                            isNotApplicable && styles.disabledButton,

                        ]}
                        disabled={isNotApplicable}

                    >
                        <Text style={[styles.applyButtonText,  isNotApplicable && { color: "#333" },]}>Apply</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator}></View>

                <Text style={styles.offerDetails}>
                    This offer is eligible for orders above
                    <Text style={styles.highlight}> ₹{coupon.min_purchase_amount}</Text>.
                    Offer expires on <Text style={styles.expiry}>{expiryDate}</Text>. Hurry up!
                </Text>

                {coupon.code === appliedCouponCode && (
                    <Text style={styles.appliedText}>Applied</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={coupons}
                renderItem={({ item }) => renderCoupon(item)}
                keyExtractor={(item) => item.$id}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    disabledButton: {
        backgroundColor: "white", 
        borderColor: "#C0C0C0",  
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    couponContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#F9F9F9",
    },
    highlightedCoupon: {
        borderColor: "#007AFF",
        backgroundColor: "#E0F7FA",
    },
    couponDiscount: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#666",
        marginVertical: 4,
    },
    couponDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
    },
    couponCode: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#007AFF",
    },
    applyButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#32cd32", 
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#B0B0B0", 
        marginTop: -4, 
    },
    applyButtonText: {
        color: "#FFF", 
        fontWeight: "bold",
        fontSize: 12,
    },
    separator: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 8,
    },
    offerDetails: {
        fontSize: 12,
        color: "#333",
    },
    highlight: {
        fontWeight: "bold",
        color: "#007AFF",
    },
    expiry: {
        fontStyle: "italic",
        color: "#FF0000",
    },
    appliedText: {
        marginTop: 8,
        fontSize: 12,
        color: "#28A745",
        fontWeight: "bold",
    },
    errorText: {
        color: "#FF0000",
        marginTop: 10,
        textAlign: "center",
    },
});

export default Coupons;
