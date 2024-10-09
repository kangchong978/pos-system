import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCoreClient } from '@/utils/useClient';

type ThemeBase = 'ocean' | 'mcd' | 'wendys' | 'japanese' | 'chinese';
type ThemeMode = 'light' | 'dark';
type Theme = `${ThemeBase}-${ThemeMode}`;

interface ThemeContextType {
    themeBase: ThemeBase;
    setThemeBase: (themeBase: ThemeBase) => void;
    systemPreference: ThemeMode;
    currentTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [themeBase, setThemeBaseState] = useState<ThemeBase>('ocean');
    const [systemPreference, setSystemPreference] = useState<ThemeMode>('light');
    const router = useRouter();
    const { coreClient, isInitialized, isLoading } = useCoreClient(true);

    const getSystemTheme = useCallback((): ThemeMode =>
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        []);

    const applyTheme = useCallback((base: ThemeBase, mode: ThemeMode) => {
        const newTheme = `${base}-${mode}` as Theme;
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.style.setProperty('color-scheme', mode);
        router.refresh();
    }, [router]);

    const setThemeBase = useCallback((newThemeBase: ThemeBase) => {
        setThemeBaseState(newThemeBase);
        // localStorage.setItem('themeBase', newThemeBase);
        applyTheme(newThemeBase, systemPreference);
    }, [applyTheme, systemPreference]);

    useEffect(() => {
        return () => {
            const initialSystemPreference = getSystemTheme();
            applyTheme(themeBase, initialSystemPreference);
        }
    }, [themeBase, coreClient?.getSetting])


    useEffect(() => {
        if (!isInitialized) return;

        const initialThemeBase = coreClient?.getSetting?.theme as ThemeBase || 'ocean';
        const initialSystemPreference = getSystemTheme();

        setThemeBaseState(initialThemeBase);
        setSystemPreference(initialSystemPreference);
        applyTheme(initialThemeBase, initialSystemPreference);

        const checkSystemPreference = () => {
            const newSystemPreference = getSystemTheme();
            if (newSystemPreference !== systemPreference) {
                setSystemPreference(newSystemPreference);
                applyTheme(themeBase, newSystemPreference);
            }
        };

        const intervalId = setInterval(checkSystemPreference, 1000); // Check every second

        return () => clearInterval(intervalId);
    }, [getSystemTheme, applyTheme, systemPreference, coreClient?.getSetting]);

    const currentTheme = `${themeBase}-${systemPreference}` as Theme;

    const value = {
        themeBase,
        setThemeBase,
        systemPreference,
        currentTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const getColor = (colorVar: string): string => {
    if (typeof window === 'undefined') return ''; // For SSR compatibility
    const root = document.documentElement;
    const colorValue = getComputedStyle(root).getPropertyValue(`--color-${colorVar}`).trim();
    return `rgb(${colorValue})`;
};

export const getColorWithOpacity = (colorVar: string, opacity: number): string => {
    if (typeof window === 'undefined') return ''; // For SSR compatibility
    const root = document.documentElement;
    const colorValue = getComputedStyle(root).getPropertyValue(`--color-${colorVar}`).trim();
    return `rgba(${colorValue}, ${opacity})`;
};