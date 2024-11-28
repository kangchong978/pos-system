'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading } from '@/redux_slices/appSlice';
import { useCoreClient } from '@/utils/useClient';
import toast from 'react-hot-toast';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';
import LoadingScreen from '@/components/LoadingScreen';

enum LoginPageState { LoginState, ResetState };

export default function Login() {
    const { currentTheme } = useTheme();
    const [pageState, setPageState] = useState<LoginPageState>(LoginPageState.LoginState);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [companySettings, setCompanySettings] = useState<CompanyInfo>();


    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized } = useCoreClient(true); // Pass true to skip auth check


    useEffect(() => {
        if (isInitialized && coreClient) {
            var loadSettings = async () => {
                var result = await coreClient?.loadSettings();
                setCompanySettings(coreClient.getSetting!);

            }
            loadSettings();
        }
    }, [isInitialized]);


    const styles = useMemo(() => ({
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${getColor('background-primary')} 0%, ${getColor('primary')} 100%)`,
            fontFamily: 'Arial, sans-serif',
        },
        loginContainer: {
            display: 'flex',
            backgroundColor: getColor('surface'),
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            width: '800px',
        },
        loginForm: {
            flex: 1,
            padding: '40px',
        },
        title: {
            fontSize: '28px',
            marginBottom: '20px',
            color: getColor('on-surface'),
        },
        subtitle: {
            fontSize: '20px',
            marginBottom: '30px',
            color: getColor('on-surface'),
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: `1px solid ${getColor('on-surface')}20`,
            borderRadius: '4px',
            fontSize: '16px',
            color: getColor('on-surface'),
            backgroundColor: getColor('background-primary'),
        },
        button: {
            width: '100%',
            padding: '12px',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        imageContainer: {
            flex: 1,
            background: getColor('background-primary'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
        },
        image: {
            maxWidth: '100%',
            height: 'auto',
        },
        resetContainer: {
            backgroundColor: getColor('surface'),
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            width: '400px',
        },
        resetTitle: {
            fontSize: '24px',
            marginBottom: '20px',
            color: getColor('on-surface'),
            textAlign: 'center' as const,
        },
        errorText: {
            color: getColor('error'),
            marginBottom: '15px',
        },
        svgColor: {
            color: getColor('primary'), // This will be used for the SVG fill color
        },
    }), [currentTheme]);

    const passwordValidation = (v: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return regex.test(v);
    }

    const handleResetPassword = async () => {
        if (!passwordValidation(newPassword)) {
            setError(`At least one lowercase letter.<br />
                At least one uppercase letter.<br />
                At least one digit.<br />
                At least one special character (non-word character).<br />
                Minimum length of 6 characters.`);
            return;
        } else if (newPassword != newPasswordConfirm) {
            setError('Confirmation password does not match.');
            return;
        }
        dispatch(setLoading(true));
        try {
            if (coreClient) {
                const result = await coreClient.resetPassword({ newPassword, newPasswordConfirm });
                if (result) {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error('Password reset failed:', error);
            toast.error('Failed to reset password');
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleLogin = async () => {
        dispatch(setLoading(true));
        try {
            if (coreClient) {
                const result = await coreClient.login({ username, password });
                if (result) {
                    if (result.updatePasswordRequired) {
                        setPageState(LoginPageState.ResetState);
                    } else {
                        router.push('/');
                    }
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (!isInitialized) {
        return <LoadingScreen />;
    }


    if (pageState === LoginPageState.LoginState) {
        return (
            <div style={styles.container}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    style={styles.loginContainer}
                >
                    <div style={styles.loginForm}>
                        <h1 style={styles.title}> {companySettings?.company_name}</h1>
                        <h2 style={styles.subtitle}>Login</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                        <button
                            onClick={handleLogin}
                            style={styles.button}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = getColor('primary-dark')}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = getColor('primary')}
                        >
                            Log In
                        </button>
                    </div>
                    <div style={styles.imageContainer}>
                        {/* <img src="undraw_tasting_re_3k5a.svg" alt="Login illustration" style={styles.image} /> */}
                        <img src={`http://localhost:6001${companySettings?.company_logo as string}`} alt="Company Logo" />
                    </div>
                </motion.div>
            </div>
        );
    } else if (pageState === LoginPageState.ResetState) {
        return (
            <div style={styles.container}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    style={styles.resetContainer}
                >
                    <h1 style={styles.resetTitle}>Hi {username}, please set your password</h1>
                    <input
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        style={styles.input}
                    />
                    {error && (
                        <p style={styles.errorText} dangerouslySetInnerHTML={{ __html: error }} />
                    )}
                    <button
                        onClick={handleResetPassword}
                        style={styles.button}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = getColor('primary-dark')}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = getColor('primary')}
                    >
                        Confirm
                    </button>
                </motion.div>
            </div>
        );
    }

    return null;
}