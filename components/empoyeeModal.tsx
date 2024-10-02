'use client';

import React from 'react';

interface EmployeeModalProps {
    employee: Employee;
    setEmployee: any;
    onClose: () => void;
    onSubmit: (employee: any) => void;
    isEdit: boolean;
    isProfile: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = (props) => {
    const { isEdit, isProfile, employee, setEmployee, onClose, onSubmit } = props;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSubmitEmployee = () => {
        onSubmit(employee);
    };

    const buildHeaderTitle = () => {
        let title = 'Add New Employee';
        if (isEdit) {
            title = 'Edit Employee';
        } else if (isProfile) {
            title = 'Edit Profile';
        }
        return <h3 className="text-lg font-bold mb-4">{title}</h3>;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[1000]">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white z-[1001]">
                {buildHeaderTitle()}
                <label className="block mb-2">
                    Username:
                    <input
                        disabled={isEdit || isProfile}
                        type="text"
                        name="username"
                        placeholder="Name"
                        className="w-full p-2 mt-1 border rounded"
                        value={employee?.username}
                        onChange={handleInputChange}
                    />
                </label>
                <label className="block mb-2">
                    Email Address:
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 mt-1 border rounded"
                        value={employee?.email}
                        onChange={handleInputChange}
                    />
                </label>
                <label className="block mb-2">
                    Phone Number:
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone"
                        className="w-full p-2 mt-1 border rounded"
                        value={employee?.phoneNumber}
                        onChange={handleInputChange}
                    />
                </label>
                <label className="block mb-4">
                    Role:
                    <input
                        disabled={isProfile}
                        type="text"
                        name="role"
                        placeholder="Role eg: admin, staff, cashier"
                        className="w-full p-2 mt-1 border rounded"
                        value={employee?.role}
                        onChange={handleInputChange}
                    />
                </label>
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>Cancel</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmitEmployee}>
                        {isEdit ? "Save Changes" : "Add Employee"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;