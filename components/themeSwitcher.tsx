import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

type ThemeBase = 'ocean' | 'mcd' | 'wendys' | 'japanese' | 'chinese';

interface ThemeSelectorProps {
    onThemeChange: (theme: ThemeBase) => void;
}

const themes: { name: ThemeBase; displayName: string; colors: { light: string[]; dark: string[] } }[] = [
    { name: 'ocean', displayName: 'Ocean', colors: { light: ['#FFFFFF', '#6ba6e8', '#50e3c2'], dark: ['#1A202C', '#6ba6e8', '#50e3c2'] } },
    { name: 'mcd', displayName: 'McDonald\'s', colors: { light: ['#FFFFFF', '#ffc72c', '#da291c'], dark: ['#27251f', '#ffc72c', '#da291c'] } },
    { name: 'wendys', displayName: 'Wendy\'s', colors: { light: ['#FFFFFF', '#e82c21', '#0066cc'], dark: ['#222222', '#e82c21', '#0066cc'] } },
    { name: 'japanese', displayName: 'Japanese', colors: { light: ['#FFFFF7', '#bd4932', '#70887e'], dark: ['#222222', '#bd4932', '#70887e'] } },
    { name: 'chinese', displayName: 'Chinese', colors: { light: ['#FFFFFF', '#c8102e', '#ffc629'], dark: ['#222222', '#c8102e', '#ffc629'] } },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
    const { themeBase, setThemeBase } = useTheme();

    const handleThemeChange = (newThemeBase: ThemeBase) => {
        onThemeChange(newThemeBase);
        setThemeBase(newThemeBase);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {themes.map((t) => (
                    <motion.div style={{ marginBottom: '20px' }} key={t.name} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <div
                            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${themeBase === t.name ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                                }`}
                            onClick={() => handleThemeChange(t.name)}
                        >
                            <div className="h-32 flex">
                                <div className="w-1/2 p-2" style={{ backgroundColor: t.colors.light[0] }}>
                                    <div className="flex space-x-1 mb-2">
                                        {t.colors.light.slice(1).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: t.colors.light[1] }} />
                                    <div className="h-2 w-1/2 rounded" style={{ backgroundColor: t.colors.light[2] }} />
                                </div>
                                <div className="w-1/2 p-2" style={{ backgroundColor: t.colors.dark[0] }}>
                                    <div className="flex space-x-1 mb-2">
                                        {t.colors.dark.slice(1).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: t.colors.dark[1] }} />
                                    <div className="h-2 w-1/2 rounded" style={{ backgroundColor: t.colors.dark[2] }} />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium truncate">{t.displayName}</p>
                            </div>
                            {themeBase === t.name && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ThemeSelector;