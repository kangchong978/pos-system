'use client';



import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/store";
import {
    setOrder, setOrders, updateOrderField, setCategories, setSelectedCategory,
    setProducts, setSearchTerm, PaymentLoadingStatus, setPaymentLoadingStatus,
    setTables, setSelectedPaymentMethod, setShowCashModal, setReceivedAmount, setChangeAmount,
    setTaxRate, updateOrderCalculation, changeOrderType, selectTable, setShowTableSelectionModal,
    setIsCollapsed,
    setIsSummaryExpanded,
    setTotalProducts,
    setCurrentPage,
    setTotalPages,
} from '@/redux_slices/posSlice';
import { Order, OrderStatus, OrderType, PosProduct } from '@/common/type/order';
import OrderTypeButton from '@/components/switchButton';
import { useCallback, useEffect, useMemo } from 'react';
import CategoryList from '@/components/categoryBar';
import { Category } from '@/common/type/product';
import ButtonWithPopup from '@/components/buttonWithPopup';
import { Button } from '@nextui-org/button';
import AnimatedPaymentPopup from '@/components/animatedPaymentPopop';
import RestaurantTables from '@/components/tableMap';
import OrderStatusCard from '@/components/orderStatusCard';
import ButtonWithModal from '@/components/buttonWithModal';
import { Bell, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Input } from '@nextui-org/input';
import { useCoreClient } from '@/utils/useClient';
import { setError, setLoading, verifyIsRequiredFeedback } from '@/redux_slices/appSlice';
import LoadingScreen from '@/components/LoadingScreen';
import { AnimatePresence, motion } from 'framer-motion';

import CashPaymentModal from '@/components/cashPaymentModal';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';
import CategoriesChips from '@/components/categoriesChips';


const paymentMethods = [
    { name: 'Visa', image: '/visa-logo.png' },
    { name: 'PayPal', image: '/paypal-logo.png' },
    { name: 'Touch n Go', image: '/Touch-n-Go-Ewallet.png' },
    { name: 'MasterCard', image: '/mastercard-logo.png' },
    { name: 'Cash', image: '/cash.png' },
];

