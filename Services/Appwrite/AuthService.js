import Toast from "react-native-root-toast";
import { APPWRITE_URL, PROJECT_ID } from "./Config";
import { Account, Client, ID } from "react-native-appwrite";

export class AuthService {
    client = new Client();
    account;
    
    constructor() {
        this.client
            .setEndpoint(APPWRITE_URL)
            .setProject(PROJECT_ID);

        this.account = new Account(this.client);
    }

    async getUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch(err) {
            console.log("getUser: " + JSON.stringify(err))
        }
    }

    async updateName(name) {
        try {
            await this.account.updateName(name);
        } catch(err) {
            console.log(err);
        }
    }

    async updateEmail(email, password) {
        try {
            await this.account.updateEmail(email, password);
        } catch(err) {
            console.log(err);
        }
    }

    async updateEmailAfterPhoneLogin(email, password) {
        try {
            await this.account.updateEmail(email, password);
            Toast.show("Email successfully updated.", Toast.durations.LONG);
        } catch (err) {
            console.error("Failed to update email after phone login", err);
            Toast.show(err.message || "Error updating email", Toast.durations.LONG);
        }
    }
    

    async updatePhone(phone, password) {
        try {
            await this.account.updatePhone(phone, password)
        } catch(err) {
            if (err.type === "user_target_already_exists")
                Toast.show("Phone number is already in use with different account.", Toast.durations.LONG)
            console.log(JSON.stringify(err));
        }
    }

    async sendPhoneToken(phoneNumber) {
        try {
            let userAccount = await this.account.createPhoneToken(
                ID.unique(),
                phoneNumber
            );
            return userAccount.userId;
        } catch(err) {
            console.log(JSON.stringify(err));
            Toast.show("Error while sending OTP", Toast.durations.SHORT);
        }
    }

    async sendEmailToken(email) {
        try {
            let userAccount = await this.account.createEmailToken(
                ID.unique(),
                email
            );
            return userAccount.userId;
        } catch(err) {
            console.log(err);
            Toast.show("Error while sending OTP to email", Toast.durations.SHORT);
        }
    }
    

    async confirmOTPAndCreateSession (userId, otp) {
        try {
            await this.account.createSession(
                userId,
                otp
            );
            const userData = await this.account.get();
            return userData;
        } catch(err) {
            if (err.type === "user_invalid_token")
                Toast.show("You have entered incorrect OTP", Toast.durations.LONG);
            else
                Toast.show(err.toString(), Toast.durations.LONG);
            console.log("Session not created", err);
        }
    }

    async deleteSession() {
        await this.account.deleteSession("current");
    }

    async deleteSessions() {
        try {  
            await this.account.deleteSessions();
        } catch(err) {
            console.log("No account session exist yet");
        }
    }

    async signInWithEmail(email, password) {
        await this.account.createEmailPasswordSession(email, password);
        const user = await this.getUser();
        return user;
    }

    async signUpWithEmail(email, password) {
        const userAccount = await this.account.create(ID.unique(), email, password);
        return userAccount;
    } 
}