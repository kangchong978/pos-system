'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CoreClient from '@/utils/client';
import toast from 'react-hot-toast';

enum LoginPageState { LoginState, ResetState };


export default function Login() {
    const [pageState, setPageState] = useState<LoginPageState>(LoginPageState.LoginState);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const passwordValidation = (v: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return regex.test(v);
    }

    const handleResetPassword = async () => {
        if (!passwordValidation(newPassword)) {
            setError(`At least one lowercase letter.<br />
                At least one uppercase letter.<br />
                At least one digit.<br />
                At least one special character (non-word character).<br />
                Minimum length of 6 characters.`);
            return;
        } else if (newPassword != newPasswordConfirm) {
            setError('Confirmation password not match.');
            return;
        }

        const client = CoreClient.getInstance();
        var result = await client.resetPassword({ newPassword, newPasswordConfirm });
        if (result) {
            router.push('/dashboard');
        }
    }

    const handleLogin = async () => {
        const client = CoreClient.getInstance();

        var result = await client.login({ username, password });
        if (result) {
            if (result.updatePasswordRequired) {
                setPageState(LoginPageState.ResetState)
            } else {
                router.push('/dashboard');
            }
        }

    };
    if (pageState == LoginPageState.LoginState)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Log In
                    </button>

                </div>
            </div>
        );
    else if (pageState == LoginPageState.ResetState)
        return (
            <div>
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-md w-96">
                        <h1 className="text-2xl font-bold mb-6 text-center">Hi {username}, please set your password</h1>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="newPasswordConfirm"
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                                required
                            />
                        </div>

                        {error && (
                            <p className='text-red-800 mb-4' dangerouslySetInnerHTML={{ __html: error }} />
                        )}

                        <button
                            onClick={handleResetPassword}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Confirm
                        </button>

                    </div>
                </div>
            </div>
        );

    return (<></>)
}