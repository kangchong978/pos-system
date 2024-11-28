import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { checkAuthAndRoute, clearError, initializeApp, setLoading } from '@/redux_slices/appSlice';
import { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const useCoreClient = (skipAuthCheck = false) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isInitialized, isLoading, coreClient, error, showEmployeeFeedback } = useSelector((state: RootState) => state.app);
    const pathname = usePathname();
    const initializationChecked = useRef(false);

    useEffect(() => {

        const initialize = async () => {
            await dispatch(initializeApp());
        }
        if (!isInitialized) {
            initialize();
        }
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
        clearAppError,
        showEmployeeFeedback
    };
};