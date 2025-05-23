import { APPWRITE_URL, COLLECTIONS, DB_NAME, PROJECT_ID } from "./Config";
import { Client, ID, Databases, Query } from "react-native-appwrite";
export class DatabaseService {
    client = new Client();
    account;

    constructor() {
        this.client.setEndpoint(APPWRITE_URL).setProject(PROJECT_ID);

        this.database = new Databases(this.client);
    }

    parseExpression(expression) {
        if (!expression) return "";
        // Split the expression into key-value pairs
        const pairs = expression.split(" ");

        return pairs.map((pair) => {
            let separater = "";
            const [key, value] = pair.split("=");

            if (pair.includes("=")) separater = "=";
            else if (pair.includes("<")) separater = "<";
            else if (pair.includes(">")) separater = ">";

            let generatedQuery;
            switch (separater) {
                case "=":
                    generatedQuery = Query.equal(key, value.split(","));
                    break;
                case "<":
                    break;
                case ">":
                    break;
                default:
                    generatedQuery = Query.equal(key, value.split(","));
            }

            return generatedQuery;
        });
    }

    async getProducts(query) {
        try {
            let parsedQuery = this.parseExpression(query);
            let results = {};
            if (!parsedQuery)
                results = await this.database.listDocuments(
                    DB_NAME,
                    COLLECTIONS.PRODUCT
                );
            else
                results = await this.database.listDocuments(
                    DB_NAME,
                    COLLECTIONS.PRODUCT,
                    parsedQuery
                );

            return results.documents;
        } catch (err) {
            console.log(err);
        }
    }

