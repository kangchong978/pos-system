import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';



interface CategoriesChipsProps {
    categories: string[];
    onSelectCallback?: (category: string) => void;
    isEditable?: boolean;
}

const CategoriesChips: React.FC<CategoriesChipsProps> = ({
    categories,
    onSelectCallback,
    isEditable = false
}) => {

    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        container: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
        },
        chip: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '4px 8px',
            margin: '0 4px 4px 0',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
        },
        chipText: {
            margin: '0 4px',
        },
        removeButton: {
            cursor: 'pointer',
            marginLeft: '4px',
            fontSize: '14px',
        },
        ellipsis: {
            color: getColor('primary'),
            padding: '4px 8px',
            margin: '0 4px 4px 0',
        },
    }), [currentTheme]); // Recalculate styles when theme changes



    const displayCategories = isEditable ? categories : categories.slice(0, 1);

    return (
        <div style={styles.container}>
            <AnimatePresence>
                {displayCategories.map((category, index) => (
                    <motion.div
                        key={category}
                        style={styles.chip}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        layout
                    >
                        <span style={styles.chipText}>{category}</span>
                        {isEditable && onSelectCallback && (
                            <motion.span
                                style={styles.removeButton}
                                onClick={() => onSelectCallback(category)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ✕
                            </motion.span>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
            {!isEditable && categories.length > 1 && (
                <motion.div
                    style={styles.ellipsis}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    ...
                </motion.div>
            )}
        </div>
    );
};

export default CategoriesChips;