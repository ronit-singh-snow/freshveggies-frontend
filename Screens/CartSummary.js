import { useContext, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppContext } from "../Services/AppContextProvider";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import AddQuantity from "../Components/AddQuantity";
import {
  cartItemsAndValue,
  getDeliveryDates,
  handleOnQuantityChange,
  isTimeSlotDisabled,
} from "../Services/Utils";
import { PriceValue } from "../Components/PriceValue";
import { DELIVERY_FEE, PLATFORM_FEE } from "../Constants";
import { findUser } from "../Services/FetchData";
import { colors } from "../Styles";
import { DatabaseService } from "../Services/Appwrite/DatabaseService";
import Coupons from "./Coupons";
export default function CartSummary({ navigation, route }) {
  const {
    authData,
    getCart,
    addToCart,
    removeFromCart,
    getSelectedAddress,
    coupons,
    fetchCoupons,
  } = useContext(AppContext);
  const cartItems = getCart();
  let cartItemsValue = cartItemsAndValue(cartItems);
  const selectedAddress = getSelectedAddress();
  const deliveryDates = getDeliveryDates();
  const [selectedDeliveryDateIndex, setSelectedDeliveryDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(1);
  const [userData, setUserData] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [formattedDates, setFormattedDates] = useState([]);

  const [discountValue, setDiscountValue] = useState(0);
  const { selectedCoupon } = route.params || {};
  const cartTotal = cartItemsValue.totalPrice;
  const [nextThresholdMessage, setNextThresholdMessage] = useState("");

  useEffect(() => {
    const totalPrice = cartItemsValue.totalPrice;

    let nextCouponThreshold = null;
    let nextDiscountValue = null;
    let nextCouponCode = null;

    if (totalPrice >= 400) {
      nextCouponThreshold = 400;
      nextDiscountValue = 60;
      nextCouponCode = "NEWYEAR25";
    } else if (totalPrice >= 300) {
      nextCouponThreshold = 400;
      nextDiscountValue = 30;
      nextCouponCode = "NEWYEAR25";
    } else if (totalPrice >= 200) {
      nextCouponThreshold = 300;
      nextDiscountValue = 15;
      nextCouponCode = "SUMMERSALE15";
    }

    if (nextCouponThreshold) {
      const amountToNextThreshold = nextCouponThreshold - totalPrice;
      setNextThresholdMessage(
        ` Add items worth ₹${amountToNextThreshold} more to save ₹${nextDiscountValue} using ${nextCouponCode} `
      );
    } else {
      setNextThresholdMessage("");
    }
  }, [cartItemsValue.totalPrice]);

  console.log("coupon discount: ", coupons);
  useEffect(() => {
    findUser(authData.phone_number.replace("+", " ")).then((response) => {
      if (response.data && response.data.length > 0) {
        setUserData(response.data[0]);
      }
    });
  }, []);
  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    let appliedCoupon = null;

    coupons.forEach((coupon) => {
      if (cartItemsValue.totalPrice >= 400 && 
        coupon.code === "NEWYEAR25") {
        setCouponCode("NEWYEAR25");
        setDiscountValue(25);
        appliedCoupon = true;
      } else if (
        cartItemsValue.totalPrice >= 300 &&
        coupon.code === "SUMMERSALE15"
      ) {
        setCouponCode("SUMMERSALE15");
        setDiscountValue(15);
        appliedCoupon = true;
      } else if (
        cartItemsValue.totalPrice >= 200 &&
        coupon.code === "WELCOME10"
      ) {
        setCouponCode("WELCOME10");
        setDiscountValue(10);
        appliedCoupon = true;
      }
    });

    if (!appliedCoupon) {
      setCouponCode("");
      setDiscountValue(0);
    }
  }, [cartItemsValue.totalPrice, coupons]);

  const totalAmount = cartItemsValue.totalPrice + DELIVERY_FEE + PLATFORM_FEE;
  // const discountAmount = (cartItemsValue.totalPrice * discountValue) / 100;
  const discountAmount = Math.min(
    (cartItemsValue.totalPrice * discountValue) / 100,
    coupons.find((coupon) => coupon.code === couponCode)?.maxDiscount ||
      Infinity
  );

  const finalAmount = totalAmount - discountAmount;
  cartItemsValue.grandTotalPrice = finalAmount;

  const getAddress = () => {
    if (!selectedAddress)
      return (
        <View>
          <Text style={{ fontWeight: 500 }}>Deliver to: </Text>
          <Text style={{ color: "#777" }}>
            {userData?.username}{" "}
            {userData?.phone_number ? " | " + userData.phone_number : ""}{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddAddress")}
            style={styles.selectAddress}
          >
            <Image
              source={require("../assets/images/location_pin.png")}
              style={styles.locationPin}
            />
            <Text style={styles.changeAddress}>Select a delivery address</Text>
          </TouchableOpacity>
        </View>
      );
    return (
      <>
        <View style={styles.deliveryHeader}>
          <Text>Deliver to address: </Text>
          <Text style={styles.addressType}>{selectedAddress.type}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddAddress")}
            style={styles.changeAddr}
          >
            <Text style={styles.changeAddress}>Change</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: "#777" }}>
          {authData?.name}{" "}
          {authData?.phone_number ? " | " + authData.phone_number : ""}{" "}
        </Text>
        <Text style={{ color: "#777" }}>{selectedAddress.full_address}</Text>
      </>
    );
  };

  const slot1Disabled = isTimeSlotDisabled(
    deliveryDates[selectedDeliveryDateIndex].dateObj,
    9
  );
  const slot2Disabled = isTimeSlotDisabled(
    deliveryDates[selectedDeliveryDateIndex].dateObj,
    20
  );

  if (slot1Disabled && !slot2Disabled && selectedTimeSlot == 1)
    setSelectedTimeSlot(2);
  const slot1BgColor = slot1Disabled
    ? "#e5e5e5bd"
    : selectedTimeSlot == 1
    ? "#75da7c"
    : "#e5e5e5";
  const slot2BgColor = slot2Disabled
    ? "#e5e5e5bd"
    : selectedTimeSlot == 2
    ? "#75da7c"
    : "#e5e5e5";

  console.log(
    (slot1Disabled && slot2Disabled) ||
      !selectedAddress ||
      cartItemsValue.totalPrice < 150
  );

  if (cartItemsValue.count > 0) {
    return (
      <View style={styles.summaryWrapper}>
        <ScrollView style={styles.summaryContainer}>
          <Text style={styles.myCartText}>
            My cart ({cartItemsValue.count}{" "}
            {cartItemsValue.count === 1 ? "item" : "items"})
          </Text>
          {cartItems.map((item, index) => {
            return (
              <View
                style={[styles.container, styles.cardBackground]}
                key={index}
              >
                <Image
                  style={styles.image}
                  source={item.item.img}
                  contentFit="cover"
                  transition={1000}
                />
                <View>
                  <Text style={styles.title}>{item.item.title}</Text>
                  <Text style={styles.unit}>{item.item.unit}</Text>
                  <PriceValue price={item.item.unitPrice} />
                </View>
                <View style={styles.listActions}>
                  <AddQuantity
                    stock={5}
                    initialQuantity={item.quantity}
                    onQuantityChange={(quantity) => {
                      quantity === 0
                        ? removeFromCart(item.item.$id)
                        : addToCart(item.item, quantity);
                    }}
                  />
                  <PriceValue price={item.item.unitPrice * item.quantity} />
                </View>
              </View>
            );
          })}

          <View style={styles.cardBackground}>
            <Text>Select delivery date</Text>
            <View style={styles.datesContainer}>
              {deliveryDates.map((date, index) => {
                const bgColor =
                  selectedDeliveryDateIndex === index ? "#75da7c" : "#e5e5e5";
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDeliveryDateIndex(index)}
                  >
                    <View
                      style={{
                        ...styles.deliveryDates,
                        backgroundColor: bgColor,
                      }}
                    >
                      <Text style={styles.deliveryDatesDay}>{date.day}</Text>
                      <Text style={styles.deliveryDatesDay}>{date.date}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text>Select delivery time slot</Text>
            <View style={styles.slotBtnContainer}>
              <Pressable
                onPress={() => setSelectedTimeSlot(1)}
                disabled={slot1Disabled}
              >
                <Text
                  style={{
                    ...styles.slotBtn,
                    backgroundColor: slot1BgColor,
                    opacity: slot1Disabled ? 0.4 : 1,
                  }}
                >
                  6AM - 9AM
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedTimeSlot(2)}
                disabled={slot2Disabled}
              >
                <Text
                  style={{
                    ...styles.slotBtn,
                    backgroundColor: slot2BgColor,
                    opacity: slot2Disabled ? 0.4 : 1,
                  }}
                >
                  5PM - 8PM
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.cardBackground}>
            <View style={styles.card}>
              <View style={styles.details}>
                <Text style={styles.title}>
                  Flat ₹{discountAmount} Unlocked
                </Text>
                <Text style={styles.subtitle}>Apply code {couponCode}</Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("Coupons", { couponCode })}
              >
                <Text style={styles.seeAll}>See all coupons ></Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardBackground}>
            {getAddress(selectedAddress, navigation, userData)}
          </View>
          <View style={styles.cardBackground}>
            <View style={styles.summaryKeyMap}>
              <Text>Item total</Text>
              <PriceValue price={cartItemsValue.totalPrice} />
            </View>
            <View style={styles.summaryKeyMap}>
              <Text>Delivery fee</Text>
              <PriceValue price={DELIVERY_FEE} />
            </View>
            <View style={styles.summaryKeyMap}>
              <Text>Platform fee</Text>
              <PriceValue price={PLATFORM_FEE} />
            </View>
            <View style={styles.summaryKeyMap}>
              <Text>Discount</Text>
              <PriceValue price={discountAmount} />
            </View>
            <View style={styles.summaryKeyMap}>
              <Text>Grand total</Text>
              <PriceValue
                price={cartItemsValue.grandTotalPrice}
                // price={cartItemsValue.totalPrice + DELIVERY_FEE + PLATFORM_FEE}
              />
            </View>
          </View>
        </ScrollView>
        {cartItemsValue.totalPrice < 150 ? (
          <Text style={styles.warningMessage}>
            Add items worth {150 - cartItemsValue.totalPrice} to place the
            order.
          </Text>
        ) : null}
        {nextThresholdMessage ? (
          <Text style={styles.nextThresholdMessage}>
            {nextThresholdMessage}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.payBtn,
              (slot1Disabled && slot2Disabled) ||
              !selectedAddress ||
              cartItemsValue.totalPrice < 150
                ? styles.payBtnDisabled
                : "",
            ]}
            disabled={
              (slot1Disabled && slot2Disabled) ||
              !selectedAddress ||
              cartItemsValue.totalPrice < 150
            }
            onPress={() => {
              navigation.navigate("OrderSummary", {
                items: cartItems,
                itemValue: cartItemsValue,
                address: selectedAddress.idaddress,
                date: deliveryDates[
                  selectedDeliveryDateIndex
                ].dateObj.getTime(),
                timeslot: selectedTimeSlot,
              });
            }}
          >
            <Text style={styles.btn}>Pay</Text>
          </Pressable>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.emptyCart}>
        <Text>There are no items added into the cart</Text>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={styles.pillButton}>Continue adding item</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryWrapper: {
    flex: 1,
  },
  pillButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    margin: 10,
    backgroundColor: "#24ca4f",
    borderRadius: 10,
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  myCartText: {
    marginHorizontal: 15,
    fontSize: 18,
  },
  summaryContainer: {
    flex: 1,
    margin: 10,
  },
  container: {
    flexDirection: "row",
    padding: 15,
    gap: 15,
    alignItems: "center",
  },
  cardBackground: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  footer: {
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
    marginTop: "auto",
    marginBottom: 10,
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#32cd32",
    borderRadius: 10,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 64,
    height: 64,
  },
  title: {
    fontWeight: "bold",
  },
  listActions: {
    marginLeft: "auto",
    alignItems: "flex-end",
  },
  summaryKeyMap: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressType: {
    fontWeight: "bold",
  },
  deliveryHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  changeAddress: {
    color: "blue",
  },
  changeAddr: {
    marginLeft: "auto",
    alignSelf: "flex-end",
  },
  datesContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 15,
    marginVertical: 10,
  },
  deliveryDates: {
    width: 50,
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    color: "#FFF",
  },
  slotBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: "#e5e5e5",
  },
  slotBtnContainer: {
    marginTop: 5,
    flexDirection: "row",
    gap: 15,
  },
  selectAddress: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  locationPin: {
    width: 18,
    height: 18,
  },
  payBtn: {
    width: "100%",
  },
  payBtnDisabled: {
    opacity: 0.4,
  },
  warningMessage: {
    color: colors.warningMessage,
    paddingHorizontal: 20,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  nextThresholdMessage: {
    color: colors.warningMessage,
    paddingHorizontal: 20,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  applyBtn: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  couponSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  couponText: {
    color: "#333",
    fontWeight: "bold",
  },
  viewCouponsText: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  card: {
    borderRadius: 10,
  },
  details: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  seeAll: {
    fontSize: 14,
    color: "#0288d1",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
});
