'use client';
import React, { useState } from 'react';
import Head from 'next/head';

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Sample order data - replace with actual data from your backend
    const initialOrders = [
        { id: '1001', customer: 'John Doe', total: 25.99, status: 'Pending', date: '2024-08-28' },
        { id: '1002', customer: 'Jane Smith', total: 34.50, status: 'Completed', date: '2024-08-27' },
        { id: '1003', customer: 'Bob Johnson', total: 19.99, status: 'Processing', date: '2024-08-26' },
        { id: '1004', customer: 'Alice Brown', total: 45.00, status: 'Cancelled', date: '2024-08-25' },
        { id: '1005', customer: 'Charlie Wilson', total: 29.99, status: 'Completed', date: '2024-08-24' },
    ];

    const [orders, setOrders] = useState(initialOrders);

    const filteredOrders = orders.filter(order =>
        (order.id.includes(searchTerm) || order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || order.status === statusFilter)
    );

    const handleStatusChange = (orderId: String, newStatus: String) => {
        // setOrders(orders.map(order =>
        //     order.id === orderId ? { ...order, status: newStatus } : order
        // ));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Order Management | Wendy's</title>
            </Head>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-red-600">Order Management</h1>

                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="p-2 border rounded w-full md:w-64 mb-4 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <select
                                            className="text-indigo-600 hover:text-indigo-900"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

