'use client';

import Head from 'next/head';
import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function Sales() {
    // Sample data for the chart
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 3, 5, 2, 3, 9],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const chartOptions = {
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

    // Sample data for recent transactions
    const recentTransactions = [
        { id: 1, customer: 'John Doe', amount: 50.00, date: '2024-08-28' },
        { id: 2, customer: 'Jane Smith', amount: 75.50, date: '2024-08-27' },
        { id: 3, customer: 'Bob Johnson', amount: 30.25, date: '2024-08-26' },
    ];

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
                        <p className="text-3xl font-bold text-green-600">$12,345.67</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Orders</h2>
                        <p className="text-3xl font-bold text-blue-600">567</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Average Order Value</h2>
                        <p className="text-3xl font-bold text-purple-600">$21.78</p>
                    </div>
                </div>

                {/* <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <Bar data={chartData} options={chartOptions} />
                </div> */}

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left">
                                <th className="pb-2">Customer</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-t">
                                    <td className="py-2">{transaction.customer}</td>
                                    <td className="py-2">${transaction.amount.toFixed(2)}</td>
                                    <td className="py-2">{transaction.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};
