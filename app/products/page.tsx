'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import EditProductModal from '@/components/editProductModal';
import CoreClient from '@/utils/client';
import toast from 'react-hot-toast';
import { buildCategoriesChips } from '@/components/categoriesChips';

export default function Products() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEndOfList, setEndOfList] = useState<boolean>(false);
    var page = 1;
    var loading = false;


    useEffect(() => {

        loadProducts();
        window.addEventListener('scroll', handleScroll); // Add scroll event listener
        return () => {
            window.removeEventListener('scroll', handleScroll); // Clean up on unmount
        };

    }, [])

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 5 && !loading) {
            page = page + 1;
            loadProducts();
        }
    };

    const searchProducts = async () => {
        console.log('Triggered search');
        setProducts([]);
        loadProducts();
    }

    const loadProducts = async () => {
        if (loading) return;
        loading = true;
        const client = CoreClient.getInstance();
        var result = await client.getProducts({ "searchTerm": searchTerm, "page": page });
        if (result.length > 0) {
            // end of list
            setProducts(prevProducts => [...prevProducts, ...result]); // Append new products
        } else {
            setEndOfList(true);
        }
        loading = false;


    }

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };


    const handleSaveProduct = async (editedProduct: Product) => {

        const client = CoreClient.getInstance();
        var result;
        if (!editedProduct.id) {
            result = await client.createProduct(editedProduct);

            // Update the products state with the edited product
            editedProduct = { ...editedProduct, id: result }
            setProducts(prevProducts => [...prevProducts, editedProduct]);

        } else {
            result = await client.updateProduct(editedProduct);

            // Update the products state with the edited product
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === editedProduct.id ? editedProduct : product
                )
            );
        }

        if (!result) return;
        setSelectedProduct(null);


        toast.success('Product update successfully.')

    };

    const handleRemoveProduct = async (editedProduct: Product) => {
        if (!editedProduct.id) return;
        const client = CoreClient.getInstance();
        const result = await client.removeProduct(editedProduct.id);
        if (!result) return;
        setSelectedProduct(null);

        // Remove the product from the products state
        setProducts(prevProducts =>
            prevProducts.filter(product => product.id !== editedProduct.id) // Remove the product
        );

        toast.success('Product removed successfully.') // Updated success message

    };
    const handleAddProduct = () => {
        setSelectedProduct({ 'category': '', 'code': '', 'description': '', 'image': '', 'name': '', 'price': 0.00 });
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-red-500">Products</h1>
                    <button className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </header>

                <div className="flex mb-6">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 mr-[10px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                searchProducts(); // Trigger the search/filter function
                            }
                        }}
                    />
                    <button
                        className="bg-red-500 text-white w-[200px] rounded hover:bg-red-600"
                        onClick={() => handleAddProduct()}
                    >
                        Add Product
                    </button>
                </div>


                <div>
                    <div className="flex flex-wrap gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="flex bg-white rounded-lg p-4 shadow w-[300px] h-[130px]" onClick={() => handleEditProduct(product)}>
                                <div className="relative bg-gray-100 rounded-lg w-[100px] h-[100px] mr-[10px]">
                                    {product.image && product.image !== '' && (
                                        <Image
                                            src={product.image ? `http://localhost:6001/img/product/${product.image.split(',')[0]}` : '/path/to/placeholder.png'}
                                            alt={product.name}
                                            className="rounded object-cover"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold mt-[5px]">{product.name}</h3>
                                    {buildCategoriesChips(product.category)}
                                    <h1>RM {product.price}</h1>
                                </div>

                            </div>
                        ))}

                    </div>


                </div>
            </main >

            {selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                    onRemove={handleRemoveProduct}
                />
            )
            }
        </div >
    );
};

