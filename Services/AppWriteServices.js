import { Account, Databases, Client, ID } from "react-native-appwrite";
import Toast from "react-native-root-toast";

const DB_NAME = "orange_cart_db";
const COLLECTIONS = {
    PRODUCT: "67234107000d6d41d5cb",
    HOMEPAGE: "67235fdf0022122976ff"
};

const COLUMNS = {
    PRODUCT: []
}

const createClient = () => {
    return new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('66efac960005a73d7247');
}

export const getAccount = () => {
    return new Account(createClient());
}

export const sendOTP = (phoneNumber) => {
    const account = getAccount();
    return account.createPhoneToken(
        ID.unique(),
        phoneNumber
    );
}

export const confirmOTPAndCreateSession = (userId, otp) => {
    const account = getAccount();
    return account.createSession(
        userId,
        otp
    );
}

export const deleteSession = () => {
    const account = getAccount();
    return account.deleteSession("current");
}

export const deleteExistingSession = () => {
    const account = getAccount();
    return new Promise((resolve, reject) => {
        account.get().then(async res => {
            await account.deleteSessions();
            resolve();
        }).catch(err => {
            console.log("No account session exist yet");
            resolve();
        })
    });

}


export const getCollectionDocument = (collection, query) => {
    const database =  new Databases(createClient());
    return database.listDocuments(
        DB_NAME,
        collection
    );
}

export const getHomepageData = (callback) => {
    getCollectionDocument(COLLECTIONS.HOMEPAGE).then(response => {
        callback(response.documents)
    }).catch(err => {

        console.log("err",err);
    })
}

export const getProducts = () => {
    return getCollectionDocument(COLLECTIONS.PRODUCT)
        .then(response => {
            callback(response.documents)
            console.log("response",  response );
        })
        .catch(err => {
            console.error("Error fetching products:", err);
        });
};

export const findUser = async (userId) => {
    const account = getAccount();

    try {
        const user = await account.get();
        return { data: [user] };  
    } catch (error) {
        console.error('Error fetching user data: ', error);
        throw error;
    }
};