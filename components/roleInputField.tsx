import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';
import { useCoreClient } from '@/utils/useClient';


interface RoleInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const RoleInput: React.FC<RoleInputProps> = ({ value, onChange, disabled = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { currentTheme } = useTheme(); // Get the current theme
    const { isInitialized, coreClient } = useCoreClient();
    /* initial suggestions */
    const suggestions = [
        'staff',
        'cashier',
        'manager',
    ];


    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        container: {
            position: 'relative' as const,
        },
        chipContainer: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '5px',
            marginBottom: '5px',
        },
        chip: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '2px 8px',
            borderRadius: '16px',
            fontSize: '0.9em',
            display: 'flex',
            alignItems: 'center',
        },
        chipButton: {
            marginLeft: '5px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1.1em',
            padding: '0 2px',
        },
        input: {
            width: '100%',
            padding: '8px',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '4px',
            fontSize: '1em',
            background: getColor('background-primary'),
        },
        suggestionsContainer: {
            position: 'absolute' as const,
            top: '100%',
            left: 0,
            width: '100%',
            border: `1px solid ${getColor('border')}`,
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            background: getColor('surface'),
            zIndex: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        suggestionItem: {
            padding: '8px',
            cursor: 'pointer',
        },
        disabledInput: {
            backgroundColor: getColor('disabled'),
            color: getColor('text-disabled'),
            cursor: 'not-allowed',
        },
        disabledChip: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
        },
    }), [currentTheme]); // Recalculate styles when theme changes


    const roles = value.split(',').filter(role => role.trim() !== '');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setShowSuggestions(true);
    };

    /* add new value to field */
    const addRole = useCallback((role: string) => {
        const newRoles = roles.includes(role) ? roles : [...roles, role];
        onChange(newRoles.join(','));
        setInputValue('');
        setShowSuggestions(false);
    }, [roles, onChange]);

    const removeRole = useCallback((e: React.MouseEvent, role: string) => {
        e.stopPropagation(); // Prevent the event from bubbling up
        const newRoles = roles.filter(r => r !== role);
        onChange(newRoles.join(','));
    }, [roles, onChange]);

    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        // Only prevent default if the click is directly on the container
        if (e.target === e.currentTarget) {
            e.preventDefault();
        }
    }, []);

    if (!isInitialized) return null;

    return (
        <div style={styles.container} onClick={handleContainerClick}>
            <motion.div style={styles.chipContainer} onClick={handleContainerClick}>
                <AnimatePresence>
                    {roles.map(role => (
                        <motion.span
                            key={role}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            style={disabled ? { ...styles.chip, ...styles.disabledChip } : styles.chip}
                        >
                            {role}
                            {role != 'admin' && !disabled && (
                                <motion.button
                                    style={styles.chipButton}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => removeRole(e, role)}
                                >
                                    <X size={15} />
                                </motion.button>
                            )}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </motion.div>
            {!disabled && (
                <motion.input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    style={styles.input}
                    whileFocus={{ boxShadow: `0 0 0 2px ${getColor('primary')}` }}
                />
            )}
            <AnimatePresence>
                {showSuggestions && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={styles.suggestionsContainer}
                        onClick={handleContainerClick}
                    >
                        {suggestions
                            .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
                            .map(suggestion => (
                                <motion.div
                                    key={suggestion}
                                    onClick={(e) => {
                                        handleContainerClick(e);
                                        addRole(suggestion);
                                    }}
                                    style={styles.suggestionItem}
                                    whileHover={{ backgroundColor: getColor('secondary') }}
                                >
                                    {suggestion}
                                </motion.div>
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoleInput;