'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CoreClient from "@/utils/client";


/**
 * Checks user login status and redirects to login if not logged in.
 */
export const CheckUserInfo = () => {
    const router = useRouter(); // Get the router instance
    const client = CoreClient.getInstance();
    const pathname = usePathname()

    useEffect(() => {
        const accessibleRoute = client.getUserInfo?.accessibleRoute ?? [];
        const isValidRoute = accessibleRoute.some(route => route.route === pathname);
        const isDashboardValid = accessibleRoute.some(route => route.route === '/dashboard');


        if (!client.isLoggedIn) {
            router.push('/login'); // Navigate to '/login'
        } else if (pathname == '/') {
            var nextRoute = '/dashboard';

            if (!isDashboardValid && accessibleRoute.length > 0) {
                nextRoute = accessibleRoute[0]!.route ?? '/notFound';
            }

            router.push(nextRoute);
        } else if (!isValidRoute) {
            router.push('/notFound');
        }

    }, [router]); // Dependency array

    return null; // This component does not render anything
};

