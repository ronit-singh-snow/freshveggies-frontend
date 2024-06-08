import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import Router from './Navigations/Router.js';
import { AppContextProvider } from './Services/AppContextProvider.js';



export default function App() {

    return (
        <PaperProvider>
            <AppContextProvider>
                <Router />
            </AppContextProvider>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10
    }
});
