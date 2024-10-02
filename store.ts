'use client';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import productEditSlice from './redux_slices/productEditSlice';
import posSlice from './redux_slices/posSlice';
import orderSlice from './redux_slices/orderSlice';
import appSlice from './redux_slices/appSlice';


export const store = configureStore({
    reducer: {
        productEditSlice: productEditSlice,
        posSlice: posSlice,
        orderSlice: orderSlice,
        app: appSlice
        // Add other reducers here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;