export default function Pos() {
    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        main: {
            display: 'flex',
            flexDirection: 'column' as const,
            height: '100vh',
            width: '100%',
            paddingLeft: '80px',
            backgroundColor: getColor('background-primary'),
        },
        content: {
            display: 'flex',
            flex: 1,
        },
        sidebar: {
            width: '25%',
            borderRight: `1px solid ${getColor('border')}`,
            padding: '20px',
            overflowY: 'auto' as const,
            backgroundColor: getColor('surface'),
        },
        newOrderButton: {
            width: '100%',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        divider: {
            height: '1px',
            backgroundColor: getColor('border'),
            marginBottom: '10px',
        },
        mainContent: {
            width: '75%',
            position: 'relative' as const,
            backgroundColor: getColor('background-primary'),
        },
        addTableButton: {
            position: 'absolute' as const,
            right: '15px',
            top: '20px',
        },
        header: {
            position: 'fixed' as const,
            top: 0,
            left: '80px',
            width: 'calc(100% - 5%)',
            backgroundColor: getColor('background-secondary'),
            padding: '32px 16px 16px',
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        headerContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        backButton: {
            backgroundColor: getColor('background-primary'),
            color: getColor('text-primary'),
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        orderTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        searchContainer: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '16px',
        },
        searchInput: {
            width: '100%',
            padding: '10px 16px',
            paddingLeft: '40px',
            borderRadius: '8px',
            border: `1px solid ${getColor('border')}`,
            fontSize: '14px',
            backgroundColor: getColor('background-primary'),
        },
        searchIcon: {
            position: 'absolute' as const,
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: getColor('text-secondary'),
        },
        cardContainer: {
            height: '80vh',
            width: '75%',
            overflowY: 'auto' as const,
            padding: '20px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
        },
        card: {
            backgroundColor: getColor('surface'),
            borderRadius: '20px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column' as const,
            height: '100%',
            justifyContent: 'space-between',
        },
        imageContainer: {
            position: 'relative' as const,
            width: '100%',
            height: '150px',
            marginBottom: '10px',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 0,
        },
        productName: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: getColor('text-primary'),
            marginBottom: '10px',
        },
        /// order details

        container: {
            display: 'flex',
            marginTop: '160px',
            height: 'calc(100vh - 160px)',
            overflow: 'hidden',
        },
        productContainer: (isCollapsed: boolean) => ({

            width: isCollapsed ? 'calc(100% - 80px)' : '65%',
            transition: 'width 0.3s ease-in-out',
        }),
        orderContainer: (isCollapsed: boolean) => ({
            position: 'fixed' as const,
            right: 0,
            top: '160px',
            width: isCollapsed ? '60px' : '25%',
            height: 'calc(100vh - 160px)',
            backgroundColor: getColor('background-primary'),
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
            boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column' as const,
            transition: 'width 0.3s ease-in-out',
            overflow: 'hidden',
        }),
        collapseButton: {
            position: 'absolute' as const,
            left: '10px',
            top: '5%',
            transform: 'translateY(-50%)',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
        },
        orderHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            paddingLeft: '60px',
            borderBottom: `1px solid ${getColor('border')}`,
        },
        cancelOrder: {
            color: getColor('text-secondary'),
            cursor: 'pointer',
        },
        orderList: {
            flexGrow: 1,
            overflowY: 'auto' as const,
            padding: '20px',
        },
        orderItem: {
            display: 'flex',
            backgroundColor: getColor('background-secondary'),
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px',
        },
        orderItemImage: {
            position: 'relative' as const,
            width: '80px',
            height: '80px',
            marginRight: '10px',
            borderRadius: '10px',
            overflow: 'hidden',
        },
        quantityControl: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            borderRadius: '20px',
            padding: '5px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '80px',
            marginTop: '5px',
        },
        orderItemDetails: {
            flex: 1,
        },
        orderItemName: {
            fontWeight: 'bold',
            color: getColor('text-primary'),
        },
        orderItemPrice: {
            color: getColor('primary'),
            fontWeight: 'bold',
        },
        paymentSummary: {
            padding: '20px',
            borderTop: `1px solid ${getColor('border')}`,
        },
        paymentMethodHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px 0',
        },
        paymentMethodContent: {
            overflow: 'hidden',
        },
        orderSummarySection: {
            borderTop: `1px solid ${getColor('border')}`,
        },
        summaryHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            cursor: 'pointer',
            backgroundColor: getColor('background-secondary'),
        },
        summaryTitle: {
            fontWeight: 'bold',
            fontSize: '18px',
            color: getColor('primary'),
        },
        summaryContent: {
            padding: '20px',
            backgroundColor: getColor('background-primary'),
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            color: getColor('text-secondary')
        },
        paymentMethods: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '20px',
        },
        paymentMethod: {
            backgroundColor: getColor('background-secondary'),
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: `2px solid ${getColor('border')}`,
        },
        paymentMethodSelected: {
            borderColor: getColor('primary'),
        },
        proceedButton: {
            width: '100%',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            marginTop: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
        },
        pageBar: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
        },
        pageButton: {
            margin: '0 0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
        },
        activePageButton: {
            backgroundColor: getColor('secondary'),
        },
        productGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
        },

    }), [currentTheme]); // Recalculate styles when theme changes

    const ITEMS_PER_PAGE = 8;
    const dispatch = useDispatch();
    const { coreClient, isInitialized, isLoading } = useCoreClient();
    const {
        orders,
        order,
        categories,
        selectedCategory,
        products,
        searchTerm,
        paymentLoadingStatus,
        tables,
        selectedPaymentMethod,
        showCashModal,
        receivedAmount,
        changeAmount,
        taxRate,
        showTableSelectionModal,
        isCollapsed,
        isSummaryExpanded,
        currentPage,
        totalProducts,
        totalPages
    } = useSelector((state: RootState) => state.posSlice);




    useEffect(() => {
        if (isInitialized && coreClient) {
            initialize();
        }
    }, [isInitialized, coreClient]);


    useEffect(() => {
        if (isInitialized && coreClient && order) {
            triggerSynchronization();
        }
    }, [order, isInitialized, coreClient]);



    const initialize = async () => {
        dispatch(setLoading(true));
        try {
            await Promise.all([
                loadTables(),
                loadOrders(),
                loadProductCategories(),
                loadTaxRate(),
                loadProducts(currentPage)

            ]);
        } catch (error) {
            console.error('Initialization error:', error);
            dispatch(setError('Failed to initialize POS system'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const loadTaxRate = async () => {
        if (!coreClient) return;
        try {
            const settings = await coreClient.getSettings();
            dispatch(setTaxRate(settings.tax));
        } catch (error) {
            console.error('Error loading tax rate:', error);
            toast.error('Failed to load tax rate');
        }
    };

    const triggerSynchronization = async () => {
        if (!order || !coreClient) return;
        try {
            await coreClient.updateOrder(order);
        } catch (error) {
            console.error('Error synchronizing order:', error);
            toast.error('Failed to synchronize order');
        }
    };

    const calculateOrderTotals = (products: PosProduct[]) => {
        const subTotal = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        const total = subTotal + (subTotal * taxRate);
        return { subTotal, total };
    };

    const handleAddOrderProduct = async (product: PosProduct) => {
        if (!order) return;

        let newProducts;
        const existingProduct = order.products.find(p =>
            p.id === product.id &&
            JSON.stringify(p.variation) === JSON.stringify(product.variation)
        );

        if (existingProduct) {
            newProducts = order.products.map(p =>
                p === existingProduct ? { ...p, quantity: p.quantity + 1 } : p
            );
        } else {
            newProducts = [...order.products, { ...product, quantity: 1 }];
        }

        const { subTotal, total } = calculateOrderTotals(newProducts);

        dispatch(updateOrderField({ field: 'products', value: newProducts }));
        dispatch(updateOrderField({ field: 'subTotal', value: subTotal }));
        dispatch(updateOrderField({ field: 'total', value: total }));
    };

    const handleRemoveOrderProduct = async (index: number) => {
        if (!order) return;

        const newProducts = [...order.products];
        if (newProducts[index].quantity > 1) {
            newProducts[index].quantity -= 1;
        } else {
            newProducts.splice(index, 1);
        }

        const { subTotal, total } = calculateOrderTotals(newProducts);

        dispatch(updateOrderField({ field: 'products', value: newProducts }));
        dispatch(updateOrderField({ field: 'subTotal', value: subTotal }));
        dispatch(updateOrderField({ field: 'total', value: total }));
    };

    const loadTables = async () => {
        if (!coreClient) return;
        try {
            const result = await coreClient.getTables();
            dispatch(setTables(result));
        } catch (error) {
            console.error('Error loading tables:', error);
            toast.error('Failed to load tables');
        }
    };

    const loadProducts = useCallback(async (pageToLoad: number) => {
        if (!coreClient || isLoading) return;
        dispatch(setLoading(true));
        try {
            const categoryFilter = !selectedCategory || selectedCategory.name === 'All' ? '' : selectedCategory.name;
            const { products, total } = await coreClient.getProducts({
                searchTerm: searchTerm ?? '',
                page: pageToLoad,
                categoryFilter: categoryFilter,
                itemsPerPage: ITEMS_PER_PAGE
            });
            dispatch(setProducts(products));
            dispatch(setTotalProducts(total));
            dispatch(setCurrentPage(pageToLoad));
            dispatch(setTotalPages(Math.ceil(total / ITEMS_PER_PAGE)))
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products');
        } finally {
            dispatch(setLoading(false));
        }
    }, [coreClient, searchTerm, selectedCategory, dispatch]);


    const searchProducts = useCallback(() => {
        loadProducts(1);
    }, [loadProducts]);

    const handlePageChange = (page: number) => {
        loadProducts(page);
    };

    const loadProductCategories = async () => {
        if (!coreClient) return;
        try {
            const defaultCategoriesCategory: Category[] = [{ 'id': -1, 'name': 'All' }];
            const result = await coreClient.getProductCategories();
            if (result.length > 0) {
                dispatch(setCategories([...defaultCategoriesCategory, ...result]));
                dispatch(setSelectedCategory(defaultCategoriesCategory[0]));
            }
        } catch (error) {
            console.error('Error loading product categories:', error);
            toast.error('Failed to load product categories');
        }
    };

    const loadOrders = async () => {
        if (!coreClient) return;
        try {
            const result = await coreClient.getOrders({ status: OrderStatus.Active });
            if (result) {
                dispatch(setOrders(result));
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Failed to load orders');
        }
    };

    const handleAddNewOrder = async (orderType?: OrderType, tableId?: number, tableName?: string) => {
        if (!coreClient) return;
        try {
            const _type = orderType ?? OrderType.TakeAway;
            const result = await coreClient.createOrder(_type, tableId, tableName);
            if (result?.id) {
                dispatch(setOrder(new Order(_type, result.id, [], 0, taxRate, 0, new Date(), new Date(), OrderStatus.Active, tableId)));
                if (tableId) {
                    await coreClient.updateTableOrderId(tableId, result.id);
                }
            }
        } catch (error) {
            console.error('Error adding new order:', error);
            toast.error('Failed to add new order');
        }
    };

    const handleSelectOrder = async (e: Order) => {
        if (e) {
            dispatch(setOrder(e));
        } else {
            console.error("Attempted to select an undefined order");
        }
    };

    const handleSelectCategory = async (e: Category) => {
        dispatch(setSelectedCategory(e));
    };

    const handlePaymentMethodSelect = (method: string) => {
        dispatch(setSelectedPaymentMethod(method));
    };

    const handleProceedToPayment = () => {
        if (selectedPaymentMethod === 'Cash') {
            dispatch(setShowCashModal(true));
        } else if (selectedPaymentMethod) {
            handlePayment(selectedPaymentMethod);
        }
    };

    const handleCashInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setReceivedAmount(value));

        const received = parseFloat(value);
        if (!isNaN(received) && order) {
            const change = received - order.total;
            dispatch(setChangeAmount(change > 0 ? change : 0));
        }
    };

    const handleCashPayment = () => {
        const received = parseFloat(receivedAmount);
        if (isNaN(received) || received < order!.total) {
            toast.error('Invalid amount. Please enter an amount equal to or greater than the total.');
            return;
        }

        handlePayment('Cash', received, changeAmount);
    };

    const handlePayment = async (method: string, received?: number, change?: number) => {
        if (!order || !coreClient) return;
        try {
            dispatch(setPaymentLoadingStatus(PaymentLoadingStatus.Loading));
            await new Promise((resolve) => setTimeout(resolve, 1000));
            dispatch(setPaymentLoadingStatus(PaymentLoadingStatus.Success));

            // Update order status
            await coreClient.updateOrderStatus(order.id, OrderStatus.Completed);

            if (order.tableId) {
                await coreClient.updateTableOrderId(order.tableId, undefined);
            }

            // Record the sale
            await coreClient.recordSale(
                order.id,
                order.total,
                order.total - order.subTotal,
                method
            );


            console.log(`Payment method: ${method}, Received: ${received}, Change: ${change}`);

            await new Promise((resolve) => setTimeout(resolve, 2000));
            dispatch(setPaymentLoadingStatus(PaymentLoadingStatus.Idle));
            dispatch(setShowCashModal(false));
            dispatch(verifyIsRequiredFeedback())
            handleBackToHome();
        } catch (error) {
            console.error('Error processing payment:', error);
            dispatch(setPaymentLoadingStatus(PaymentLoadingStatus.Idle));
            toast.error('Failed to process payment. Please try again.');
        }
    };

    const handleOnCancelOrder = async () => {
        if (!order || !coreClient) return;
        try {
            await coreClient.updateOrderStatus(order.id, OrderStatus.Canceled);
            if (order.tableId) {
                await coreClient.updateTableOrderId(order.tableId, undefined);
            }
            handleBackToHome();
        } catch (error) {
            console.error('Error canceling order:', error);
            toast.error('Failed to cancel order');
        }
    };

    const handleBackToHome = async () => {
        await initialize();
        dispatch(setOrder(undefined));
    }
    const handleAddTable = async (tableName: string) => {
        if (!coreClient) return;
        try {
            await coreClient.addTable(tableName);
            await loadTables();
        } catch (error) {
            console.error('Error adding table:', error);
            toast.error('Failed to add table');
        }
    };

    const getTableName = (id?: number) => {
        return tables?.find((v) => v.id === id)?.name ?? undefined;
    };

    const handleTableRemove = async (id: number) => {
        if (!coreClient) return;
        try {
            await coreClient.removeTable(id);
            dispatch(setTables(tables?.filter(table => table.id !== id) ?? []));
            toast.success('Table removed successfully');
        } catch (error) {
            console.error('Error removing table:', error);
            toast.error('Failed to remove table. Please try again.');
        }
    };

    const handleOrderTypeChange = async (newType: OrderType) => {
        if (!order || !coreClient) return;
        try {
            if (newType === OrderType.TakeAway && order.orderType === OrderType.DineIn) {
                // Changing from Dine-In to Take-Away
                if (order.tableId) {
                    await coreClient.updateTableOrderId(order.tableId, undefined);
                    // Update the tables array in the Redux store
                    dispatch(setTables(tables!.map(table =>
                        table.id === order.tableId ? { ...table, orderId: undefined, status: undefined } : table
                    )));
                }
                await coreClient.updateOrder({ ...order, orderType: newType, tableId: undefined });
                dispatch(changeOrderType({ type: newType }));
            } else if (newType === OrderType.DineIn && order.orderType === OrderType.TakeAway) {
                // Changing from Take-Away to Dine-In
                dispatch(setShowTableSelectionModal(true));
            }
            dispatch(updateOrderCalculation());
        } catch (error) {
            console.error('Error changing order type:', error);
            toast.error('Failed to change order type');
        }
    };


    const handleTableSelection = async (tableId: number) => {
        if (!order || !coreClient) return;
        try {
            await coreClient.updateTableOrderId(tableId, order.id);
            await coreClient.updateOrder({ ...order, tableId, orderType: OrderType.DineIn });

            // Update the tables array in the Redux store
            dispatch(setTables(tables!.map(table =>
                table.id === tableId ? { ...table, orderId: order.id, status: order.status } : table
            )));
            dispatch(changeOrderType({ type: OrderType.DineIn, id: tableId }));
            dispatch(selectTable(tableId));
            dispatch(updateOrderCalculation());
            dispatch(setShowTableSelectionModal(false));
        } catch (error) {
            console.error('Error selecting table:', error);
            toast.error('Failed to select table');
        }
    };

    const ProductGrid = () => {
        return (
            <>
                <motion.div
                    style={styles.productGrid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <AnimatePresence>
                        {products && products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                style={{
                                    ...styles.card,
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, zIndex: (Math.ceil(products.length) - Math.floor(index)) * 0.5 }}
                            >
                                <div style={styles.imageContainer}>
                                    {product.image && product.image.length > 0 && (
                                        <Image
                                            src={`http://localhost:6001/img/product/${product.image[0]}`}
                                            alt={product.name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    )}
                                </div>
                                <h3 style={styles.productName}>{product.name}</h3>
                                <CategoriesChips categories={product.category} />

                                <ButtonWithPopup
                                    product={product}
                                    posProduct={PosProduct.fromPlainObject(product)}
                                    addProduct={handleAddOrderProduct}
                                />

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                <div style={styles.pageBar}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            style={{
                                ...styles.pageButton,
                                ...(page === currentPage ? styles.activePageButton : {})
                            }}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>

            </>
        );
    };

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>;
    }

    if (!isInitialized || !coreClient) {
        return <div className="flex items-center justify-center h-screen">Error: POS system not initialized</div>;
    }

    if (!order) {
        return (
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={styles.main}
            >
                <div style={styles.content}>
                    <motion.div
                        style={styles.sidebar}
                        initial={{ x: -50 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.button
                            style={styles.newOrderButton}
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddNewOrder()}
                        >
                            <ShoppingBag style={{ marginRight: '10px' }} />
                            New Order (Take-Away)
                        </motion.button>
                        <div style={styles.divider}></div>
                        {orders?.map((order) => (
                            <OrderStatusCard
                                key={order.id}
                                orderId={order.id}
                                orderStatus={order.status}
                                orderType={order.orderType}
                                tableName={getTableName(order.tableId)}
                                onClick={() => handleSelectOrder(order)}
                            />
                        ))}
                    </motion.div>
                    <motion.div
                        style={styles.mainContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <RestaurantTables
                            tables={tables ?? []}
                            onTableRemove={handleTableRemove}
                            onTableClick={(id, orderId) => {
                                console.log(orderId);
                                if (orderId) {
                                    var target = orders?.find((v) => v.id == orderId);
                                    if (target) handleSelectOrder(target);
                                } else {
                                    handleAddNewOrder(OrderType.DineIn, id);
                                }
                            }}
                            onTableDragEnd={async (id, x, y) => {
                                if (!coreClient) return;
                                const newTables = [...tables ?? []];
                                const target = newTables.find((t) => t.id === id);
                                if (target) {
                                    const newTarget = { ...target, x, y };
                                    newTables.splice(newTables.indexOf(target), 1, newTarget);
                                    coreClient.updateTablePosition(x, y, id);
                                    dispatch(setTables(newTables));
                                }
                            }}
                        />
                        <motion.div
                            style={styles.addTableButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ButtonWithModal buttonText='+ Add Table' onSubmit={handleAddTable} />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.main>
        );
    }


    return (

        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={styles.main}
        >
            {/* Main content */}
            <motion.div
                style={styles.header}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div style={styles.headerContent}>
                    <div style={styles.headerLeft}>
                        <motion.button
                            style={styles.backButton}
                            onClick={handleBackToHome}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft size={18} />
                            Back
                        </motion.button>
                        <h1 style={styles.orderTitle}>Order#{order.id}</h1>
                        <OrderTypeButton value={order.orderType} onChange={handleOrderTypeChange} />
                    </div>
                </div>
                <div style={styles.searchContainer}>
                    <div style={{ position: 'relative', width: '100%', marginRight: '16px' }}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by name"
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // loadProducts();
                                }
                            }}
                        />
                    </div>
                    {categories && selectedCategory && (
                        <CategoryList
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectedCallback={handleSelectCategory}
                        />
                    )}
                </div>
            </motion.div>

            <div style={{ display: 'flex', marginTop: '20vh', marginLeft: '4vh' }}>
                <div style={styles.productContainer(isCollapsed)}>
                    <ProductGrid />
                </div>
                {/* <div style={styles.cardContainer}>
                    <div style={styles.grid}>
                        {products && products.map((product, index) => (

                            < motion.div
                                key={index}
                                style={{
                                    ...styles.card,
                                    zIndex: (Math.ceil(products.length) - Math.floor(index)) * 0.2 // Reverse z-index for rows
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, zIndex: Math.ceil(products.length) - Math.floor(index) + 1 }} // Keep higher z-index on hover
                            >

                                <div style={styles.imageContainer}>
                                    {product.image && product.image.length > 0 && <Image
                                        src={product.image ? `http://localhost:6001/img/product/${product.image[0]}` : '/path/to/placeholder.png'}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                    // style={{ zIndex: -10 }}
                                    />}
                                </div>
                                <h3 style={styles.productName}>{product.name}</h3>
                                <ButtonWithPopup product={product} posProduct={PosProduct.fromPlainObject(product)} addProduct={handleAddOrderProduct} />
                            </ motion.div>

                        ))}
                    </div>
                </div> */}

                <motion.div style={styles.orderContainer(isCollapsed)} layout>
                    <button style={styles.collapseButton} onClick={() => dispatch(setIsCollapsed(!isCollapsed))}>
                        {isCollapsed ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={styles.orderHeader}>
                                    <h2 style={styles.orderTitle}>Order Details</h2>
                                    <p style={styles.cancelOrder} onClick={handleOnCancelOrder}>Cancel order</p>
                                </div>

                                <div style={styles.orderList}>
                                    {order?.products?.map((product, i) => (
                                        <motion.div
                                            key={i}
                                            style={styles.orderItem}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                        >
                                            <div style={styles.orderItemImage}>
                                                <div style={styles.imageContainer}>
                                                </div>
                                                {product.image && product.image.length > 0 && <Image
                                                    src={product.image ? `http://localhost:6001/img/product/${product.image[0]}` : '/path/to/placeholder.png'}
                                                    alt={product.name}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />}
                                            </div>
                                            <div style={styles.orderItemDetails}>
                                                <p style={styles.orderItemName}>{product.name}</p>
                                                <p style={styles.orderItemPrice}>RM{product.price.toFixed(2)}</p>
                                                {product.variation.map((e, index) => <li style={{ color: getColor('text-primary') }} key={index}>{e.name}</li>)}
                                                <div style={styles.quantityControl}>
                                                    <button onClick={() => handleRemoveOrderProduct(i)}>-</button>
                                                    <span>{product.quantity}</span>
                                                    <button onClick={() => handleAddOrderProduct(product)}>+</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div style={styles.orderSummarySection}>
                                    <motion.div
                                        style={styles.summaryHeader}
                                        onClick={() => dispatch(setIsSummaryExpanded(!isSummaryExpanded))}
                                    >
                                        <h3 style={styles.summaryTitle}>Order Summary & Payment</h3>
                                        {!isSummaryExpanded ? <ChevronUp color={getColor('primary')} size={20} /> : <ChevronDown color={getColor('primary')} size={20} />}
                                    </motion.div>

                                    <AnimatePresence initial={false}>
                                        {isSummaryExpanded && (
                                            <motion.div
                                                initial="collapsed"
                                                animate="expanded"
                                                exit="collapsed"
                                                variants={{
                                                    expanded: { opacity: 1, height: 'auto' },
                                                    collapsed: { opacity: 0, height: 0 }
                                                }}
                                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                style={styles.summaryContent}
                                            >
                                                <div style={styles.summaryRow}>
                                                    <span>Sub Total</span>
                                                    <span>RM {order?.subTotal.toFixed(2)}</span>
                                                </div>
                                                <div style={styles.summaryRow}>
                                                    <span>Tax ({(order?.tax * 100).toFixed(2)}%)</span>
                                                    <span>RM {((order?.subTotal ?? 0) * (order?.tax ?? 0)).toFixed(2)}</span>
                                                </div>
                                                <div style={{ ...styles.summaryRow, fontWeight: 'bold', marginTop: '10px', marginBottom: '20px' }}>
                                                    <span>Total Payment</span>
                                                    <span>RM {order?.total.toFixed(2)}</span>
                                                </div>

                                                <h4 style={{ ...styles.summaryTitle, fontSize: '16px', marginBottom: '10px' }}>Payment Method</h4>
                                                <div style={styles.paymentMethods}>
                                                    {paymentMethods.map((method) => (
                                                        <motion.div
                                                            key={method.name}
                                                            style={{
                                                                ...styles.paymentMethod,
                                                                ...(selectedPaymentMethod === method.name && styles.paymentMethodSelected)
                                                            }}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handlePaymentMethodSelect(method.name)}
                                                        >
                                                            <Image src={method.image} alt={method.name} width={60} height={40} objectFit="contain" />
                                                            <span style={{ marginTop: '5px', fontSize: '12px', color: getColor('text-primary') }}>{method.name}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <motion.button
                                                    style={styles.proceedButton}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleProceedToPayment}
                                                    disabled={!selectedPaymentMethod}
                                                >
                                                    Proceed to Payment
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>


            <CashPaymentModal isOpen={showCashModal} onClose={() => dispatch(setShowCashModal(false))} order={order} receivedAmount={receivedAmount} handleCashInputChange={handleCashInputChange} changeAmount={changeAmount} handleCashPayment={handleCashPayment}></CashPaymentModal>

            <Modal
                isOpen={showTableSelectionModal}
                onClose={() => dispatch(setShowTableSelectionModal(false))}
                className="z-50"
                size="full"
            >
                <ModalContent className="h-[80%] w-[80%] max-w-[95vw]">
                    {(onClose) => (
                        <>
                            <ModalHeader style={{ background: getColor('background-primary'), color: getColor('text-primary') }} >Select a Table</ModalHeader>
                            <ModalBody className="overflow-hidden p-0">
                                <div className="h-full w-full">
                                    <RestaurantTables
                                        tables={tables ?? []}
                                        onTableClick={(id) => {
                                            handleTableSelection(id);
                                            onClose();
                                        }}
                                        onTableRemove={() => { }}
                                        onTableDragEnd={() => { }}
                                        inModal={true}
                                    />
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <AnimatedPaymentPopup status={paymentLoadingStatus} ></AnimatedPaymentPopup>

        </motion.main >
    );

}