import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleInput from './roleInputField';
import toast from 'react-hot-toast';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';


interface EmployeeModalProps {
    employee: Employee;
    setEmployee: any;
    onClose: () => void;
    onSubmit: (employee: any) => void;
    isEdit: boolean;
    isProfile: boolean;
    onPasswordReset?: (employee: any) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = (props) => {
    const { isEdit, isProfile, employee, setEmployee, onClose, onSubmit, onPasswordReset } = props;
    const { currentTheme } = useTheme(); // Get the current theme
    const [errors, setErrors] = useState<any>({});

    const styles = useMemo(() => ({
        modalOverlay: {
            position: 'fixed' as const,
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: getColor('surface'),
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '600px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto' as const,
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: getColor('on-surface'),
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
        },
        fullWidth: {
            gridColumn: '1 / -1',
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '4px',
            fontSize: '1rem',
            color: getColor('text-primary'),
            backgroundColor: getColor('background-primary'),
        },
        label: {
            display: 'block',
            marginBottom: '0.25rem',
            color: getColor('on-surface'),
            fontWeight: 'medium',
        },
        errorLabel: {
            display: 'block',
            marginBottom: '0.25rem',
            color: getColor('error'),
            fontWeight: 'medium',
        },
        button: {
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            border: 'none',
            color: getColor('on-primary'),
            marginLeft: '0.5rem',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
        },
    }), [currentTheme]); // Re-compute styles when theme changes

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleRoleChange = (value: string) => {
        setEmployee({ ...employee, role: value });
    };

    const validateForm = () => {
        const errors: any = {};

        if (!employee.dob) {
            errors.dob = "Date of Birth is required";
        } else if (isNaN(Date.parse(employee.dob))) {
            errors.dob = "Invalid Date of Birth format";
        }

        if (!employee.email?.trim()) {
            errors.email = "Email is required";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(employee.email)) {
            errors.email = "Invalid email format";
        }

        if (!employee.gender?.trim()) {
            errors.gender = "Gender is required";
        } else if (!["male", "female", "other"].includes(employee.gender)) {
            errors.gender = "Gender must be Male, Female, or Other";
        }

        if (!employee.phoneNumber?.trim()) {
            errors.phoneNumber = "Phone number is required";
        } else if (!/^\d+$/.test(employee.phoneNumber)) {
            errors.phoneNumber = "Phone number must contain only numbers";
        }

        if (!employee.role?.trim()) {
            errors.role = "Role is required";
        }

        if (!employee.username?.trim()) {
            errors.username = "Username is required";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmitEmployee = () => {
        if (!validateForm()) return;
        onSubmit(employee);
    };

    const handleResetEmployeePassword = () => {
        if (onPasswordReset)
            onPasswordReset(employee);
    }

    const buildHeaderTitle = () => {
        if (isEdit) return 'Edit Employee';
        if (isProfile) return 'Edit Profile';
        return 'Add New Employee';
    };

    const getSubmitButtonText = () => {
        if (isProfile) return "Save";
        if (isEdit) return "Save Changes";
        return "Add Employee";
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.modalOverlay}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={styles.modalContent}
                >
                    <h3 style={styles.title}>{buildHeaderTitle()}</h3>
                    <div style={styles.formGrid}>
                        <div>
                            <label style={styles.label}>
                                Username:
                                <input
                                    disabled={isEdit || isProfile}
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    style={styles.input}
                                    value={employee?.username}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label htmlFor="username-error" style={styles.errorLabel}> {errors.username}</label>
                        </div>
                        <div>
                            <label style={styles.label}>
                                Email Address:
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    style={styles.input}
                                    value={employee?.email}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label htmlFor="email-error" style={styles.errorLabel}> {errors.email}</label>
                        </div>
                        <div>
                            <label style={styles.label}>
                                Phone Number:
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone"
                                    style={styles.input}
                                    value={employee?.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label htmlFor="phone-number-error" style={styles.errorLabel}> {errors.phoneNumber}</label>

                        </div>
                        <div>
                            <label style={styles.label}>
                                Date of Birth:
                                <input
                                    type="date"
                                    name="dob"
                                    style={styles.input}
                                    value={employee?.dob}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label htmlFor="dob-error" style={styles.errorLabel}> {errors.dob}</label>
                        </div>
                        <div>
                            <label style={styles.label}>
                                Gender:
                                <select
                                    name="gender"
                                    style={styles.input}
                                    value={employee?.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                            <label htmlFor="gender-error" style={styles.errorLabel}> {errors.gender}</label>
                        </div>
                        <div style={styles.fullWidth}>
                            <label style={styles.label}>
                                Address:
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    style={styles.input}
                                    value={employee?.address}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
                        <div style={styles.fullWidth}>
                            <label style={styles.label}>
                                Role:
                                <RoleInput
                                    value={employee?.role ?? ''}
                                    onChange={handleRoleChange}
                                    disabled={isProfile}
                                />
                            </label>
                            <label htmlFor="role-error" style={styles.errorLabel}> {errors.role}</label>
                        </div>
                    </div>
                    <div style={styles.buttonContainer}>
                        {isEdit ? <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ ...styles.button, backgroundColor: getColor('warning') }}
                            onClick={handleResetEmployeePassword}
                        >
                            Reset Password
                        </motion.button> : <div />}
                        <div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ ...styles.button, backgroundColor: getColor('error') }}
                                onClick={onClose}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ ...styles.button, backgroundColor: getColor('success') }}
                                onClick={handleSubmitEmployee}
                            >
                                {getSubmitButtonText()}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmployeeModal;