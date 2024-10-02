'use client'

import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from '@/styles/settings.module.css';
import CoreClient from '@/utils/client';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useCoreClient } from '@/utils/useClient';
import { setError, setLoading } from '@/redux_slices/appSlice';
import LoadingScreen from '@/components/LoadingScreen';


export default function Settings() {
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
    });
    const [routesAuth, setRoutesAuth] = useState<RouteAuth[]>([]);
    const [changed, setChanged] = useState<boolean>(false);

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

            // Handle logo upload if it's a File object
            if (companyInfo.company_logo instanceof File) {
                const logoUrl = await coreClient.uploadCompanyLogo(companyInfo.company_logo);
                updatedCompanyInfo.company_logo = logoUrl;
            }

            const settingsUpdated = await coreClient.updateSettings(updatedCompanyInfo);

            // Update route auth
            await coreClient.updateRouteAuth(routesAuth);

            if (settingsUpdated) {
                setChanged(false);
                toast.success('Changes saved successfully.');
                // Refresh the data to ensure we have the latest state
                loadInitialData();
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
        <div className={styles.container}>
            <h1 className={styles.title}>Settings</h1>

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Company Information</h2>
                <div className={styles.cardContent}>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-name">Company Name</label>
                        <input
                            id="company-name"
                            name="company_name"
                            value={companyInfo.company_name}
                            onChange={handleCompanyInfoChange}
                            placeholder="Enter company name"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-address">Address</label>
                        <input
                            id="company-address"
                            name="address"
                            value={companyInfo.address}
                            onChange={handleCompanyInfoChange}
                            placeholder="Enter company address"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-email">Email</label>
                        <input
                            id="company-email"
                            name="email"
                            type="email"
                            value={companyInfo.email}
                            onChange={handleCompanyInfoChange}
                            placeholder="Enter company email"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-website">Website</label>
                        <input
                            id="company-website"
                            name="website"
                            value={companyInfo.website}
                            onChange={handleCompanyInfoChange}
                            placeholder="Enter company website"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-phone">Phone Number</label>
                        <input
                            id="company-phone"
                            name="phone_number"
                            value={companyInfo.phone_number}
                            onChange={handleCompanyInfoChange}
                            placeholder="Enter company phone number"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-tax">Tax Rate (%)</label>
                        <input
                            id="company-tax"
                            name="tax"
                            type="number"
                            min="0"
                            step="0.01"
                            value={companyInfo.tax}
                            onChange={handleCompanyInfoChange}
                            placeholder="0.00"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company-logo">Company Logo</label>
                        <input
                            id="company-logo"
                            name="company_logo"
                            type="file"
                            accept="image/*"
                            onChange={handleCompanyInfoChange}
                            className={styles.input}
                        />
                        {companyInfo.company_logo && (
                            <div className={styles.logoPreview}>
                                <img
                                    src={typeof companyInfo.company_logo === 'string'
                                        ? 'http://localhost:6001' + companyInfo.company_logo
                                        : URL.createObjectURL(companyInfo.company_logo)
                                    }
                                    alt="Company logo preview"
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="receipt-footer">Receipt Footer Text</label>
                        <textarea
                            id="receipt-footer"
                            name="receipt_footer_text"
                            value={companyInfo.receipt_footer_text}
                            onChange={handleCompanyInfoChange}
                            placeholder="Enter receipt footer text"
                            className={styles.textarea}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Page Access Permissions</h2>
                <div className={styles.cardContent}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Route</th>
                                <th>Authorized Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routesAuth?.map((route) => (
                                <tr key={route.route}>
                                    <td>{route.route}</td>
                                    <td>
                                        <textarea
                                            value={route.role}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleRouteAuthChange(route.route!, e.target.value)}
                                            placeholder="Enter authorized roles"
                                            className={styles.textarea}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => window.location.reload()}>
                    Cancel
                </button>
                <button className={styles.button} onClick={handleSubmit}>
                    Save Changes
                </button>
            </div>
        </div>
    );
}