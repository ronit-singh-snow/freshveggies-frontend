import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DatabaseService } from "../Services/Appwrite/DatabaseService";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const navigation = useNavigation();
  const databaseService = new DatabaseService();

  // Fetch all available coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const allCoupons = await databaseService.getAllCoupons();
        setCoupons(allCoupons);
      } catch (error) {
        console.log("Error", "Failed to fetch coupons. Please try again.");
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      console.log("Error", "Please select a coupon.");
      return;
    }

    try {
      const discount = await databaseService.validateCoupon(selectedCoupon.code);

      if (discount) {
        console.log(`Coupon Applied: ${selectedCoupon.code}\nDiscount: ₹${discount}`);
        console.log(`Coupon Details: ${JSON.stringify(selectedCoupon, null, 2)}`);
        navigation.navigate("CartSummary", { selectedCoupon });
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      console.log("Error", "Failed to validate coupon. Please try again.");
    }
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    console.log(`Selected coupon: ${coupon.code} - Discount: ${coupon.discount}%`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Coupons</Text>
      <FlatList
        data={coupons}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.couponContainer,
              selectedCoupon?.$id === item.$id && styles.selectedCoupon,
            ]}
            onPress={() => handleCouponSelect(item)}
          >
            <Text style={styles.couponTitle}>{item.title}</Text>
            <Text style={styles.couponSubtitle}>{item.subtitle}</Text>
            <Text style={styles.couponCode}>{item.code}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.$id}
      />

      <TouchableOpacity
        style={[
          styles.applyButton,
          !selectedCoupon && { backgroundColor: "#ccc" },
        ]}
        onPress={handleApplyCoupon}
        disabled={!selectedCoupon}
      >
        <Text style={styles.applyButtonText}>APPLY COUPON</Text>
      </TouchableOpacity>
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
  },
  selectedCoupon: {
    borderColor: "#007AFF",
  },
  couponTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  couponSubtitle: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },
  couponCode: {
    fontSize: 12,
    color: "#007AFF",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Coupons;
