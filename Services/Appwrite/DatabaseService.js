import Toast from "react-native-root-toast";
import { APPWRITE_URL, COLLECTIONS, DB_NAME, PROJECT_ID } from "./Config";
import { Client, ID, Databases, Query } from "react-native-appwrite";

export class DatabaseService {
    client = new Client();
    account;
    
    constructor() {
        this.client
            .setEndpoint(APPWRITE_URL)
            .setProject(PROJECT_ID);

        this.database = new Databases(this.client);
    }

    parseExpression(expression) {
        if (!expression)
            return "";

        // Split the expression into key-value pairs
        const pairs = expression.split(' ');
      
        return pairs.map(pair => {
            let separater = "";
            const [key, value] = pair.split('=');

            if (pair.includes('='))
                separater = "=";
            else if (pair.includes('<'))
                separater = "<";
            else if (pair.includes('>'))
                separater = ">";
            
            let generatedQuery;
            switch(separater) {
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
        console.log(DB_NAME);
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
        }catch(err) {
            console.log(err);
        }
    }
}