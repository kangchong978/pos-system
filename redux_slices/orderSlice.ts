import { Order } from '@/common/type/order';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: number; status: Order['status'] }>) => {
            const { id, status } = action.payload;
            const order = state.orders.find(o => o.id === id);
            if (order) {
                order.status = status;
            }
        },
    },
});

export const { setOrders, setLoading, setError, updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;