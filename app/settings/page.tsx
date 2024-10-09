'use client'

import React, { useEffect, useState, ChangeEvent, useMemo } from 'react';
import CoreClient from '@/utils/client';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useCoreClient } from '@/utils/useClient';
import { setError, setLoading } from '@/redux_slices/appSlice';
import LoadingScreen from '@/components/LoadingScreen';
import { motion } from 'framer-motion';
import RoleInput from '@/components/roleInputField';
import LogoPreview from '@/components/logoPreview';
import ThemeSwitcher from '@/components/themeSwitcher';
import { getColor, useTheme } from '@/components/ThemeContext';

export default function Settings() {
    const { themeBase } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized, isLoading } = useCoreClient();

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        company_name: '',
        company_logo: null,
        tax: 0,
        address: '',
        email: '',
        website: '',
        phone_number: '',
        receipt_footer_text: '',
        theme: '',
    });
    const [routesAuth, setRoutesAuth] = useState<RouteAuth[]>([]);
    const [changed, setChanged] = useState<boolean>(false);

    const styles = useMemo(() => ({
        container: {
            padding: '2rem',
            backgroundColor: getColor('background-primary'),
            minHeight: '100vh',
        },
        main: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        content: {
            backgroundColor: getColor('surface'),
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        section: {
            marginBottom: '2rem',
        },
        sectionTitle: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: getColor('on-surface'),
        },
        formGroup: {
            marginBottom: '1rem',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            color: getColor('text-secondary'),
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            backgroundColor: getColor('background-primary'),
            color: getColor('text-primary'),
            borderRadius: '4px',
            fontSize: '1rem',
        },
        textarea: {
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            backgroundColor: getColor('background-primary'),
            color: getColor('text-primary'),
            borderRadius: '4px',
            fontSize: '1rem',
            minHeight: '100px',
        },
        button: {
            padding: '0.5rem 1rem',
            backgroundColor: getColor('secondary'),
            color: getColor('on-primary'),
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem',
        },
        saveButton: {
            backgroundColor: changed ? getColor('primary') : getColor('disabled'),
            color: changed ? getColor('on-primary') : getColor('on-disabled'),
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
        },
        th: {
            textAlign: 'left' as const,
            padding: '0.5rem',
            borderBottom: `1px solid ${getColor('border')}`,
            color: getColor('on-surface'),
        },
        td: {
            padding: '0.5rem',
            borderBottom: `1px solid ${getColor('border')}`,
            color: getColor('text-primary'),
        },
        gridContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
        },
        fileInputContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        },
        fileInput: {
            flex: 1,
        },
    }), [themeBase, changed]);

    useEffect(() => {
        if (isInitialized && coreClient) {
            loadInitialData();
        }
    }, [isInitialized, coreClient]);

    const loadInitialData = async () => {
        if (!coreClient) return;
        dispatch(setLoading(true));
        try {
            const settings = await coreClient.getSettings();
            setCompanyInfo(settings);

            const result = await coreClient.getRoutesAuth();
            setRoutesAuth(result);
        } catch (error) {
            console.error('Error loading initial data:', error);
            dispatch(setError('Failed to load settings'));
            toast.error('Failed to load settings. Please try again.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRouteAuthChange = (route: string, value: string): void => {
        setRoutesAuth(prev => prev.map(r => r.route === route ? { ...r, role: value } : r));
        setChanged(true);
    };

    const handleCompanyInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            const files = fileInput.files;
            if (files && files[0]) {
                setCompanyInfo(prev => ({ ...prev, [name]: files[0] }));
            }
        } else if (name === 'tax') {
            setCompanyInfo(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setCompanyInfo(prev => ({ ...prev, [name]: value }));
        }
        setChanged(true);
    };

    const handleThemeChange = (newTheme: string) => {
        setCompanyInfo(prev => ({ ...prev, theme: newTheme }));
        setChanged(true);
    };

    const handleSubmit = async (): Promise<void> => {
        if (!changed) {
            toast.error('No changes.');
            return;
        }
        if (!coreClient) {
            toast.error('Client not initialized');
            return;
        }

        dispatch(setLoading(true));
        try {
            let updatedCompanyInfo = { ...companyInfo };

            if (companyInfo.company_logo instanceof File) {
                const logoUrl = await coreClient.uploadCompanyLogo(companyInfo.company_logo);
                updatedCompanyInfo.company_logo = logoUrl;
            }

            const settingsUpdated = await coreClient.updateSettings(updatedCompanyInfo);
            await coreClient.updateRouteAuth(routesAuth);

            if (settingsUpdated) {
                setChanged(false);
                toast.success('Changes saved successfully.');
                loadInitialData();
                await coreClient.loadSettings();
            } else {
                toast.error('Failed to save changes. Please try again.');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            dispatch(setError('Failed to save changes'));
            toast.error('Failed to save changes. Please try again.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (isLoading || !isInitialized || !coreClient) {
        return <LoadingScreen />;
    }

    return (
        <div style={styles.container}>
            <main style={styles.main}>
                <motion.header
                    style={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={styles.title}>Settings</h1>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={styles.content}
                >
                    <motion.div style={styles.section} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <h2 style={styles.sectionTitle}>Company Information</h2>
                        <div style={styles.gridContainer}>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-name" style={styles.label}>Company Name</label>
                                <input
                                    id="company-name"
                                    name="company_name"
                                    value={companyInfo.company_name}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="Enter company name"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-address" style={styles.label}>Address</label>
                                <input
                                    id="company-address"
                                    name="address"
                                    value={companyInfo.address}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="Enter company address"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-email" style={styles.label}>Email</label>
                                <input
                                    id="company-email"
                                    name="email"
                                    type="email"
                                    value={companyInfo.email}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="Enter company email"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-website" style={styles.label}>Website</label>
                                <input
                                    id="company-website"
                                    name="website"
                                    value={companyInfo.website}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="Enter company website"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-phone" style={styles.label}>Phone Number</label>
                                <input
                                    id="company-phone"
                                    name="phone_number"
                                    value={companyInfo.phone_number}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="Enter company phone number"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-tax" style={styles.label}>Tax Rate (%)</label>
                                <input
                                    id="company-tax"
                                    name="tax"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={companyInfo.tax}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="0.00"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="company-logo" style={styles.label}>Company Logo</label>
                                <div style={styles.fileInputContainer}>
                                    <input
                                        id="company-logo"
                                        name="company_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCompanyInfoChange}
                                        style={{ ...styles.input, ...styles.fileInput }}
                                    />
                                    <LogoPreview logo={companyInfo.company_logo} />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="receipt-footer" style={styles.label}>Receipt Footer Text</label>
                                <textarea
                                    id="receipt-footer"
                                    name="receipt_footer_text"
                                    value={companyInfo.receipt_footer_text}
                                    onChange={handleCompanyInfoChange}
                                    placeholder="Enter receipt footer text"
                                    style={styles.textarea}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div style={styles.section} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <h2 style={styles.sectionTitle}>Page Access Permissions</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Route</th>
                                    <th style={styles.th}>Authorized Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routesAuth?.map((route) => (
                                    <tr key={route.route}>
                                        <td style={styles.td}>{route.route}</td>
                                        <td style={styles.td}>
                                            <RoleInput
                                                value={route.role ?? ''}
                                                onChange={(value) => handleRouteAuthChange(route.route!, value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>

                    <h2 style={styles.sectionTitle}>Themes</h2>
                    <ThemeSwitcher onThemeChange={handleThemeChange} />

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={styles.button}
                            onClick={() => window.location.reload()}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ ...styles.button, ...styles.saveButton }}
                            onClick={handleSubmit}
                            disabled={!changed}
                        >
                            Save Changes
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}