import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '~/Views/Home';
import AddProduct from '~/Views/Product/Add';
import AddLote from '~/Views/Batch/Add';
import EditProduct from '~/Views/Product/Edit';
import EditLote from '~/Views/Batch/Edit';
import ProductDetails from '~/Views/ProductDetails';
import AllProducts from '~/Views/AllProducts';
import StoreDetails from '~/Views/StoreDetails';
import Settings from '~/Views/Settings';
import About from '~/Views/About';
import ProSubscription from '~/Views/ProSubscription';
import Success from '~/Views/Success';
import PhotoView from '~/Views/PhotoView';

import StoreList from '~/Views/Store/List';

import ListCategory from '~/Views/Category/List';
import CategoryView from '~/Views/Category/View';
import CategoryEdit from '~/Views/Category/Edit';

import Export from '~/Views/Export';

import TrackingPermission from '~/Views/Permissions/AppleATT';

import Test from '~/Views/Test';

const Stack = createStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="AllProducts" component={AllProducts} />

            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="StoreDetails" component={StoreDetails} />
            <Stack.Screen name="AddLote" component={AddLote} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="EditLote" component={EditLote} />
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="Pro" component={ProSubscription} />
            <Stack.Screen name="Success" component={Success} />
            <Stack.Screen name="PhotoView" component={PhotoView} />

            <Stack.Screen name="ListCategory" component={ListCategory} />
            <Stack.Screen name="CategoryView" component={CategoryView} />
            <Stack.Screen name="CategoryEdit" component={CategoryEdit} />

            <Stack.Screen name="StoreList" component={StoreList} />

            <Stack.Screen name="Export" component={Export} />

            {Platform.OS === 'ios' && (
                <Stack.Screen
                    name="TrackingPermission"
                    component={TrackingPermission}
                />
            )}
        </Stack.Navigator>
    );
};

export default Routes;
