'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import { useCoreClient } from '@/utils/useClient';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';
import DatePicker from "react-datepicker";


interface DailyData {
    date: string;
    revenue: number;
    orders: number;
}

interface ProductData {
    name: string;
    value: number;
}

const generateFakeData = (days: number): DailyData[] => {
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        revenue: Math.floor(Math.random() * 1000) + 500,
        orders: Math.floor(Math.random() * 50) + 10,
    }));
};

const generateFakeProductData = (): ProductData[] => {
    return [
        { name: 'Product A', value: Math.floor(Math.random() * 1000) + 100 },
        { name: 'Product B', value: Math.floor(Math.random() * 1000) + 100 },
        { name: 'Product C', value: Math.floor(Math.random() * 1000) + 100 },
        { name: 'Product D', value: Math.floor(Math.random() * 1000) + 100 },
    ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard(): JSX.Element {
    const { currentTheme } = useTheme();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const { isInitialized, isLoading, coreClient, error, setAppLoading } = useCoreClient();
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState<Date>(new Date());

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
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        statGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '1.5rem',
        },
        statCard: {
            backgroundColor: getColor('surface'),
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
        },
        statTitle: {
            fontSize: '1rem',
            color: getColor('text-secondary'),
            marginBottom: '0.5rem',
            textAlign: 'center' as const,
        },
        statValue: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        chartGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
        },
        chartCard: {
            backgroundColor: getColor('surface'),
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        chartTitle: {
            fontSize: '1.25rem',
            fontWeight: 'semibold',
            marginBottom: '1rem',
            color: getColor('text-primary'),
        },
        fullWidthCard: {
            gridColumn: '1 / -1',
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '4px',
            fontSize: '1rem',
            color: getColor('text-primary'),
            backgroundColor: getColor('background-primary'),
        },
    }), [currentTheme]);

    const fetchStats = useCallback(async (): Promise<void> => {
        if (isInitialized && coreClient && !isFetching) {
            setIsFetching(true);
            setAppLoading(true);
            try {
                const data = await coreClient.getDashboardStats({ startDate, endDate });
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setAppLoading(false);
                setIsFetching(false);
            }
        }
    }, [isInitialized, coreClient, setAppLoading, isFetching]);

    useEffect(() => {
        if (isInitialized && coreClient && !isFetching) {
            fetchStats();
        }
    }, [isInitialized, coreClient, startDate, endDate]);

    if (!isInitialized || isLoading || !stats) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Error: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <main style={styles.main}>
                <motion.header
                    style={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={styles.title}>Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>

                        <input
                            type="date"
                            name="startDate"
                            style={styles.input}
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(val) => setStartDate(new Date(val.target.value))}
                        />
                        <h1 style={{ ...styles.statTitle, margin: '10px' }}>to</h1>
                        <input
                            type="date"
                            name="endDate"
                            style={styles.input}
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(val) => setEndDate(new Date(val.target.value))}
                        />

                    </div>
                </motion.header>

                <AnimatePresence>
                    <motion.div
                        style={styles.statGrid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {[
                            { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}` },
                            { title: 'Total Orders', value: stats.totalOrders },
                            { title: 'Total Sold Products', value: stats.totalProductsSold },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                style={styles.statCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <h2 style={styles.statTitle}>{item.title}</h2>
                                <p style={styles.statValue}>{item.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <div style={styles.chartGrid}>
                    <motion.div
                        style={styles.chartCard}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 style={styles.chartTitle}>Sales Overview</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.salesOverview}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke={getColor('primary')} fill={getColor('primary-light')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        style={styles.chartCard}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 style={styles.chartTitle}>Daily Transactions</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.dailyTransactions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke={getColor('secondary')} strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        style={{ ...styles.chartCard, ...styles.fullWidthCard }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 style={styles.chartTitle}>Top-Selling Menu Items</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.topSellingItems}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill={getColor('primary')} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}