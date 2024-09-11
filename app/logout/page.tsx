'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CoreClient from '@/utils/client';


export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        return () => {
            handleLogout()
        }
    }, [])


    const handleLogout = () => {
        const client = CoreClient.getInstance();

        client.logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        </div>
    );
}