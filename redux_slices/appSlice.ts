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
        window.location.href = '/login';
    } else if (currentPath === '/') {
        const defaultRoute = accessibleRoutes.find(route => route.route === '/dashboard')
            || accessibleRoutes[0]
            || { route: '/notFound' };
        window.location.href = defaultRoute.route ?? '';
    } else if (!accessibleRoutes.some(route => route.route === currentPath)) {
        window.location.href = '/';
    }
};

interface AppState {
    isInitialized: boolean;
    isLoading: boolean;
    coreClient: CoreClient | null;
    error: string | null;
}

const initialState: AppState = {
    isInitialized: false,
    isLoading: true,
    coreClient: null,
    error: null,
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

export const { setLoading, clearError, setError } = appSlice.actions;
export default appSlice.reducer;