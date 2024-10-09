import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import getFirstCharacters from '@/common/common';
import EmployeeModal from './empoyeeModal';
import EmployeeFeedbackModal from './employeeFeedbackModal';
import { useCoreClient } from '@/utils/useClient';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading, verifyIsRequiredFeedback } from '@/redux_slices/appSlice';
import { getColor } from '../utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const pathname = usePathname();
    const [usernameShort, setUsernameShort] = useState('');
    const [accessibleRoute, setAccessibleRoute] = useState<RouteAuth[]>([]);
    const [employeeProfile, setEmployeeProfile] = useState<Employee | null>(null);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);

    const { isInitialized, coreClient, showEmployeeFeedback } = useCoreClient(pathname == '/login' || pathname == '/logout');
    const dispatch = useDispatch<AppDispatch>();
    const { currentTheme } = useTheme();

    const styles = useMemo(() => ({
        sidebar: {
            width: '80px',
            backgroundColor: getColor('surface'),
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        } as React.CSSProperties,
        logo: {
            width: '60px',
            height: '60px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        } as React.CSSProperties,
        nav: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
        } as React.CSSProperties,
        icon: {
            width: '24px',
            height: '24px',
            transition: 'all 0.3s ease',
        } as React.CSSProperties,
        profile: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: getColor('primary'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getColor('on-primary'),
            fontWeight: 'bold',
            marginTop: 'auto',
            marginBottom: '20px',
            cursor: 'pointer',
        } as React.CSSProperties,
        logoImage: {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
        } as React.CSSProperties,
    }), [currentTheme]);

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
                    const settings = coreClient.getSetting;
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
    }, [isInitialized, coreClient?.getUserInfo, coreClient?.getSetting, dispatch]);

    const isActive = (path: string) => pathname === path;

    const onEditProfile = () => {
        if (coreClient) {
            const userInfo = coreClient.getUserInfo;
            if (userInfo) {
                const employee: Employee = {
                    email: userInfo.email,
                    phoneNumber: userInfo.phoneNumber,
                    role: userInfo.role.toString(),
                    username: userInfo.username,
                    // tempPassword: userInfo.tempPassword,
                    gender: userInfo.gender,
                    address: userInfo.address,
                    id: userInfo.id,

                };
                setEmployeeProfile(employee);
            }
        }
    }

    const handleSubmitProfile = async (data: Employee) => {
        if (!coreClient) return;
        if (data.email === '' || data.phoneNumber === '' || data.username === '' || data.role?.length === 0) {
            toast.error("Please fill in all information.");
            return;
        }

        dispatch(setLoading(true));
        try {
            const userInfo = coreClient.getUserInfo;

            if (!userInfo) return;
            // if (isEdit) {
            await coreClient.updateUser({ ...data, id: userInfo.id });
            // } else {
            //     const result = await coreClient.registerUser(data);
            //     if (result) {
            //         setSavedTempPassword([{ 'id': result.id, 'tempPassword': result.tempPassword }, ...savedTempPassword]);
            //         setTempPassword(result.tempPassword);
            //     }
            // }
            // setCurrentEmployee(null);
            // await loadUsers();
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to submit profile:', error);
            toast.error('Failed to submit profile');
        } finally {
            dispatch(setLoading(false));
        }
    }


    if (pathname == '/login' || !isInitialized) return null;

    return (
        <motion.div
            style={styles.sidebar}
            initial={{ x: -80 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={styles.logo}>
                {companyLogo && <img src={companyLogo} alt="Company Logo" style={styles.logoImage} />}
            </div>

            <nav style={styles.nav}>
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
                        <motion.div
                            key={href}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href={href}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                        ...styles.icon,
                                        color: isActive(href) ? getColor('primary') : getColor('on-surface'),
                                    }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {icon}
                                </svg>
                            </Link>
                        </motion.div>
                    ))}
            </nav>

            <motion.div
                style={styles.profile}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEditProfile}
            >
                <span>{usernameShort}</span>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <Link href={'/logout'}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={styles.icon} fill="none" viewBox="0 0 24 24" stroke={getColor('on-surface')}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H15" />
                        <path d="M19 12L15 8M19 12L15 16M19 12H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </Link>
            </motion.div>
            {coreClient && coreClient.isLoggedIn && showEmployeeFeedback && < EmployeeFeedbackModal
                isOpen={true}
                onClose={() => { }}
                onSubmit={async (v) => {
                    await coreClient.submitEmployeeFeedback(v);
                    coreClient.updateClientFeedback = true;
                    dispatch(verifyIsRequiredFeedback())

                }}
                username={coreClient.getUserInfo!.username}
            />
            }
            {employeeProfile && (
                <EmployeeModal
                    employee={employeeProfile}
                    setEmployee={setEmployeeProfile}
                    onClose={() => setEmployeeProfile(null)}
                    onSubmit={handleSubmitProfile}
                    isEdit={false}
                    isProfile={true}
                    onPasswordReset={function (): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            )}

        </motion.div>

    );
};

export default Sidebar;