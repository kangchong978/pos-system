'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading } from '@/redux_slices/appSlice';
import { useCoreClient } from '@/utils/useClient';
import toast from 'react-hot-toast';

export default function NotFound() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">404: Not Found</h1>
            </div>
        </div>
    );
}