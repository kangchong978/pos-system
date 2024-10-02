'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import EditProductModal from '@/components/editProductModal';
import toast from 'react-hot-toast';
import { buildCategoriesChips } from '@/components/categoriesChips';
import { Product } from '@/common/type/product';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setLoading, setError } from '@/redux_slices/appSlice';
import { useCoreClient } from '@/utils/useClient';
import LoadingScreen from '@/components/LoadingScreen';

export default function Products() {
    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized, isLoading } = useCoreClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEndOfList, setEndOfList] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        if (isInitialized && coreClient) {
            loadProducts();
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isInitialized, coreClient]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 5 && !isLoadingMore && !isEndOfList) {
            setPage(prevPage => prevPage + 1);
            loadProducts();
        }
    };

    const searchProducts = async () => {
        setProducts([]);
        setPage(1);
        setEndOfList(false);
        loadProducts();
    };

    const loadProducts = async () => {
        if (!coreClient || isLoadingMore) return;
        setIsLoadingMore(true);
        dispatch(setLoading(true));
        try {
            const result = await coreClient.getProducts({ "searchTerm": searchTerm, "page": page, "categoryFilter": "" });
            if (result.length > 0) {
                setProducts(prevProducts => [...prevProducts, ...result]);
            } else {
                setEndOfList(true);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            dispatch(setError('Failed to load products'));
            toast.error('Failed to load products');
        } finally {
            setIsLoadingMore(false);
            dispatch(setLoading(false));
        }
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const handleSaveProduct = async (editedProduct: Product) => {
        if (!coreClient) return;
        dispatch(setLoading(true));
        try {
            let result;
            if (!editedProduct.id) {
                result = await coreClient.createProduct(editedProduct);
                editedProduct = new Product(editedProduct.name, editedProduct.image, editedProduct.category, editedProduct.description, editedProduct.code, editedProduct.price, editedProduct.variation, result.id);
                setProducts(prevProducts => [...prevProducts, editedProduct]);
            } else {
                result = await coreClient.updateProduct(editedProduct);
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.id === editedProduct.id ? editedProduct : product
                    )
                );
            }
            if (!result) return;
            setSelectedProduct(null);
            toast.success('Product updated successfully.');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRemoveProduct = async (editedProduct: Product) => {
        if (!editedProduct.id || !coreClient) return;
        dispatch(setLoading(true));
        try {
            const result = await coreClient.removeProduct(editedProduct.id);
            if (!result) return;
            setSelectedProduct(null);
            setProducts(prevProducts =>
                prevProducts.filter(product => product.id !== editedProduct.id)
            );
            toast.success('Product removed successfully.');
        } catch (error) {
            console.error('Error removing product:', error);
            toast.error('Failed to remove product');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAddProduct = () => {
        setSelectedProduct(new Product('', [], [], '', '', 0.00, []));
    };

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>;
    }

    if (!isInitialized || !coreClient) {
        return <div>Error: Product system not initialized</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
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
                                searchProducts();
                            }
                        }}
                    />
                    <button
                        className="bg-red-500 text-white w-[200px] rounded hover:bg-red-600"
                        onClick={handleAddProduct}
                    >
                        Add Product
                    </button>
                </div>

                <div className="flex flex-wrap gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="flex bg-white rounded-lg p-4 shadow w-[300px] h-[130px]" onClick={() => handleEditProduct(product)}>
                            <div className="relative bg-gray-100 rounded-lg w-[100px] h-[100px] mr-[10px]">
                                {product.image && (
                                    <Image
                                        src={product.image ? `http://localhost:6001/img/product/${product.image[0]}` : '/path/to/placeholder.png'}
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

                {isLoadingMore && <div>Loading more products...</div>}
                {isEndOfList && <div>No more products to load</div>}
            </main>

            {selectedProduct && (
                <EditProductModal
                    oriProduct={selectedProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                    onRemove={handleRemoveProduct}
                />
            )}
        </div>
    );
}