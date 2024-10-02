import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { checkAuthAndRoute, clearError, initializeApp, setLoading } from '@/redux_slices/appSlice';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const useCoreClient = (skipAuthCheck = false) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isInitialized, isLoading, coreClient, error } = useSelector((state: RootState) => state.app);
    const pathname = usePathname();
    const initializationChecked = useRef(false);

    useEffect(() => {
        const checkInitialization = async () => {
            if (!isInitialized && !initializationChecked.current) {
                initializationChecked.current = true;
                await dispatch(initializeApp());
            }
        };

        checkInitialization();
    }, [isInitialized, dispatch]);

    useEffect(() => {
        if (isInitialized && !isLoading && !skipAuthCheck) {
            dispatch(checkAuthAndRoute());
        }
    }, [isInitialized, isLoading, pathname, dispatch, skipAuthCheck]);

    const setAppLoading = (loading: boolean) => dispatch(setLoading(loading));
    const clearAppError = () => dispatch(clearError());

    return {
        isInitialized,
        isLoading,
        coreClient,
        error,
        setAppLoading,
        clearAppError
    };
};