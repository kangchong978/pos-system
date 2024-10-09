'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/common/type/product';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from './ThemeContext';


interface CategoryListProps {
    categories: Category[];
    selectedCategory: Category;
    onSelectedCallback: Function;
}




const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectedCallback }) => {
    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        container: {
            position: 'relative' as const,
        },
        triggerButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: getColor('background-primary'),
            border: `1px solid ${getColor('border')}`,
            borderRadius: '9999px',
            cursor: 'pointer',
            color: getColor('text-primary'),
            fontWeight: 'bold' as const,
            width: '200px',
        },
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: getColor('background-overlay'),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        popup: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            height: '50vh',
            backgroundColor: getColor('background-primary'),
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto' as const,
            padding: '20px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '16px',
            padding: '20px',
        },
        categoryButton: {
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center' as const,
            transition: 'background-color 0.3s, color 0.3s',
            fontSize: '16px',
        },
    }), [currentTheme]); // Recalculate styles when theme changes


    const [isExpanded, setIsExpanded] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div style={styles.container}>
            <motion.button
                style={styles.triggerButton}
                onClick={toggleExpand}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {selectedCategory.name}
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        style={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            ref={popupRef}
                            style={styles.popup}
                            initial={{ y: '-100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                        >
                            <div style={styles.grid}>
                                {categories.map((category) => (
                                    <motion.button
                                        key={category.id}
                                        style={{
                                            ...styles.categoryButton,
                                            backgroundColor: selectedCategory.id === category.id
                                                ? getColor('primary')
                                                : getColor('background-secondary'),
                                            color: selectedCategory.id === category.id
                                                ? getColor('on-primary')
                                                : getColor('text-primary'),
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            onSelectedCallback(category);
                                            setIsExpanded(false);
                                        }}
                                    >
                                        {category.name}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryList;