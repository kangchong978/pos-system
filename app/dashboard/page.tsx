'use client';

import LoadingScreen from '@/components/LoadingScreen';
import { useCoreClient } from '@/utils/useClient';
import React, { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const { isInitialized, isLoading, coreClient, error, setAppLoading } = useCoreClient();

    const fetchStats = useCallback(async () => {
        if (isInitialized && coreClient && !isFetching) {
            setIsFetching(true);
            setAppLoading(true);
            try {
                const data = await coreClient.getDashboardStats();
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
        if (isInitialized && coreClient && !isFetching && !stats) {
            fetchStats();
        }
    }, [isInitialized]);

    if (!isInitialized || isLoading || !stats) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    if (!isInitialized || isLoading || !stats) {
        return <LoadingScreen />;
    }


    return (
        <div className="flex bg-gray-100">
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold ml-4 text-red-500">Dashboard</h1>
                    </div>
                    <div className="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-red-100 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Total Revenue</h2>
                        <p className="text-3xl font-bold text-red-500">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Total Orders</h2>
                        <p className="text-3xl font-bold text-red-500">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Total Sold Products</h2>
                        <p className="text-3xl font-bold text-red-500">{stats.totalProductsSold}</p>
                    </div>
                </div>

                {/* <div className="bg-white rounded-lg p-4 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Revenue Trend (Last 30 Days)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.revenueByDate}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div> */}

                {/* You can add more sections here as needed */}
            </main>
        </div>
    );
}