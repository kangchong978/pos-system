'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { Chip } from '@nextui-org/chip';
import { EyeIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading, setError } from '@/redux_slices/appSlice';
import { useCoreClient } from '@/utils/useClient';
import LoadingScreen from '@/components/LoadingScreen';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

interface SaleRecord {
    id: number;
    date: string;
    total: number;
    taxAmount: number;
    paymentMethod: string;
    status: string;
}

interface WeeklySale {
    date: string;
    total: number;
}

export default function Sales() {
    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized, isLoading } = useCoreClient();
    const [salesData, setSalesData] = useState<SaleRecord[]>([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [averageOrderValue, setAverageOrderValue] = useState<number>(0);
    const [weeklySales, setWeeklySales] = useState<WeeklySale[]>([]);

    useEffect(() => {
        if (isInitialized && coreClient) {
            fetchSalesData();
        }
    }, [isInitialized, coreClient]);

    const fetchSalesData = async () => {
        if (!coreClient) return;
        dispatch(setLoading(true));
        setIsDataLoading(true);
        try {
            // Fetch sales data
            const result = await coreClient.getSales();
            setSalesData(result);

            // Calculate totals
            const total = result.reduce((sum, sale) => sum + sale.total, 0);
            setTotalSales(total);
            setTotalOrders(result.length);
            setAverageOrderValue(total / result.length || 0);

            // Fetch weekly sales data
            const weeklyData = await coreClient.getWeeklySales();
            setWeeklySales(weeklyData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            dispatch(setError('Failed to fetch sales data'));
        } finally {
            setIsDataLoading(false);
            dispatch(setLoading(false));
        }
    };

    const chartData: ChartData<'bar'> = {
        labels: weeklySales.map(day => day.date),
        datasets: [
            {
                label: 'Sales',
                data: weeklySales.map(day => day.total),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Weekly Sales',
            },
        },
    };

    const columns = [
        { name: "ORDER ID", uid: "id" },
        { name: "DATE", uid: "date" },
        { name: "TOTAL", uid: "total" },
        { name: "PAYMENT METHOD", uid: "paymentMethod" },
        { name: "STATUS", uid: "status" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (sale: SaleRecord, columnKey: React.Key) => {
        const cellValue = sale[columnKey as keyof SaleRecord];
        switch (columnKey) {
            case "total":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">${sale.total.toFixed(2)}</p>
                        <p className="text-bold text-sm capitalize text-default-400">${sale.taxAmount.toFixed(2)} tax</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={sale.status === "completed" ? "success" : "danger"} size="sm" variant="flat">
                        {sale.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    if (isLoading || !isInitialized || !coreClient) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Sales Management | Wendy's</title>
            </Head>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-red-600">Sales Management</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
                        <p className="text-3xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Orders</h2>
                        <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Average Order Value</h2>
                        <p className="text-3xl font-bold text-purple-600">${averageOrderValue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">Sales Records</h2>
                    <Table aria-label="Sales records table">
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={salesData} isLoading={isDataLoading} loadingContent={<>Loading...</>}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
}