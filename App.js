import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import Router from './Navigations/Router.js';
import { AppContextProvider } from './Services/AppContextProvider.js';

import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {

    return (
        <PaperProvider>
            <AppContextProvider>
                <RootSiblingParent>
                    <Router />
                </RootSiblingParent>
            </AppContextProvider>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10
    }
});
