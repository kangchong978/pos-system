'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setLoading, setOrders, setError, updateOrderStatus } from '@/redux_slices/orderSlice';
import Head from 'next/head';
import { Order, OrderStatus } from '@/common/type/order';
import toast from 'react-hot-toast';
import OrderDetailsModal from '@/components/orderDetailsModal';
import { useCoreClient } from '@/utils/useClient';
import { handlePrintReceipt } from '@/utils/common';
import { Eye, Printer, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';



export default function Orders() {
    const { currentTheme } = useTheme(); // Get the current theme
    const styles = useMemo(() => ({
        container: {
            minHeight: '100vh',
            backgroundColor: getColor('background-primary'),
            padding: '2rem',
        },
        main: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        searchContainer: {
            display: 'flex',
            marginBottom: '1.5rem',
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
        select: {
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '0.375rem',
            backgroundColor: getColor('surface'),
            color: getColor('text-primary')
        },
        table: {
            width: '100%',
            borderSpacing: '0 0.5rem',
            color: getColor('text-primary')
        },
        tableHeader: {
            backgroundColor: getColor('surface'),
            color: getColor('text-primary'),
            fontWeight: 'bold',
            padding: '1rem',
            borderBottom: `2px solid ${getColor('primary')}`,
        },
        tableRow: {
            backgroundColor: getColor('surface'),
            transition: 'background-color 0.3s',
            cursor: 'pointer',
        },
        tableCell: {
            padding: '1rem',
            borderBottom: `1px solid ${getColor('border')}`,
        },
        statusBadge: {
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            transition: 'background-color 0.3s',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
    }), [currentTheme]); // Re-compute styles when theme changes

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
        handlePrintReceipt(orderId, coreClient, dispatch, true, event);
    };

    if (loading) return <LoadingScreen></LoadingScreen>;
    if (error) return <div style={styles.container}>Error: {error}</div>;

    return (
        <div style={styles.container}>

            <main style={styles.main}>
                <motion.header
                    style={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={styles.title}>Orders</h1>
                </motion.header>

                <motion.div
                    style={styles.searchContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div style={{ position: 'relative', width: '100%', marginRight: '16px' }}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search orders by ID..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                        />
                    </div>
                    <select
                        style={styles.select}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="canceled">Canceled</option>
                        <option value="completed">Completed</option>
                    </select>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Order ID</th>
                                <th style={styles.tableHeader}>Total</th>
                                <th style={styles.tableHeader}>Status</th>
                                <th style={styles.tableHeader}>Created</th>
                                <th style={styles.tableHeader}>Updated</th>
                                <th style={styles.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {orders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => handleRowClick(order)}
                                        style={styles.tableRow}
                                        whileHover={{ backgroundColor: getColor('background-primary') }}
                                    >
                                        <td style={styles.tableCell}>{order.id}</td>
                                        <td style={styles.tableCell}>${order.total.toFixed(2)}</td>
                                        <td style={styles.tableCell}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: order.status === 'completed' ? '#D1FAE5' :
                                                    order.status === 'active' ? '#FEF3C7' : '#FEE2E2',
                                                color: order.status === 'completed' ? '#065F46' :
                                                    order.status === 'active' ? '#92400E' : '#991B1B',
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            {new Date(order.createDate).toLocaleString()}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {new Date(order.updateDate).toLocaleString()}
                                        </td>
                                        <td style={styles.tableCell}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{ ...styles.button, color: getColor('primary') }}
                                                onClick={() => handleRowClick(order)}
                                            >
                                                <Eye style={{ marginRight: '5px' }} />
                                                View
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{ ...styles.button, color: getColor('secondary') }}
                                                onClick={(e) => onPrintReceipt(order.id, e)}
                                            >
                                                <Printer style={{ marginRight: '5px' }} />
                                                Print
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </motion.div>

                <AnimatePresence>
                    {selectedOrder && (
                        <OrderDetailsModal
                            order={selectedOrder}
                            onClose={handleCloseModal}
                            onPrint={(e) => onPrintReceipt(selectedOrder.id, e)}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}