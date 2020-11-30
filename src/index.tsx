import 'reflect-metadata';
import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import EnvConfig from 'react-native-config';

import RealmContext from './Contexts/RealmContext';

import './Services/TypeORM';
import Realm from './Services/Realm';
import './Services/Admob';
import './Services/BackgroundJobs';

import {
    getHowManyDaysToBeNextExp,
    getEnableMultipleStoresMode,
    getEnableNotifications,
} from './Functions/Settings';
import { CheckIfSubscriptionIsActive, GetPremium } from './Functions/Premium';

import Themes, { getActualAppTheme } from './Themes';

import Routes from './Routes/DrawerContainer';

import PreferencesContext from './Contexts/PreferencesContext';

import StatusBar from './Components/StatusBar';

if (!__DEV__) {
    Sentry.init({
        dsn: EnvConfig.SENTRY_DSN,
        enableAutoSessionTracking: true,
    });
}

const App: React.FC = () => {
    const [preferences, setPreferences] = useState({
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: false,
        appTheme: Themes.Light,
        multiplesStores: false,
        enableNotifications: true,
    });

    useEffect(() => {
        async function getData() {
            const daysToBeNext = await getHowManyDaysToBeNextExp();
            const isPremium = await GetPremium();
            const appTheme = await getActualAppTheme();
            const multiplesStores = await getEnableMultipleStoresMode();
            const enableNotifications = await getEnableNotifications();

            setPreferences({
                howManyDaysToBeNextToExpire: daysToBeNext,
                isUserPremium: isPremium,
                appTheme,
                multiplesStores,
                enableNotifications,
            });

            await CheckIfSubscriptionIsActive();
        }

        getData();
    }, []);

    return (
        <RealmContext.Provider value={{ Realm }}>
            <PreferencesContext.Provider
                value={{
                    userPreferences: preferences,
                    setUserPreferences: setPreferences,
                }}
            >
                <ThemeProvider theme={preferences.appTheme}>
                    <PaperProvider>
                        <Portal>
                            <NavigationContainer>
                                <StatusBar />
                                <Routes />
                            </NavigationContainer>
                        </Portal>
                    </PaperProvider>
                </ThemeProvider>
            </PreferencesContext.Provider>
        </RealmContext.Provider>
    );
};

export default App;
