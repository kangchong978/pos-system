'use client';

import React, { useMemo } from 'react';
import { OrderType } from "@/common/type/order";
import { motion } from 'framer-motion';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';

interface OrderTypeButtonProps {
    value: string;
    onChange: Function;
}



const OrderTypeButton: React.FC<OrderTypeButtonProps> = ({ value, onChange }) => {
    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({

        buttonGroup: {
            display: 'inline-flex',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: `2px solid ${getColor('border')}`,
        },
        button: {
            padding: '8px 16px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s',
        },
        activeButton: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
        },
        inactiveButton: {
            backgroundColor: getColor('background-secondary'),
            color: getColor('text-secondary'),
        }

    }), [currentTheme]); // Recalculate styles when theme changes

    const options = Object.values(OrderType);

    return (
        <div style={styles.buttonGroup}>
            {options.map((option: string) => (
                <motion.button
                    key={option}
                    style={{
                        ...styles.button,
                        ...(value === option ? styles.activeButton : styles.inactiveButton),
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange(option)}
                >
                    {option}
                </motion.button>
            ))}
        </div>
    );
};

export default OrderTypeButton;