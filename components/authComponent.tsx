'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CoreClient from "@/utils/client";


/**
 * Checks user login status and redirects to login if not logged in.
 */
export const CheckUserInfo = () => {
    const router = useRouter(); // Get the router instance
    const client = CoreClient.getInstance();

    useEffect(() => {
        console.log('hereeee:' + JSON.stringify(client.getUserInfo));
        if (!client.isLoggedIn) {
            router.push('/login'); // Navigate to '/login'
        }
    }, [router]); // Dependency array

    return null; // This component does not render anything
};

