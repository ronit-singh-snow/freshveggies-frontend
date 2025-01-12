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
	View
} from "react-native";
import AddQuantity from "../Components/AddQuantity";
import {
	cartItemsAndValue,
	getDeliveryDates,
	getGSTAmount,
	isTimeSlotDisabled,
} from "../Services/Utils";
import { PriceValue } from "../Components/PriceValue";
import { colors } from "../Styles";
import { validateCoupon } from "../Services/FetchData";
import Toast from "react-native-root-toast";

export default function CartSummary({ navigation, route }) {
	const {
		authData,
		getCart,
		addToCart,
		removeFromCart,
		getSelectedAddress,
		envVariables
	} = useContext(AppContext);
	
	const cartItems = getCart();
	let cartItemsValue = cartItemsAndValue(cartItems);

	const {selectedCouponCode} = route.params || {};

	const selectedAddress = getSelectedAddress();
	const deliveryDates = getDeliveryDates();
	const [selectedDeliveryDateIndex, setSelectedDeliveryDateIndex] = useState(0);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState(1);
	
	const [selectedCoupon, setSelectedCoupon] = useState();
	
	const [nextThresholdMessage, setNextThresholdMessage] = useState("");
	
	const validateSelectedCoupon = async () => {
		let couponCode = selectedCouponCode || selectedCoupon?.code;
		if (!couponCode)
			return;
		try {
			const response = await validateCoupon(authData.user_token, couponCode, cartItemsValue.totalPrice);
			if (response.data && response.data.status === "error") {
				Toast.show(response.data.message, Toast.durations.LONG);
				setSelectedCoupon({...selectedCoupon, maxDiscount: 0});
			} else {
				setSelectedCoupon({
					code: couponCode,
					maxDiscount: response.data.maxDiscount,
				});
			}
		} catch (error) {
			console.log(JSON.stringify(error));
			Toast.show("Error occurred while appying the coupon", Toast.durations.LONG);
		}
	}

	useEffect(() => {
		console.log("cart updated");
		validateSelectedCoupon();
	}, [cartItemsValue.totalPrice])


	useEffect(() => {
		validateSelectedCoupon();
	}, [selectedCouponCode]);

	const gstAmount = getGSTAmount(cartItems);

	const totalAmount = cartItemsValue.totalPrice + (parseInt(envVariables.APP_DELIVERY_FEE) || 0) + (parseInt(envVariables.APP_PLATFORM_FEE) || 0) + gstAmount;

	cartItemsValue.grandTotalPrice = totalAmount - (selectedCoupon?.maxDiscount || 0);;

	const getAddress = () => {
		if (!selectedAddress)
			return (
				<View>
					<Text style={{ fontWeight: 500 }}>Deliver to: </Text>
					<Text style={{ color: "#777" }}>
						{authData?.name}{" "}
						{authData?.phone_number ? " | " + authData.phone_number : ""}{" "}
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

	const getWarningMessage = () => {
		if (cartItemsValue.totalPrice < 150)
			return "Add items worth ₹" + (150 - cartItemsValue.totalPrice) + " to proceed with the payment."
		else if (!selectedAddress) 
			return "Select a delivery address to proceed with the payment.";
		else return "";
	}

	if (slot1Disabled && !slot2Disabled && selectedTimeSlot == 1)
		setSelectedTimeSlot(2);
	const slot1BgColor = slot1Disabled ? "#e5e5e5bd" : (selectedTimeSlot == 1 ? "#75da7c" : "#e5e5e5");
	const slot2BgColor = slot2Disabled ? "#e5e5e5bd" : (selectedTimeSlot == 2 ? "#75da7c" : "#e5e5e5");


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
										stock={10}
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
									{selectedCoupon
										? `You saved ₹${selectedCoupon.maxDiscount} with ${selectedCoupon.code}`
										: `Select a coupon code`
									}
								</Text>
								{selectedCoupon
									? (<Pressable onPress={() => {
											setSelectedCoupon(null);
										}}>
											<Text style={styles.removeCoupon}>Remove</Text>
										</Pressable>)
									:  null
								}
								
							</View>

							<Pressable
								onPress={() => navigation.navigate("Coupons", { 
									couponCode: selectedCoupon?.code,
									totalPrice: cartItemsValue.totalPrice,
								})}
							>
								<Text style={styles.seeAll}>See all coupons</Text>
							</Pressable>
						</View>
					</View>

					<View style={styles.cardBackground}>
						{getAddress()}
					</View>
					<View style={styles.cardBackground}>
						<View style={styles.summaryKeyMap}>
							<Text>Item total</Text>
							<PriceValue price={cartItemsValue.totalPrice} />
						</View>
						<View style={styles.summaryKeyMap}>
							<Text>Delivery fee</Text>
							<PriceValue price={envVariables.APP_DELIVERY_FEE || 0} />
						</View>
						<View style={styles.summaryKeyMap}>
							<Text>Platform fee</Text>
							<PriceValue price={envVariables.APP_PLATFORM_FEE || 0} />
						</View>
						<View style={styles.summaryKeyMap}>
							<Text>Discount</Text>
							<PriceValue price={selectedCoupon?.maxDiscount || 0} />
						</View>
						<View style={styles.summaryKeyMap}>
							<Text>GST</Text>
							<PriceValue price={gstAmount} />
						</View>
						<View style={styles.summaryKeyMap}>
							<Text>Grand total</Text>
							<PriceValue
								price={cartItemsValue.grandTotalPrice}
							/>
						</View>
					</View>
				</ScrollView>
				<Text style={styles.warningMessage}>{getWarningMessage()}</Text>
				{nextThresholdMessage ? (
					<Text style={styles.nextThresholdMessage}>
						{nextThresholdMessage}
					</Text>
				) : null}

				<View style={styles.footer}>
					<Text></Text>
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
								couponCode: selectedCoupon?.code,
								discountValue: selectedCoupon?.maxDiscount || 0,
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
	removeCoupon: {
		backgroundColor: colors.warningMessage,
		color: "#FFF",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5
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
		flexDirection: "row",
		justifyContent: "space-between"
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