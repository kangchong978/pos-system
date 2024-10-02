import React from 'react';
import { BarLoader } from 'react-spinners';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <BarLoader color='#F27059'></BarLoader>
        </div>
    );
};

export default LoadingScreen;