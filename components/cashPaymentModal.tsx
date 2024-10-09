import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';


interface CashPaymentModalProps {
    isOpen: boolean,
    onClose: any,
    order: any,
    receivedAmount: string,
    handleCashInputChange: any,
    changeAmount: number,
    handleCashPayment: any,
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
    isOpen,
    onClose,
    order,
    receivedAmount,
    handleCashInputChange,
    changeAmount,
    handleCashPayment,
}) => {
    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50,
        },
        modal: {
            backgroundColor: getColor('background-primary'),
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
        },
        title: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: getColor('text-primary'),
        },
        closeButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: getColor('text-secondary'),
        },
        body: {
            marginBottom: '24px',
        },
        totalAmount: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: getColor('text-primary'),
            marginBottom: '16px',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: getColor('background-primary'),
        },
        changeAmount: {
            marginTop: '12px',
            fontSize: '16px',
            color: getColor('primary'),
        },
        footer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
        },
        button: {
            padding: '10px 16px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.3s',
        },
    }), [currentTheme]); // Recalculate styles when theme changes


    return (
        <AnimatePresence>
            {isOpen && (
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
                        <div style={styles.header}>
                            <h3 style={styles.title}>Cash Payment</h3>
                            <motion.button
                                style={styles.closeButton}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                            >
                                <X size={24} />
                            </motion.button>
                        </div>
                        <div style={styles.body}>
                            <p style={styles.totalAmount}>Total Amount: RM {order?.total.toFixed(2)}</p>
                            <input
                                style={styles.input}
                                type="number"
                                value={receivedAmount}
                                onChange={handleCashInputChange}
                                placeholder="Enter received amount (RM)"
                            />
                            {changeAmount > 0 && (
                                <motion.p
                                    style={styles.changeAmount}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Change: RM {changeAmount.toFixed(2)}
                                </motion.p>
                            )}
                        </div>
                        <div style={styles.footer}>
                            <motion.button
                                style={{ ...styles.button, backgroundColor: getColor('error'), color: getColor('on-primary') }}
                                whileHover={{ backgroundColor: '#dc2626' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                style={{ ...styles.button, backgroundColor: getColor('primary'), color: getColor('on-primary') }}
                                whileHover={{ backgroundColor: '#2563eb' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCashPayment}
                            >
                                Proceed
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CashPaymentModal;