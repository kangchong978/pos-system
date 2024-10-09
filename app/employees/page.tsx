'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import EmployeeModal from '../../components/empoyeeModal';
import toast from 'react-hot-toast';
import TempPasswordModal from '../../components/tempPasswordModal';
import { useCoreClient } from '@/utils/useClient';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setLoading } from '@/redux_slices/appSlice';
import LoadingScreen from '@/components/LoadingScreen';
import RoleInput from '@/components/roleInputField';

import { Search } from 'lucide-react';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';



export default function Employees() {
    const { currentTheme } = useTheme(); // Get the current theme

    const styles = useMemo(() => ({
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
        container: {
            minHeight: '100vh',
            backgroundColor: getColor('background-primary'),
            padding: '2rem',
        },
        main: {
            maxWidth: '1200px',
            margin: '0 auto',
        },

        searchContainer: {
            display: 'flex',
            marginBottom: '1.5rem',
        },
        searchInput: {
            width: '100%',
            padding: '10px 16px',
            paddingLeft: '40px',
            borderRadius: '8px',
            border: `1px solid ${getColor('border')}`,
            fontSize: '14px',
            backgroundColor: getColor('background-primary'),
        },
        searchIcon: {
            position: 'absolute' as const,
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: getColor('text-secondary'),
        },
        addButton: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            width: '200px',
        },
        table: {
            width: '100%',
            borderSpacing: '0 0.5rem',
        },
        tableHeader: {
            backgroundColor: getColor('surface'),
            color: getColor('text-primary'),
            fontWeight: 'bold',
            padding: '1rem',
            borderBottom: `2px solid ${getColor('primary')}`,
        },
        tableRow: {
            backgroundColor: getColor('surface'),
            transition: 'box-shadow 0.3s',
            color: getColor('text-primary'),
        },
        tableCell: {
            padding: '1rem',
            borderBottom: `1px solid ${getColor('border')}`,
        },
        actionButton: {
            marginRight: '0.5rem',
            padding: '0.5rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
    }), [currentTheme]); // Re-compute styles when theme changes



    const [searchTerm, setSearchTerm] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [savedTempPassword, setSavedTempPassword] = useState<{ id: number; tempPassword: string }[]>([]);
    const [tempPassword, setTempPassword] = useState<string>('');
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { isInitialized, coreClient, setAppLoading } = useCoreClient();
    const dispatch = useDispatch<AppDispatch>();

    const filteredEmployees = employees.filter(employee =>
        employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const loadUsers = async () => {
        if (!coreClient) return;
        setIsPageLoading(true);
        dispatch(setLoading(true));
        try {
            const result = await coreClient.getEmployees();
            setEmployees(result);
        } catch (error) {
            console.error('Failed to load employees:', error);
            toast.error('Failed to load employees');
        } finally {
            setIsPageLoading(false);
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (isInitialized && coreClient) {
            loadUsers();
        }
    }, [isInitialized, coreClient]);

    const handleEditEmployee = (employee: Employee) => {
        setIsEdit(true);
        setCurrentEmployee(employee);
    }

    const handleAddEmployee = () => {
        setIsEdit(false);
        setCurrentEmployee({ username: '', password: '', email: '', phoneNumber: '', role: '' });
    }

    const handleDeleteEmployee = async (data: Employee) => {
        if (!coreClient || !data.id) return;
        dispatch(setLoading(true));
        try {
            await coreClient.removeUser(data.id);
            await loadUsers();
            toast.success('Employee deleted successfully');
        } catch (error) {
            console.error('Failed to delete employee:', error);
            toast.error('Failed to delete employee');
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleSubmitEmployee = async (data: Employee) => {
        if (!coreClient) return;
        if (data.email === '' || data.phoneNumber === '' || data.username === '' || data.role?.length === 0) {
            toast.error("Please fill in all information.");
            return;
        }

        dispatch(setLoading(true));
        try {
            if (isEdit) {
                await coreClient.updateUser(data);
            } else {
                const result = await coreClient.registerUser(data);
                if (result) {
                    setSavedTempPassword([{ 'id': result.id, 'tempPassword': result.tempPassword }, ...savedTempPassword]);
                    setTempPassword(result.tempPassword);
                }
            }
            setCurrentEmployee(null);
            await loadUsers();
            toast.success(isEdit ? 'Employee updated successfully' : 'Employee added successfully');
        } catch (error) {
            console.error('Failed to submit employee:', error);
            toast.error('Failed to submit employee');
        } finally {
            dispatch(setLoading(false));
        }
    }



    if (isPageLoading) {
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
                    <h1 style={styles.title}>Employees</h1>
                </motion.header>

                <motion.div
                    style={styles.searchContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div style={{ position: 'relative', width: '100%', marginRight: '16px' }}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search orders by ID..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={styles.addButton}
                        onClick={handleAddEmployee}
                    >
                        Add Employee
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Username</th>
                                <th style={styles.tableHeader}>Email</th>
                                <th style={styles.tableHeader}>Phone Number</th>
                                <th style={styles.tableHeader}>Roles</th>
                                <th style={styles.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => {
                                const tempPassword = savedTempPassword.find(item => item.id === employee.id)?.tempPassword;

                                return (
                                    <motion.tr
                                        key={employee.username}
                                        style={styles.tableRow}
                                        whileHover={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                                    >
                                        <td style={styles.tableCell}>{employee.username}</td>
                                        <td style={styles.tableCell}>{employee.email}</td>
                                        <td style={styles.tableCell}>{employee.phoneNumber}</td>
                                        <td style={styles.tableCell}>
                                            <RoleInput
                                                value={employee?.role ?? ''}
                                                onChange={() => { }}
                                                disabled={true}
                                            />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <motion.button
                                                disabled={tempPassword == undefined}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{ ...styles.actionButton, backgroundColor: getColor((tempPassword) ? 'secondary' : 'background-secondary'), color: getColor('on-primary') }}
                                                onClick={() => setTempPassword(tempPassword ?? '')}
                                            >
                                                View Password
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{ ...styles.actionButton, backgroundColor: getColor('secondary'), color: getColor('on-primary') }}
                                                onClick={() => handleEditEmployee(employee)}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{ ...styles.actionButton, backgroundColor: getColor('primary'), color: getColor('on-primary') }}
                                                onClick={() => handleDeleteEmployee(employee)}
                                            >
                                                Delete
                                            </motion.button>

                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </motion.div>

                {currentEmployee && <EmployeeModal
                    employee={currentEmployee}
                    setEmployee={setCurrentEmployee}
                    onClose={() => setCurrentEmployee(null)}
                    onSubmit={handleSubmitEmployee}
                    isEdit={isEdit}
                    isProfile={false}
                    onPasswordReset={function (): void {
                        // Implementation not provided
                    }} />}
                {tempPassword && <TempPasswordModal
                    tempPassword={tempPassword}
                    onClose={() => setTempPassword('')}
                />}
            </main>
        </div>
    );



}