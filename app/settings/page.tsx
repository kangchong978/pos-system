'use client';
import CoreClient from '@/utils/client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';



export default function Settings() {
    const [oriRoutesAuth, setOriRoutesAuth] = useState<RouteAuth[]>([]);
    const [routesAuth, setRoutesAuth] = useState<RouteAuth[]>([]);
    const [changed, setChanged] = useState<boolean>(false);



    useEffect(() => {
        loadRoutesAuth();
    }, [])

    const handleSubmitRoutesAuth = async () => {
        //
        if (!changed) { toast.error('No changes.'); return; }

        const client = CoreClient.getInstance();
        await client.updateRouteAuth(routesAuth);

        setOriRoutesAuth(routesAuth);

        setChanged(false);
        toast.success('Changes saved.')

    }

    const handleResetRoutesAuth = () => {
        //
        if (!changed) { toast.error('No changes.'); return; }

        setRoutesAuth(oriRoutesAuth);
        setChanged(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Find the index of the route to update
        const index = routesAuth.findIndex(route => route.route === name);
        if (index !== -1) {
            // Create a new array with the updated route
            const updatedRoutesAuth = routesAuth.map((route, i) =>
                i === index ? { ...route, role: value } : route
            );
            setRoutesAuth(updatedRoutesAuth); // Update the state with the new array
        }

        if (!changed) setChanged(true);
    };

    const loadRoutesAuth = async () => {
        const client = CoreClient.getInstance();

        var result = await client.getRoutesAuth();
        console.log(result);
        setRoutesAuth(result);
        setOriRoutesAuth(result);
    }


    return (
        <div className="min-h-screen bg-gray-100">
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
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authorized Role</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {routesAuth.map((route) => (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-blue-80 mr-4'}>
                                            {route.route}
                                        </span>

                                    </td>
                                    <td>
                                        <textarea value={route.role} name={route.route} placeholder="" className="w-auto p-2 mb-2 border rounded " onChange={handleInputChange}>
                                        </textarea>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>

                <div className="button-group mt-4 flex justify-end">
                    <button
                        className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-500 mr-2"
                        onClick={() => handleResetRoutesAuth()}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800"
                        onClick={() => handleSubmitRoutesAuth()}
                    >
                        Submit
                    </button>
                </div>

            </main>
        </div>
    );


}