'use client';

import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/store";
import {
    setOrder, setOrders, updateOrderField, setCategories, setSelectedCategory,
    setProducts, setSearchTerm, PaymentLoadingStatus, setPaymentLoadingStatus,
    setTables, setSelectedPaymentMethod, setShowCashModal, setReceivedAmount, setChangeAmount,
    setTaxRate, updateOrderCalculation, changeOrderType, selectTable, setShowTableSelectionModal,
} from '@/redux_slices/posSlice';
import { Order, OrderStatus, OrderType, PosProduct } from '@/common/type/order';
import OrderTypeButton from '@/components/switchButton';
import { useEffect } from 'react';
import CategoryList from '@/components/categoryBar';
import { Category } from '@/common/type/product';
import ButtonWithPopup from '@/components/buttonWithPopup';
import { Button } from '@nextui-org/button';
import AnimatedPaymentPopup from '@/components/animatedPaymentPopop';
import RestaurantTables from '@/components/tableMap';
import OrderStatusCard from '@/components/orderStatusCard';
import ButtonWithModal from '@/components/buttonWithModal';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Input } from '@nextui-org/input';
import { useCoreClient } from '@/utils/useClient';
import { setError, setLoading } from '@/redux_slices/appSlice';


const paymentMethods = [
    { name: 'Visa', image: '/visa-logo.png' },
    { name: 'PayPal', image: '/paypal-logo.png' },
    { name: 'Touch n Go', image: '/Touch-n-Go-Ewallet.png' },
    { name: 'MasterCard', image: '/mastercard-logo.png' },
    { name: 'Cash', image: '/cash-icon.png' },
];


export default function Pos() {
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
        showTableSelectionModal
    } = useSelector((state: RootState) => state.posSlice);

    useEffect(() => {
        if (isInitialized && coreClient) {
            initialize();
        }
    }, [isInitialized, coreClient]);

    useEffect(() => {
        if (isInitialized && coreClient) {
            loadProducts();
        }
    }, [selectedCategory, isInitialized, coreClient]);

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
                loadTaxRate()
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

    const loadProducts = async () => {
        if (!coreClient) return;
        dispatch(setLoading(true));
        try {
            const categoryFilter = !selectedCategory || selectedCategory.name === 'All' ? '' : selectedCategory.name;
            const result = await coreClient.getProducts({ "searchTerm": searchTerm ?? '', "page": 1, "categoryFilter": categoryFilter });
            dispatch(setProducts(result));
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products');
        } finally {
            dispatch(setLoading(false));
        }
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
                dispatch(changeOrderType(newType));
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

            dispatch(selectTable(tableId));
            dispatch(updateOrderCalculation());
            dispatch(setShowTableSelectionModal(false));
        } catch (error) {
            console.error('Error selecting table:', error);
            toast.error('Failed to select table');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isInitialized || !coreClient) {
        return <div>Error: POS system not initialized</div>;
    }


    if (!order) return (
        <main className="container flex flex-col h-screen w-full pl-[65px]">
            <div className="relative flex">
                <div className='relative w-1/4 border p-[20px]'>
                    <Button className='w-full bg-red-500 text-white mb-[10px]' onClick={() => handleAddNewOrder()}>
                        <ShoppingBag />
                        New Order (Take-Away)
                    </Button>

                    <div className='h-[1px] bg-gray-100 mb-[10px]'></div>

                    {orders?.map((order) => (
                        <OrderStatusCard
                            orderId={order.id}
                            orderStatus={order.status}
                            orderType={order.orderType}
                            tableName={getTableName(order.tableId)}
                            onClick={() => handleSelectOrder(order)}
                        />

                    ))}
                </div>
                <div className='w-3/4'>
                    <RestaurantTables
                        tables={tables ?? []}
                        onTableRemove={handleTableRemove}
                        onTableClick={(id, orderId) => {
                            console.log(orderId);
                            if (orderId) {
                                var target = orders?.find((v) => v.id == orderId);
                                if (target)
                                    handleSelectOrder(target);
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
                    <div className='fixed right-[15px] top-[20px]'>
                        <ButtonWithModal buttonText='+ Add Table' onSubmit={handleAddTable}></ButtonWithModal>

                    </div>
                </div>
            </div>

        </main>
    );



    return (
        <div className="flex bg-gray-100">
            {/* Main content */}
            <main className="container pl-[80px]">
                <div className="fixed top-0 left-[80px] w-[calc(100%-8%)] bg-gray-100 pt-8 px-4 z-[1]">
                    <div className="sticky top-0 flex justify-between items-center bg-gray-100">
                        <div className="flex items-center space-x-4">
                            <Button onClick={handleBackToHome}>Back</Button>
                            <h1 className="text-2xl font-bold text-red-500">Order#{order.id}</h1>
                            <OrderTypeButton value={order.orderType} onChange={handleOrderTypeChange} />
                        </div>
                        <div className="text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex mt-2 items-center ">
                        <div className="mr-4">
                            <input
                                type="text"
                                placeholder="Search by name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                value={searchTerm}
                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        loadProducts(); // Trigger the search/filter function
                                    }
                                }}
                            />
                        </div>
                        {categories && selectedCategory && <CategoryList categories={categories} selectedCategory={selectedCategory} onSelectedCallback={handleSelectCategory} />}
                    </div>
                </div>

                <div className="flex mt-40">
                    {/* Product grid and CategoryList */}
                    <div className="w-3/4 h-screen">

                        <div className="grid grid-cols-4 gap-4">
                            {products && products.map((_, i) => (
                                <div key={i} className="bg-white rounded-[20px] p-[10px] shadow">

                                    <div className="relative mb-2 item flex  h-[120px] justify-center">
                                        <Image src={_.image ? `http://localhost:6001/img/product/${_.image[0]}` : '/path/to/placeholder.png'}
                                            alt="Ramly Burger"
                                            className="rounded-[10px]"
                                            layout="fill"
                                            objectFit="cover" />
                                    </div>
                                    <h3 className="font-bold">{_.name} </h3>
                                    {/* <p className="text-red-500">RM {_.price}</p> */}

                                    <ButtonWithPopup product={_} posProduct={PosProduct.fromPlainObject(_)} addProduct={handleAddOrderProduct} />

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order details */}
                    <div className="fixed bottom-10 right-10 w-1/4 h-[80%] flex-shrink-0 flex flex-col bg-white rounded-lg z-[2]">
                        <div className='flex justify-between items-center '>
                            <h2 className="font-bold m-4">Order Details</h2>
                            <p className='m-4 text-gray-300' onClick={handleOnCancelOrder} >Cancel order</p>
                        </div>
                        {/* Scrollable order details */}

                        <div className="flex-grow overflow-y-auto p-4">

                            {order?.products?.map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 shadow mb-2 flex">
                                    <div className="relative item justify-center">
                                        <div className="relative mb-2 item flex w-[80px] h-[80px] justify-center mr-4">
                                            <Image src={_.image ? `http://localhost:6001/img/product/${_.image[0]}` : '/path/to/placeholder.png'}
                                                alt="Ramly Burger"
                                                className="rounded-lg"
                                                layout="fill"
                                                objectFit="cover" />
                                        </div>

                                        <div className='bg-red-500 text-white rounded-full pl-2 pr-2 pt-1 pb-1  w-[80px] flex items-center justify-between'>
                                            <button className='text-white' onClick={() => handleRemoveOrderProduct(i)}>-</button>
                                            {_.quantity && <span className=" ">{_.quantity}</span>}
                                            <button className='text-white' onClick={() => handleAddOrderProduct(_)}>+</button>

                                        </div>

                                    </div>
                                    <div>
                                        <p>{_.name}</p>
                                        <p className='text-red-500 font-bold'>RM{_.price.toFixed(2)}</p>
                                        {_.variation.map((e) => <li>{e.name}</li>)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sticky Payment Summary and Payment Method */}
                        <div className="bg-white p-4 shadow-lg rounded-lg">
                            <div className="mb-4">
                                <h3 className="font-bold mb-2">Payment Summary</h3>
                                <div className="flex justify-between">
                                    <span>Sub Total</span>
                                    <span>RM {order?.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax ({(order?.tax * 100).toFixed(2)}%)</span>
                                    <span>RM {((order?.subTotal ?? 0) * (order?.tax ?? 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total Payment</span>
                                    <span>RM {order?.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 shadow-lg rounded-lg">
                                <h3 className="font-bold mb-2">Payment Method</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.name}
                                            className={`bg-white rounded-md p-2 flex flex-col items-center justify-center cursor-pointer border-2 ${selectedPaymentMethod === method.name ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                            onClick={() => handlePaymentMethodSelect(method.name)}
                                        >
                                            <Image src={method.image} alt={method.name} width={60} height={40} objectFit="contain" />
                                            <span className="mt-2 text-sm">{method.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className={`w-full bg-red-500 text-white py-2 rounded-lg mt-4 ${!selectedPaymentMethod && 'opacity-50 cursor-not-allowed'}`}
                                    onClick={handleProceedToPayment}
                                    disabled={!selectedPaymentMethod}
                                >
                                    Proceed to Payment
                                </button>
                            </div>




                        </div>
                    </div>


                </div>
                {/* Cash Payment Modal */}
                <Modal
                    isOpen={showCashModal}
                    onClose={() => dispatch(setShowCashModal(false))}
                    className="z-50"
                >
                    <ModalContent>
                        <ModalHeader>
                            <h3 className="text-xl font-bold">Cash Payment</h3>
                        </ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <p>Total Amount: RM {order?.total.toFixed(2)}</p>
                            </div>
                            <Input
                                label="Received Amount (RM)"
                                type="number"
                                value={receivedAmount}
                                onChange={handleCashInputChange}
                                placeholder="Enter received amount"
                            />
                            {changeAmount > 0 && (
                                <p className="mt-2">Change: RM {changeAmount.toFixed(2)}</p>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={() => dispatch(setShowCashModal(false))}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={handleCashPayment}>
                                Proceed
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal
                    isOpen={showTableSelectionModal}
                    onClose={() => dispatch(setShowTableSelectionModal(false))}
                    className="z-50"
                    size="full" // Set the modal size to full
                >
                    <ModalContent className="h-[95vh] w-[95vw] max-w-[95vw] m-auto">
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Select a Table</ModalHeader>
                                <ModalBody className="overflow-hidden p-0">
                                    <div className="h-full w-full overflow-auto p-4">
                                        <RestaurantTables
                                            tables={tables ?? []}
                                            onTableClick={(id) => {
                                                handleTableSelection(id);
                                                onClose();
                                            }}
                                            onTableRemove={() => { }} // This is not needed here
                                            onTableDragEnd={() => { }} // This is not needed here
                                        />
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <AnimatedPaymentPopup status={paymentLoadingStatus} ></AnimatedPaymentPopup>

            </main >
        </div >
    );
}