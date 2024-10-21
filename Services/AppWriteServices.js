import { Account, Client, ID } from "react-native-appwrite";


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