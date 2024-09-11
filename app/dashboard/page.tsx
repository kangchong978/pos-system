'use client';

import React from 'react';
export default function Dashboard() {


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

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-red-100 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Total Revenue</h2>
                        <p className="text-3xl font-bold text-red-500">$612.917</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Total Orders</h2>
                        <p className="text-3xl font-bold text-red-500">9999+</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Customer Registration</h2>
                        <p className="text-3xl font-bold text-red-500">10</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-6">
                        <h2 className="text-sm text-red-500 mb-2">Total Sold Products</h2>
                        <p className="text-3xl font-bold text-red-500">2000</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Growth Products</h2>
                    <select className="bg-white border border-gray-300 rounded px-2 py-1">
                        <option>Last 30 days</option>
                    </select>
                </div>

                <div className="bg-white rounded-lg p-4">
                    <ol className="list-decimal pl-5">
                        <li>Product 1</li>
                        <li>Product 2</li>
                        <li>Product 3</li>
                        <li>Product 4</li>
                        <li>Product 5</li>
                    </ol>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Stock</h2>
                    <div className="space-y-2">
                        <div>
                            <span className="mr-2">Lemon</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                        <div>
                            <span className="mr-2">Orange</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}