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
            console.log(err)
        }
    }

    async updateName(name) {
        try {
            await this.account.updateName(name);
        } catch(err) {
            console.log(err);
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
            console.log(err);
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
}