    async searchProducts(text, category) {
        try {
            let query = [];
            if (text)
                query.push(Query.contains("name", text));
            if (category)
                query.push(Query.equal("category", category));

            let result = await this.database.listDocuments(
                DB_NAME,
                COLLECTIONS.PRODUCT,
                query
            );

            return result.documents;
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    async submitOrder(userId, orderData) {
        try {
            const orderDate = new Date().toISOString(); 

            orderData.date = orderDate;
            orderData.orderCreate = orderDate;
            const orderResult = await this.database.createDocument(
                DB_NAME,
                COLLECTIONS.ORDER,
                ID.unique(),
                {
                    user_id: userId,
                    order_date: orderData.date,
                    status: orderData.status,
                    order_create_at: orderData.orderCreate,
                    total_price: orderData.totalPrice,
                    timeslot: orderData.timeslot,
                    address: orderData.address,
                    delivered_at: orderData.date,
                    coupon: orderData.coupon,
                    discount: orderData.discount,
                    item_price: orderData.itemPrice,
                    razorpay_payment_id: orderData?.razorpay_payment_id,
                    razorpay_order_id: orderData?.razorpay_order_id,
                    razorpay_signature: orderData?.razorpay_signature
                }
            );

            (orderData.items || []).forEach((item) => {
                this.database.createDocument(
                    DB_NAME,
                    COLLECTIONS.ORDER_ITEM,
                    ID.unique(),
                    {
                        order_id: orderResult.$id,
                        product_id: item.productId,
                        quantity: item.quantity,
                    }
                );
            });

            return orderResult;
        } catch (error) {
            console.log("Error while inserting Order or Order Items", error);
        }
    }

    async listOrders(userId) {
        try {
            const response = await this.database.listDocuments(
                DB_NAME,
                COLLECTIONS.ORDER,
                [Query.equal("user_id", userId)]
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching orders: ", error);
            return [];
        }
    }

    async getOrderItems(orderId) {
        try {
            const response = await this.database.listDocuments(
                DB_NAME,
                COLLECTIONS.ORDER_ITEM,
                [Query.equal("order_id", orderId)]
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching order items: ", error);
        }
    }

    async insertAddresses(userId, addressData) {
        try {
            return await this.database.createDocument(
                DB_NAME,
                COLLECTIONS.ADDRESS,
                ID.unique(),
                {
                    user_id: userId,
                    name: addressData.name,
                    type: addressData.type,
                    locality: addressData.locality,
                    full_address: addressData.full_address,
                    apartment_name: addressData.apartmentName,
                    email: addressData.email,
                    zip_code: addressData.zip_code,
                    phone_number: addressData.phone_number,
                }
            );
        } catch (error) {
            console.error("Error adding address:", error);
        }
    }

    async updateOrder(orderId, updatedData) {
        try {
            const response = await this.database.updateDocument(
                DB_NAME,
                COLLECTIONS.ORDER,
                orderId,
                updatedData
            );
            return response;
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    }

    async getOrderById(orderId) {
        try {
            const response = await this.database.getDocument(
                DB_NAME,
                COLLECTIONS.ORDER,
                orderId
            );
            return response;
        } catch (error) {
            console.error("Error fetching order by ID:", error);
            throw error;
        }
    }

    async fetchAddresses(userId) {
        let query = [];
        if (userId)
            query = [Query.equal("user_id", userId)];

        try {
            const response = await this.database.listDocuments(
                DB_NAME,
                COLLECTIONS.ADDRESS,
                query
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching addresses:", error);
            return [];
        }
    }

  
    async deleteAddress(documentId) {
        try {
            await this.database.deleteDocument(
                DB_NAME,
                COLLECTIONS.ADDRESS,
                documentId);
        } catch (error) {
            console.error("Error deleting document:", error);
            throw error;
        }
    }

    async updateAddress(addressId, updatedData) {
        try {
            const response = await this.database.updateDocument(
                DB_NAME,
                COLLECTIONS.ADDRESS,
                addressId,
                updatedData
            );
            return response;
        } catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    }
    async getAllCoupons() {
        try {
            const currentDate = new Date().toISOString();
            const response = await this.database.listDocuments(
                DB_NAME,
                COLLECTIONS.COUPON,
                [Query.greaterThan("expiry_date", currentDate)]
            );

            return response.documents;
        } catch (error) {
            console.error("Error fetching coupons:", error);
            throw error;
        }
    }

    async updatePaymentId(orderId, paymentId) {
        try {
            await this.database.updateDocument(
                DB_NAME,
                COLLECTIONS.ORDER,
                orderId,
                {
                    "payment_id": paymentId
                }
            );

            return "success";
        } catch(err) {
            console.log("error");
            return "error";
        }
    }

    async validateCoupon(couponCode, userId = null) {
        try {
            const response = await this.database.listDocuments(
                DB_NAME,
                COLLECTIONS.COUPON,
                [Query.equal("code", couponCode)]
            );

            if (response.documents.length === 0) {
                throw new Error("Invalid coupon code.");
            }

            const coupon = response.documents[0];

            if (new Date(coupon.expiry_date) < new Date()) {
                throw new Error("This coupon has expired.");
            }

            if (coupon.single_use && userId) {
                const orderResponse = await this.database.listDocuments(
                    DB_NAME,
                    COLLECTIONS.ORDER,
                    [
                        Query.equal("coupon", couponCode),
                        Query.equal("user_id", userId),
                    ]
                );

                if (orderResponse.documents.length > 0) {
                    throw new Error("You have already used this coupon.");
                }
            }

            return coupon.max_discount_amount;
        } catch (error) {
            console.error("Error validating coupon:", error);
            throw error;
        }
    }

    async getUserDefaultAddress(userId) {
        const response = await this.database.listDocuments(
            DB_NAME,
            COLLECTIONS.ADDRESS,
            [
                Query.equal("is_default", 1),
                Query.equal("user_id", userId),
            ]
        );

        return response.documents;
    }

    async getApiKeys() {
        let result = await this.database.listDocuments(
            DB_NAME,
            COLLECTIONS.SECRET_KEYS
        );

        if (result && result.total > 0) {
            return result.documents.reduce((acc, keySecret) => {
                if (!acc[keySecret["Name"]]) {

                    acc[keySecret["Name"]] = keySecret["Value"]
                }
                return acc;
            }, {})
        }

        return {};
    }

    async getHomepageData (callback) {
        this.database.listDocuments(
            DB_NAME,
            COLLECTIONS.HOMEPAGE
        ).then(response => {
            callback(response.documents)
        }).catch(err => {
            console.log("err",err);
        });
    }
    
}
