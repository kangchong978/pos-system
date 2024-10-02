'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import getFirstCharacters from '@/common/common';
import EmployeeModal from './empoyeeModal';
import { useCoreClient } from '@/utils/useClient';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading } from '@/redux_slices/appSlice';


const Sidebar = () => {
    const pathname = usePathname();
    const [usernameShort, setUsernameShort] = useState('');
    const [accessibleRoute, setAccessibleRoute] = useState<RouteAuth[]>([]);
    const [employeeProfile, setEmployeeProfile] = useState<Employee | null>(null);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);

    const { isInitialized, coreClient } = useCoreClient(pathname == '/login' || pathname == '/logout');
    const dispatch = useDispatch<AppDispatch>();



    useEffect(() => {
        if (isInitialized && coreClient) {
            const userInfo = coreClient.getUserInfo;
            if (userInfo) {
                setUsernameShort(getFirstCharacters(userInfo.username));
                setAccessibleRoute(userInfo.accessibleRoute);
            }

            const fetchCompanySettings = async () => {
                dispatch(setLoading(true));
                try {
                    const settings = await coreClient.getSettings();
                    if (settings && typeof settings.company_logo === 'string') {
                        setCompanyLogo('http://localhost:6001' + settings.company_logo);
                    }
                } catch (error) {
                    console.error('Error fetching company settings:', error);
                } finally {
                    dispatch(setLoading(false));
                }
            };

            fetchCompanySettings();
        }
    }, [isInitialized, coreClient, dispatch]);

    const isActive = (path: string) => pathname === path;

    const onEditProfile = () => {
        if (coreClient) {
            const userInfo = coreClient.getUserInfo;
            if (userInfo) {
                const employee: Employee = {
                    email: userInfo.email,
                    phoneNumber: userInfo.phoneNumber,
                    role: userInfo.role.toString(),
                    username: userInfo.username
                };
                setEmployeeProfile(employee);
            }
        }
    }

    if (pathname == '/login') return (<></>)


    return (
        <div className="w-16 bg-white h-screen fixed left-0 top-0 flex flex-col items-center py-4">
            <div className="mb-8">
                {companyLogo ? (
                    <img src={companyLogo} alt="Company Logo" className="w-15 h-10 object-contain" />
                ) : (
                    <div className="w-15 h-10 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Logo</span>
                    </div>
                )}
            </div>

            <nav className="flex flex-col items-center space-y-6">
                {[
                    { href: '/pos', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1 1 0 20 10 10 0 1 1 0-20zm0 6v8m-4-4h8" /> },
                    { href: '/dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
                    { href: '/products', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 4.9V17L12 22l-9-4.9V7z" /> },
                    { href: '/sales', icon: <><line x1="12" y1="1" x2="12" y2="23" strokeWidth={2} /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth={2} /></> },
                    { href: '/orders', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> },
                    { href: '/analytics', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
                    { href: '/employees', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4" strokeWidth={2}></circle><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3.13a4 4 0 0 1 0 7.75"></path></> },
                    { href: '/settings', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
                ]
                    .filter(({ href }) => accessibleRoute.some(route => route.route === href))
                    .map(({ href, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`${isActive(href) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {icon}
                            </svg>
                        </Link>
                    ))}
            </nav>

            <div className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center mb-4 mt-auto" onClick={onEditProfile}>
                <span className="text-white font-bold ">{usernameShort}</span>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <Link href={'/logout'} className={'text-gray-400 hover:text-red-500'}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H15" />
                        <path d="M19 12L15 8M19 12L15 16M19 12H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </Link>
            </div>

            {employeeProfile && (
                <EmployeeModal
                    employee={employeeProfile}
                    setEmployee={setEmployeeProfile}
                    onClose={() => setEmployeeProfile(null)}
                    onSubmit={function (employee: any): void {
                        throw new Error('Function not implemented.');
                    }}
                    isEdit={false}
                    isProfile={true}
                />
            )}
        </div>
    );
};

export default Sidebar;