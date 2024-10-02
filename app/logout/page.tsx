'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading } from '@/redux_slices/appSlice';
import { useCoreClient } from '@/utils/useClient';
import toast from 'react-hot-toast';

export default function Logout() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { coreClient } = useCoreClient(true); // Pass true to skip auth check

    useEffect(() => {
        handleLogout();
    }, []);

    const handleLogout = async () => {
        if (!coreClient) {
            console.error('CoreClient is not initialized');
            router.push('/login');
            return;
        }

        dispatch(setLoading(true));
        try {
            await coreClient.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Failed to logout');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
                <p>Please wait while we log you out of the system.</p>
            </div>
        </div>
    );
}