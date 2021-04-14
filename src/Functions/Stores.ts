import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import { translate } from '~/Locales';

import Realm from '~/Services/Realm';

import { getAllStores as allStores } from './Store';

export async function getStore(id: string): Promise<IStore | null> {
    try {
        const realm = await Realm();

        const realmResponse = realm
            .objects<IStore>('Store')
            .filtered(`id = "${id}"`);

        if (realmResponse.length <= 0) return null;

        return realmResponse[0];
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAllStores(): Promise<Array<IStore>> {
    try {
        const stores: Array<IStore> = [];

        const oldStores = await allStores();

        const realm = await Realm();

        const realmResponse = realm.objects<IStore>('Store').slice();

        realmResponse.forEach(store => {
            stores.push(store);
        });

        // Check de old version of store
        oldStores.forEach(store => {
            const alreadyInList = stores.find(s => s.name === store);

            if (!alreadyInList) {
                stores.push({
                    id: '',
                    name: store,
                });
            }
        });

        return stores;
    } catch (err) {
        throw new Error(err.message);
    }
}

// this return the store uuid
export async function createStore(storeName: string): Promise<IStore> {
    try {
        const stores = await getAllStores();

        const storeAlreadyExists = stores.find(
            store => store.name.toLowerCase() === storeName.toLowerCase()
        );

        if (storeAlreadyExists) {
            throw new Error(
                translate('Function_Category_AddCategory_Error_AlreadyExists')
            );
        }

        const realm = await Realm();

        const storeUUID = await UUID.getRandomUUID();

        const store: IStore = {
            id: storeUUID,
            name: storeName,
        };

        realm.write(() => {
            realm.create<IStore>('Store', store, UpdateMode.Never);
        });

        return store;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateStore(store: IStore): Promise<void> {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create('Store', store, UpdateMode.Modified);
        });
    } catch (err) {
        throw new Error(err);
    }
}

export async function getAllProductsByStore(
    storeUUID: string | null
): Promise<Array<IProduct>> {
    try {
        const realm = await Realm();

        const products = realm.objects<IProduct>('Product').slice();

        if (storeUUID === null) {
            const prods = products.filter(p => p.store === null);

            return prods;
        }

        const store = await getStore(storeUUID);

        const filtedProducts = products.filter(p => {
            let isInStore: boolean;

            if (p.store && p.store === storeUUID) {
                isInStore = true;
            } else if (store?.name && store.name === p.store) {
                isInStore = true;
            } else {
                isInStore = false;
            }

            if (isInStore) return true;
            return false;
        });

        return filtedProducts;
    } catch (err) {
        throw new Error(err.message);
    }
}
