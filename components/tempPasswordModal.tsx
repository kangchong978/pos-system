import React from 'react';
import toast from 'react-hot-toast';

interface TempPasswordModalProps {
    tempPassword: string;
    onClose: () => void;
}

const TempPasswordModal: React.FC<TempPasswordModalProps> = ({ tempPassword, onClose }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(tempPassword);
        toast.success('Password copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-bold">Temporary Password</h2>
                <input
                    type="text"
                    value={tempPassword}
                    readOnly
                    className="border p-2 w-full mt-2"
                />
                <p>Kindly share this temporarily password together with username to your empoyee to proceed the first login.</p>
                <button onClick={copyToClipboard} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                    Copy
                </button>
                <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 mt-2 rounded ml-2">
                    Close
                </button>
            </div>
        </div>
    );
};

export default TempPasswordModal;