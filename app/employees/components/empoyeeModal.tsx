
'use client';

import React from 'react';



interface EmployeeModalProps {
    employee: Employee;
    setEmployee: any;
    onClose: () => void;
    onSubmit: (employee: any) => void;
    isEdit: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = (props) => {
    const isEdit = props.isEdit;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        var newValue: string | string[] = value;


        // Create a copy of the employee object
        const newEmployee = { ...props.employee, [name]: newValue }; // Update the specific field
        props.setEmployee(newEmployee); // Set the updated employee
    };

    const handleSubmitEmployee = () => {
        props.onSubmit(props.employee);
    };



    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Add New Employee</h3>
                <label>
                    Username:
                    <input disabled={isEdit} type="text" name="username" placeholder="Name" className="w-full p-2 mb-2 border rounded" value={props.employee?.username} onChange={handleInputChange} />
                </label>
                {/* <label>
                    Password:
                    <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-2 border rounded" value={props.employee?.password} onChange={handleInputChange} />
                    <button className="justify-center flex w-full bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => alert('Reset Password functionality to be implemented.')}>
                        Reset Password
                    </button>
                </label> */}
                <label>
                    Email Address:
                    <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" value={props.employee?.email} onChange={handleInputChange} />
                </label>
                <label>
                    Phone Number:
                    <input type="tel" name="phoneNumber" placeholder="Phone" className="w-full p-2 mb-2 border rounded" value={props.employee?.phoneNumber} onChange={handleInputChange} />
                </label>
                <label>
                    Role:
                    <input type="text" name="role" placeholder="Role eg: admin, staff, cashier" className="w-full p-2 mb-4 border rounded" value={props.employee?.role} onChange={handleInputChange} />
                </label>
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={props.onClose}>Cancel</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmitEmployee}>Add</button>
                </div>
            </div>
        </div >
    );
};

export default EmployeeModal;