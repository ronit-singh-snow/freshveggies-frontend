import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { DatabaseService } from "../Services/Appwrite/DatabaseService";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const databaseService = new DatabaseService();

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
  

 

  const handleCouponSelect = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Coupons</Text>
      <FlatList
        data={coupons}
        renderItem={({ item }) => {
          const validDate = item.expiryDate.split("T")[0];
          return (
            <TouchableOpacity onPress={() => handleCouponSelect(item)}>
              <View
                style={[
                  styles.couponContainer,
                  item.code === appliedCouponCode && styles.highlightedCoupon,
                ]}
              >
                <Text style={styles.couponDiscount}>Get {item.discount}% off</Text>
                <Text style={styles.couponCode}>Use code {item.code}</Text>

                <View style={styles.separator}></View>

                <Text style={styles.offerDetails}>
                  This offer is eligible for orders above 
                  <Text style={styles.highlight}> ₹{item.minOrderValue}</Text>.  
                  Offer expires on <Text style={styles.expiry}>{validDate}</Text>. Hurry up!
                </Text>

                {item.code === appliedCouponCode && (
                  <Text style={styles.appliedText}>Applied</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => {
          return item.$id;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
  couponCode: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
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
});

export default Coupons;
