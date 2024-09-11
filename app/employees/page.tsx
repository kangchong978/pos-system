'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import CoreClient from '@/utils/client';
import EmployeeModal from './components/empoyeeModal';
import toast from 'react-hot-toast';
import TempPasswordModal from './components/tempPasswordModal';

export default function Employees() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isEdit, setIsEdit] = useState(false);


    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [savedTempPassword, setSavedTempPassword] = useState<{ id: string; tempPassword: string }[]>([]);
    const [tempPassword, setTempPassword] = useState<string>('');

    const filteredEmployees = employees.filter(employee =>
        employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const loadUsers = async () => {
        const client = CoreClient.getInstance();
        var result = await client.getEmployees();
        setEmployees(result);
    }

    useEffect(() => {
        loadUsers();
    }, [])


    const handleEditEmployee = (employee: Employee) => {
        setIsEdit(true);
        setCurrentEmployee(employee);
    }

    const handleAddEmployee = () => {
        setIsEdit(false);
        setCurrentEmployee({ username: '', password: '', email: '', phoneNumber: '', role: '' });

    }

    const handleDeleteEmployee = async (data: Employee) => {
        // submit
        const client = CoreClient.getInstance();
        await client.removeUser(data.id);
        loadUsers();
    }

    const handleSubmitEmployee = async (data: Employee) => {
        // form validation
        if (data.email == '' || data.phoneNumber == '' || data.username == '' || data.role?.length == 0) {
            toast.error("Please fill in all informations");
            return;
        }
        // submit
        const client = CoreClient.getInstance();
        // const submitFunc = (isEdit) ? client.updateUser : client.registerUser;
        if (isEdit)
            await client.updateUser(data)
        else {
            var result = await client.registerUser(data)
            if (result) {
                setSavedTempPassword([{ 'id': result.id, 'tempPassword': result.tempPassword }, ...savedTempPassword]);
                setTempPassword(result.tempPassword);
            }
        }

        setCurrentEmployee(null);
        loadUsers();
    }


    const buildRoleChips = (roles: string) => {
        if (roles == '') return;
        const convertedRoles = roles.split(',').map(role => role.trim())

        return (<>
            {convertedRoles.map((e) => <div className="flex"> <div className="bg-gray-300 text-white px-2 my-1 mr-1 sm:rounded"><p>{e}</p></div></div>)}
        </>);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Employee Management | Wendy's</title>
            </Head>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-red-600">Employee Management</h1>

                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="p-2 border rounded w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleAddEmployee()}
                    >
                        Add Employee
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => {
                                const tempPassowrd = savedTempPassword.find(item => item.id === employee.id)?.tempPassword;

                                return (
                                    <tr key={employee.username}>
                                        <td className="px-6 py-4 whitespace-nowrap">{employee.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{employee.phoneNumber}</td>
                                        <td className="flex px-6 py-4 whitespace-nowrap">{buildRoleChips(employee.role ?? '')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                onClick={() => handleEditEmployee(employee)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDeleteEmployee(employee)}
                                            >
                                                Delete
                                            </button>
                                            <button className='flex' onClick={() => setTempPassword(tempPassowrd ?? '')}> {tempPassowrd}</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {currentEmployee && <EmployeeModal
                    employee={currentEmployee}
                    setEmployee={setCurrentEmployee}
                    onClose={() => setCurrentEmployee(null)}
                    onSubmit={handleSubmitEmployee}
                    isEdit={isEdit}
                />}
                {
                    tempPassword && <TempPasswordModal
                        tempPassword={tempPassword}
                        onClose={() => setTempPassword('')}
                    />
                }


            </main>
        </div>
    );
};

