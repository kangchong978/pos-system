'use client';
import React, { useState } from 'react';



export default function Settings() {
    const [availableRoutes, setAvailableRoutes] = useState<SysRoute[]>([{ 'route': '/pos', 'role': 'admin' }, { 'route': '/pos', 'role': 'admin' },]);


    return (
        <div className="flex bg-gray-100">

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold ml-4 text-red-500">Settings</h1>
                    </div>
                    <div className="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead> */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {availableRoutes.map((route) => (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-blue-80 mr-4'}>
                                            {route.route}
                                        </span>
                                        <input value={route.role} type="text" name={route.route} placeholder="" className="w-full p-2 mb-2 border rounded" >
                                        </input>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}