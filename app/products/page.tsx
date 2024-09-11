'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import EditProductModal from '@/components/editProductModal';

export default function Products() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const products: Product[] = [
        {
            id: 1,
            name: 'Ramly Burger',
            image: '/ramly-burger.webp',
            category: 'Burger',
            description: '',
            code: 'B100001',
            price: 100.00
        },
        // Add more products as needed
    ];

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const handleSaveProduct = (editedProduct: object) => {
        // Here you would typically update the product in your database
        console.log('Saving edited product:', editedProduct);
        setSelectedProduct(null);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-16 bg-white h-full flex flex-col items-center py-4">
                <Image src="/wendys-logo.png" alt="Wendy's Logo" width={40} height={40} />
                {/* Add sidebar icons here */}
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-red-500">Products</h1>
                    <button className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </header>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div>
                    <div className="grid grid-cols-5 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="flex bg-white rounded-lg p-4 shadow" onClick={() => handleEditProduct(product)}>
                                <Image src={product.image} alt={product.name} width={100} height={100} className="mb-2" />
                                <div>
                                    <h3 className="font-bold">{product.name}</h3>
                                    <div className="flex space-x-2 mt-2">
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">Burger</span>
                                        <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">Beef</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
};

