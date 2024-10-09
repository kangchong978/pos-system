import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Variation, MyFile, VariationOption, Category } from '@/common/type/product';
import { Order, OrderType, PosProduct } from '@/common/type/order';
import { PosTable } from '@/common/type/posTable';

export enum PaymentLoadingStatus { Idle, Loading, Success, Failed }


interface PosState {
    orders?: Order[];
    order?: Order;
    categories?: Category[];
    selectedCategory?: Category;
    products?: Product[];
    searchTerm?: string;
    paymentLoadingStatus: PaymentLoadingStatus;
    tables?: PosTable[];
    selectedPaymentMethod: string | null;
    showCashModal: boolean;
    receivedAmount: string;
    changeAmount: number;
    taxRate: number;
    showTableSelectionModal: boolean;
    isCollapsed: boolean;
    isSummaryExpanded: boolean;
    currentPage: number;
    totalProducts: number;
    totalPages: number;
}

const initialState: PosState = {
    paymentLoadingStatus: PaymentLoadingStatus.Idle,
    selectedPaymentMethod: null,
    showCashModal: false,
    receivedAmount: '',
    changeAmount: 0,
    taxRate: 0,
    showTableSelectionModal: false,
    isCollapsed: false,
    isSummaryExpanded: false,
    currentPage: 1,
    totalProducts: 0,
    totalPages: 1
}

const posSlice = createSlice({
    name: 'pos',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<Order[] | undefined>) => {
            state.orders = action.payload;
        },
        setTables: (state, action: PayloadAction<PosTable[]>) => {
            state.tables = action.payload;
        },
        setOrder: (state, action: PayloadAction<Order | undefined>) => {
            state.order = action.payload;
        },
        updateOrderField: (state, action: PayloadAction<{ field: keyof any; value: any }>) => {
            state.order = Order.fromPlainObject({
                ...state.order,
                [action.payload.field]: action.payload.value
            });
        },
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<Category>) => {
            state.selectedCategory = action.payload;
        },
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setPaymentLoadingStatus: (state, action: PayloadAction<PaymentLoadingStatus>) => {
            state.paymentLoadingStatus = action.payload;
        },
        setSelectedPaymentMethod: (state, action: PayloadAction<string | null>) => {
            state.selectedPaymentMethod = action.payload;
        },
        setShowCashModal: (state, action: PayloadAction<boolean>) => {
            state.showCashModal = action.payload;
        },
        setReceivedAmount: (state, action: PayloadAction<string>) => {
            state.receivedAmount = action.payload;
        },
        setChangeAmount: (state, action: PayloadAction<number>) => {
            state.changeAmount = action.payload;
        },
        setTaxRate: (state, action: PayloadAction<number>) => {
            state.taxRate = action.payload;
            // Recalculate total for active order if it exists
            if (state.order) {
                const subTotal = state.order.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
                const total = subTotal + (subTotal * state.taxRate);
                state.order = {
                    ...state.order,
                    subTotal,
                    total,
                    tax: state.taxRate
                };
            }
        },
        changeOrderType: (state, action: PayloadAction<{ type: OrderType, id?: number }>) => {
            if (state.order) {
                const newType = action.payload.type;
                const tableId = action.payload.id;
                if (newType === OrderType.TakeAway && state.order.orderType === OrderType.DineIn) {
                    // Remove table association
                    if (state.order.tableId && state.tables) {
                        state.tables = state.tables.map(table => {
                            if (table.id === state.order?.tableId) {
                                const { orderId, ...rest } = table;
                                return rest as PosTable;
                            }
                            return table;
                        });
                    }
                    state.order.tableId = undefined;
                }
                state.order.orderType = newType;
                state.order.tableId = tableId;
            }
        },

        selectTable: (state, action: PayloadAction<number>) => {
            if (state.order && state.tables) {
                const tableId = action.payload;
                state.order.tableId = tableId;
                state.order.orderType = OrderType.DineIn;
                state.tables = state.tables.map(table =>
                    table.id === tableId ? { ...table, orderId: state.order?.id } : table
                );
                state.showTableSelectionModal = false;
            }
        },
        setShowTableSelectionModal: (state, action: PayloadAction<boolean>) => {
            state.showTableSelectionModal = action.payload;
        },
        updateOrderCalculation: (state) => {
            if (state.order) {
                const subTotal = state.order.products.reduce((acc, product) =>
                    acc + (product.price * product.quantity), 0
                );
                const total = subTotal + (subTotal * state.taxRate);
                state.order = {
                    ...state.order,
                    subTotal,
                    total,
                    tax: state.taxRate
                };
            }
        },
        setIsCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isCollapsed = action.payload;
        },
        setIsSummaryExpanded: (state, action: PayloadAction<boolean>) => {
            state.isSummaryExpanded = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setTotalProducts: (state, action: PayloadAction<number>) => {
            state.totalProducts = action.payload;
        },
        setTotalPages: (state, action: PayloadAction<number>) => {
            state.totalPages = action.payload;
        },
    }
})

export const {
    setOrders,
    setOrder,
    updateOrderField,
    setCategories,
    setSelectedCategory,
    setProducts,
    setSearchTerm,
    setPaymentLoadingStatus,
    setTables,
    setSelectedPaymentMethod,
    setShowCashModal,
    setReceivedAmount,
    setChangeAmount,
    setTaxRate,
    changeOrderType,
    selectTable,
    setShowTableSelectionModal,
    updateOrderCalculation,
    setIsCollapsed,
    setIsSummaryExpanded,
    setTotalPages,
    setTotalProducts,
    setCurrentPage,
} = posSlice.actions;

export default posSlice.reducer;