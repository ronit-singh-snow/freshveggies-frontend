import { StyleSheet } from 'react-native';

import Router from './Navigations/Router.js';
import { AppContextProvider } from './Services/AppContextProvider.js'; 



export default function App() {

    return (
        <AppContextProvider>
            <Router />
        </AppContextProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10
    }
});
