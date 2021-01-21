import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnixTime, fromUnixTime, addMinutes } from 'date-fns';

export async function isProThemeByRewards(): Promise<boolean> {
    try {
        const isPro = await AsyncStorage.getItem('ProThemeUntil');

        if (isPro) {
            const date = fromUnixTime(Number(isPro));

            if (new Date() < date) {
                return true;
            }

            return false;
        }

        return false;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function setProThemesByRewards(minutes?: number): Promise<void> {
    let time = __DEV__ ? 1 : 15;

    if (minutes && !__DEV__) {
        time = minutes;
    }

    const date = addMinutes(new Date(), time);
    const timestamp = getUnixTime(date);

    try {
        await AsyncStorage.setItem('ProThemeUntil', String(timestamp));
    } catch (err) {
        throw new Error(err.message);
    }
}