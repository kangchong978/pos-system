import { AppThunk } from '@/store';
import CoreClient from '@/utils/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initializeApp = createAsyncThunk(
    'app/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const client = new CoreClient();
            await client.loadClientInfo();
            return client;
        } catch (error) {
            return rejectWithValue('Failed to initialize app');
        }
    }
);

export const checkAuthAndRoute = (): AppThunk => async (dispatch, getState) => {
    const { app } = getState();
    let client = app.coreClient;

    if (!app.isInitialized || !client) {
        const initResult = await dispatch(initializeApp());
        if (initializeApp.fulfilled.match(initResult)) {
            client = initResult.payload;
        } else {
            // Handle initialization failure
            console.error('Failed to initialize app');
            return;
        }
    }

    const accessibleRoutes = client.getUserInfo?.accessibleRoute ?? [];
    const currentPath = window.location.pathname;

    if (!client.isLoggedIn) {
        if (currentPath !== '/login') {
            window.location.href = '/login';
        }
    } else if (currentPath === '/' && accessibleRoutes.length > 0) {
        const defaultRoute = accessibleRoutes.find(route => route.route === '/dashboard')
            || accessibleRoutes[0]
            || { route: '/notFound' };
        window.location.href = defaultRoute.route ?? '';
    } else if (currentPath != '/notFound' && !accessibleRoutes.some(route => route.route === currentPath)) {
        window.location.href = '/notFound';
    }
};

interface AppState {
    isInitialized: boolean;
    isLoading: boolean;
    coreClient: CoreClient | null;
    showEmployeeFeedback: boolean;
    error: string | null;
}

const initialState: AppState = {
    isInitialized: false,
    isLoading: true,
    coreClient: null,
    error: null,
    showEmployeeFeedback: false
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        // this is used to check while employee are required to feedback and prompt the feedback modal
        verifyIsRequiredFeedback: (state) => {
            state.showEmployeeFeedback = !state.coreClient?.getUserInfo?.doneFeedbackToday;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isInitialized = true;
                state.isLoading = false;
                state.coreClient = action.payload;
            })
            .addCase(initializeApp.rejected, (state, action) => {
                state.isInitialized = true;
                state.isLoading = false;
                state.error = action.error.message || 'Failed to initialize app';
            });
    },
});

export const { setLoading, clearError, setError, verifyIsRequiredFeedback } = appSlice.actions;
export default appSlice.reducer;