import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getColor } from '../utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';

interface TempPasswordModalProps {
    tempPassword: string;
    onClose: () => void;
}

const TempPasswordModal: React.FC<TempPasswordModalProps> = ({ tempPassword, onClose }) => {
    const { currentTheme } = useTheme();

    const styles = useMemo(() => ({
        overlay: {
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        } as React.CSSProperties,
        modal: {
            backgroundColor: getColor('surface'),
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '400px',
            maxWidth: '90%',
        } as React.CSSProperties,
        title: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: getColor('on-surface'),
            marginBottom: '16px',
        } as React.CSSProperties,
        input: {
            width: '100%',
            padding: '8px 12px',
            border: `1px solid ${getColor('outline')}`,
            borderRadius: '4px',
            marginBottom: '12px',
            color: getColor('on-surface'),
            backgroundColor: getColor('surface-variant'),
        } as React.CSSProperties,
        message: {
            color: getColor('on-surface'),
            fontSize: '0.875rem',
            marginBottom: '16px',
            lineHeight: '1.5',
        } as React.CSSProperties,
        buttonContainer: {
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
        } as React.CSSProperties,
        copyButton: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        } as React.CSSProperties,
        closeButton: {
            backgroundColor: getColor('error'),
            color: getColor('on-surface'),
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        } as React.CSSProperties,
    }), [currentTheme]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tempPassword);
        toast.success('Password copied to clipboard!');
    };

    return (
        <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                style={styles.modal}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                <h2 style={styles.title}>Temporary Password</h2>
                <input
                    type="text"
                    value={tempPassword}
                    readOnly
                    style={styles.input}
                />
                <p style={styles.message}>
                    Kindly share this temporary password together with username to your employee to proceed with the first login.
                </p>
                <div style={styles.buttonContainer}>
                    <motion.button
                        style={styles.copyButton}
                        onClick={copyToClipboard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Copy
                    </motion.button>
                    <motion.button
                        style={styles.closeButton}
                        onClick={onClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TempPasswordModal;