import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

import { appContext } from "../Services/AppContextProvider";

const Router = () => {
    const {authData, loading} = appContext();
    console.log("router: " + JSON.stringify(authData));
    return (
        <NavigationContainer>
            { authData?.user_token ? <AppStack /> :  <AuthStack /> }
        </NavigationContainer>
    )
}

export default Router;