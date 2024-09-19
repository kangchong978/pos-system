'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import SwitchButton from '@/components/switchButton';
import CategoryList from '@/components/categoryBar';
import CoreClient from '@/utils/client';

export default function Pos() {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadProducts();

    }, [])

    const loadProducts = async () => {
        const client = CoreClient.getInstance();
        var result = await client.getProducts({ "searchTerm": '', "page": 1 });
        if (result.length > 0) {
            // end of list
            setProducts(prevProducts => [...prevProducts, ...result]); // Append new products
        }
    }


    return (
        <div className="flex bg-gray-100">


            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold ml-4 text-red-500">Order#100001</h1>

                        <div className='ml-5'>
                            <SwitchButton />
                        </div>

                    </div>
                    <div className="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>

                </div>

                <div className="flex">
                    {/* Product grid and CategoryList */}
                    <div className="w-1/4 flex-grow mr-6 ">
                        <div className="mb-4">
                            <CategoryList />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {products.map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 shadow">

                                    <div className="relative mb-2 item flex  h-[120px] justify-center">
                                        <Image src={_.image ? `http://localhost:6001/img/product/${_.image.split(',')[0]}` : '/path/to/placeholder.png'}
                                            alt="Ramly Burger"
                                            className="rounded-lg"
                                            layout="fill"
                                            objectFit="cover" />
                                        {/* <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full pl-2 pr-2 pt-1 pb-1 flex items-center justify-center">{20 * i}</span> */}
                                    </div>
                                    <h3 className="font-bold">{_.name} </h3>
                                    <p className="text-red-500">RM {_.price}</p>
                                    <button className="mt-2 text-red-500 w-full h-10 bg-red-100 rounded-full flex justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order details */}
                    <div className="w-1/4 flex-shrink-0 ml-6">
                        <h2 className="font-bold mb-4">Order Details</h2>
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg p-4 shadow mb-2 flex">
                                <div className='mr-5'>
                                    <Image src="/ramly-burger.webp" alt="Ramly Burger" width={50} height={50} className="rounded-lg" />
                                </div>
                                <div>
                                    <p>Ramly Burger</p>
                                    <p>More cheese, more chili</p>
                                    <p className='text-red-500 font-bold'>$20.00</p>
                                </div>
                            </div>
                        ))}

                        {/* Add order items here */}
                        <div className="mt-6">
                            <h3 className="font-bold mb-2">Payment Summary</h3>
                            <div className="flex justify-between">
                                <span>Sub Total</span>
                                <span>$85</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>-$6</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total Payment</span>
                                <span>$79</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Payment Method</h3>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-white rounded-md p-2 flex items-center justify-center" style={{ height: 50, width: 150 }}>
                                    <Image src="/visa-logo.png" alt="Visa" layout="intrinsic" width={60} height={10} />
                                </div>
                                <div className="bg-white rounded-md p-2 flex items-center justify-center" style={{ height: 50, width: 150 }}>
                                    <Image src="/paypal-logo.png" alt="PayPal" layout="intrinsic" width={40} height={10} />
                                </div>
                                <div className="bg-white rounded-md p-2 flex items-center justify-center" style={{ height: 50, width: 150 }}>
                                    <Image src="/Touch-n-Go-Ewallet.png" alt="Visa" layout="intrinsic" width={100} height={10} />
                                </div>
                                <div className="bg-white rounded-md p-2 flex items-center justify-center" style={{ height: 50, width: 150 }}>
                                    <Image src="/mastercard-logo.png" alt="PayPal" layout="intrinsic" width={40} height={10} />
                                </div>


                            </div>
                        </div>
                        <button className="w-full bg-red-500 text-white py-2 rounded-lg mt-4">Fire Order</button>
                        <button className="w-full bg-red-500 text-white py-2 rounded-lg mt-2">Payment</button>
                    </div>
                </div>
            </main >
        </div >
    );
}