'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading, setError } from '@/redux_slices/appSlice';
import Head from 'next/head';
import { useCoreClient } from '@/utils/useClient';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';
import { Search, Eye, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { SaleRecord } from '@/common/type/sales';
import { handlePrintReceipt } from '@/utils/common';

export default function Sales() {
    const { currentTheme } = useTheme();
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
            color: getColor('text-primary'),
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
            color: getColor('text-primary'),
        },
        table: {
            width: '100%',
            borderSpacing: '0 0.5rem',
            color: getColor('text-primary'),
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
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
    }), [currentTheme]);

    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized, isLoading } = useCoreClient();
    const [salesData, setSalesData] = useState<SaleRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');

    useEffect(() => {
        if (isInitialized && coreClient) {
            fetchSalesData();
        }
    }, [isInitialized, coreClient, activeSearchTerm, paymentMethodFilter]);

    const fetchSalesData = async () => {
        if (!coreClient) return;
        dispatch(setLoading(true));
        try {
            const filters: any = {};
            if (activeSearchTerm) {
                const orderId = parseInt(activeSearchTerm);
                if (!isNaN(orderId)) {
                    filters.order_id = orderId;
                }
            }
            if (paymentMethodFilter !== 'All') {
                filters.payment_method = paymentMethodFilter;
            }
            const result = await coreClient.getSales(filters);
            setSalesData(result);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            dispatch(setError('Failed to fetch sales data'));
            toast.error('Failed to fetch sales data');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setActiveSearchTerm(searchTerm);
        }
    };

    const onPrintReceipt = (orderId: number, event: React.MouseEvent) => {
        handlePrintReceipt(orderId, coreClient, dispatch, false, event);
    };


    if (isLoading || !isInitialized || !coreClient) {
        return <LoadingScreen />;
    }

    return (
        <div style={styles.container}>
            <Head>
                <title>Sales Management</title>
            </Head>

            <main style={styles.main}>
                <motion.header
                    style={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={styles.title}>Sales Management</h1>
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
                            placeholder="Search sales by Order ID..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                        />
                    </div>
                    <select
                        style={styles.select}
                        value={paymentMethodFilter}
                        onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    >
                        <option value="All">All Payment Methods</option>
                        <option value="Visa">Visa</option>
                        <option value="Cash">Cash</option>
                        <option value="Paypal">Paypal</option>
                        <option value="Touch n Go">Touch n Go</option>
                        <option value="MasterCard">MasterCard</option>
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
                                <th style={styles.tableHeader}>Total Amount</th>
                                <th style={styles.tableHeader}>Tax Amount</th>
                                <th style={styles.tableHeader}>Payment Method</th>
                                <th style={styles.tableHeader}>Transaction Date</th>
                                <th style={styles.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {salesData.map((sale) => (
                                    <motion.tr
                                        key={sale.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={styles.tableRow}
                                        whileHover={{ backgroundColor: getColor('background-primary') }}
                                    >
                                        <td style={styles.tableCell}>{sale.order_id}</td>
                                        <td style={styles.tableCell}>${sale.total_amount.toFixed(2)}</td>
                                        <td style={styles.tableCell}>${sale.tax_amount.toFixed(2)}</td>
                                        <td style={styles.tableCell}>{sale.payment_method}</td>
                                        <td style={styles.tableCell}>
                                            {new Date(sale.transaction_date).toLocaleString()}
                                        </td>
                                        <td style={styles.tableCell}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                // style={{ ...styles.button, color: getColor('secondary') }}
                                                onClick={(e) => onPrintReceipt(sale.id, e)}
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
            </main>
        </div>
    );
}