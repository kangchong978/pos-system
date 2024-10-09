import { getColor } from '../utils/colorUtils';
import React from 'react';
import { BarLoader, BeatLoader, HashLoader, PropagateLoader } from 'react-spinners';

const LoadingScreen: React.FC = () => {
    return (
        // className = "fixed inset-0 flex items-center justify-center bg-gray-100"
        <div style={{ inset: 0, display: 'flex', position: 'fixed', alignItems: 'center', justifyContent: 'center', backgroundColor: getColor('background-primary') }}>
            <HashLoader color={getColor('primary')}></HashLoader>
        </div>
    );
};

export default LoadingScreen;