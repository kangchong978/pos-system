'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PosProduct, PosVariationOption } from '@/common/type/order';
import { Product, Variation, VariationOption } from '@/common/type/product';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from './ThemeContext';

interface ButtonWithPopupProps {
    product: Product,
    posProduct: PosProduct,
    addProduct: (product: PosProduct) => {}
}




const ButtonWithPopup: React.FC<ButtonWithPopupProps> = ({ product, posProduct, addProduct }) => {
    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        container: {
            position: 'relative' as const,
        },
        button: {
            width: '100%',
            height: '40px',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold' as const,
            transition: 'background-color 0.3s',
        },
        popup: {
            position: 'absolute' as const,
            top: '100%',
            left: 0,
            width: '250px',
            backgroundColor: getColor('background-primary'),
            border: `1px solid ${getColor('border')}`,
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        variationContainer: {
            marginBottom: '12px',
        },
        variationTitle: {
            display: 'flex',
            marginBottom: '8px',
            fontWeight: 'bold' as const,
        },
        requiredStar: {
            color: getColor('secondary'),
            marginLeft: '4px',
        },
        optionsContainer: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '8px',
        },
        optionButton: {
            borderRadius: '15px',
            padding: '6px 12px',
            border: `1px solid ${getColor('border')}`,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
        },
        optionName: {
            marginRight: '4px',
        },
        optionPrice: {
            fontSize: '0.8rem',
        },
        addButton: {
            width: '100%',
            height: '40px',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold' as const,
            marginTop: '12px',
        },
    }), [currentTheme]); // Recalculate styles when theme changes


    const [showPopup, setShowPopup] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<PosVariationOption[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);
    const [price, setPrice] = useState(product.price);

    const handleOptionSelected = (k: string, v: VariationOption) => {
        if (!v.name) return;
        const existingItem = selectedOptions.find(e => e.pName === k && e.name === v.name);
        let newSelected;
        if (existingItem) {
            newSelected = selectedOptions.filter(e => !(e.pName === k && e.name === v.name));
        } else {
            newSelected = [...selectedOptions.filter(e => e.pName !== k), new PosVariationOption(k, v.name!, v.price!)];
        }
        posProduct.price = newSelected.reduce((total, e) => total + Number(e.price), 0) + product.price;
        setPrice(posProduct.price);
        setSelectedOptions(newSelected);
    };

    const handleAddOrderProduct = () => {
        if (product.variation.length != 0) {
            setShowPopup(true);
        } else {
            addProduct(posProduct);
        }
    };

    const handleAddOrderVariationsProduct = () => {
        const missingRequiredVariations = product.variation.filter(
            (v) => v.required && !selectedOptions.some((opt) => opt.pName === v.name)
        );
        if (missingRequiredVariations.length > 0) {
            toast.error(`Missing required variations: ${missingRequiredVariations.map((v) => v.name).join(', ')}`);
            return;
        }
        posProduct.variation = selectedOptions;
        addProduct(posProduct);
        setShowPopup(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div style={styles.container}>
            <motion.button
                style={styles.button}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddOrderProduct}
            >
                RM {product.price.toFixed(2)}
            </motion.button>

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        ref={popupRef}
                        style={styles.popup}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {product.variation.map((e, index) => (
                            <div key={index} style={styles.variationContainer}>
                                <div style={styles.variationTitle}>
                                    <h1 style={{ color: getColor('text-primary') }}>{e.name}</h1>
                                    {e.required && <p style={styles.requiredStar}>*</p>}
                                </div>
                                <div style={styles.optionsContainer}>
                                    {e.options.map((w) => {
                                        const target = selectedOptions.find((a) => a.pName == e.name);
                                        const selected = (target && target.name == w.name);
                                        return (
                                            <motion.button
                                                key={w.name}
                                                style={{
                                                    ...styles.optionButton,
                                                    backgroundColor: selected ? getColor('primary') : getColor('background-primary'),
                                                    color: selected ? getColor('on-primary') : getColor('text-primary'),
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOptionSelected(e.name, w)}
                                            >
                                                <span style={styles.optionName}>{w.name}</span>
                                                <span style={styles.optionPrice}>[+RM{w.price}]</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <motion.button
                            style={styles.addButton}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddOrderVariationsProduct}
                        >
                            RM {price.toFixed(2)}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ButtonWithPopup;