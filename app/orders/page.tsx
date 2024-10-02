'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setLoading, setOrders, setError, updateOrderStatus } from '@/redux_slices/orderSlice';
import Head from 'next/head';
import { Order, OrderStatus } from '@/common/type/order';
import toast from 'react-hot-toast';
import OrderDetailsModal from '@/components/orderDetailsModal';
import { useCoreClient } from '@/utils/useClient';
import { handlePrintReceipt } from '@/utils/common';
import { Eye, Printer } from 'lucide-react';

export default function Orders() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.orderSlice);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { coreClient } = useCoreClient(); // Pass true to skip auth check

    useEffect(() => {
        if (coreClient) {
            fetchOrders();
        }
    }, [activeSearchTerm, statusFilter, coreClient]);

    const fetchOrders = async () => {
        if (!coreClient) return;

        try {
            dispatch(setLoading(true));
            const filters: { id?: number; status?: OrderStatus } = {};

            if (activeSearchTerm) {
                const id = parseInt(activeSearchTerm);
                if (!isNaN(id)) {
                    filters.id = id;
                }
            }

            if (statusFilter !== 'all') {
                filters.status = statusFilter as OrderStatus;
            }

            const orders = await coreClient.getOrders(filters);
            dispatch(setOrders(orders));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            dispatch(setError('Failed to fetch orders'));
            toast.error('Failed to fetch orders');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setActiveSearchTerm(searchTerm);
        }
    };

    const handleRowClick = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const onPrintReceipt = (orderId: number, event: React.MouseEvent) => {
        handlePrintReceipt(orderId, event, coreClient, dispatch);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Order Management | Wendy's</title>
            </Head>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-red-600">Order Management</h1>

                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search orders by ID..."
                            className="p-2 pr-10 border rounded w-full md:w-64 mb-4 md:mb-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                            <p className='border px-[2px]'>
                                Enter
                            </p>
                        </span>
                    </div>
                    <select
                        className="p-2 border rounded"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="canceled">Canceled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => handleRowClick(order)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(order.createDate).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(order.updateDate).toLocaleString()}
                                    </td>
                                    <td className="flex px-6 py-4 whitespace-nowrap text-sm items-center">
                                        <button
                                            className="flex text-blue-600 hover:text-blue-900 mr-6"
                                            onClick={() => handleRowClick(order)}
                                        >
                                            <Eye style={{ marginRight: '5px' }}></Eye>
                                            View
                                        </button>
                                        <button
                                            className="flex text-green-600 hover:text-green-900 items-center"
                                            onClick={(e) => onPrintReceipt(order.id, e)}
                                        >
                                            <Printer style={{ marginRight: '5px' }}></Printer>
                                            Print
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={handleCloseModal}
                        onPrint={(e) => onPrintReceipt(selectedOrder.id, e)}
                    />
                )}
            </main>
        </div>
    );
}