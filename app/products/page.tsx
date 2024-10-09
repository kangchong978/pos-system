'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import EditProductModal from '@/components/editProductModal';
import toast from 'react-hot-toast';
import { Product } from '@/common/type/product';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setLoading, setError } from '@/redux_slices/appSlice';
import { useCoreClient } from '@/utils/useClient';
import LoadingScreen from '@/components/LoadingScreen';
import CategoriesChips from '@/components/categoriesChips';
import { Search } from 'lucide-react';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';



export default function Products() {
    const { currentTheme } = useTheme(); // Get the current theme

    const styles = useMemo(() => ({
        container: {
            minHeight: '100vh',
            backgroundColor: getColor('background-primary'),
            padding: '2rem',
        },
        main: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        notificationIcon: {
            color: getColor('text-primary'),
            cursor: 'pointer',
        },
        searchContainer: {
            display: 'flex',
            marginBottom: '1.5rem',
        },
        searchInput: {
            width: '100%',
            padding: '10px 16px',
            paddingLeft: '40px',
            borderRadius: '8px',
            border: `1px solid ${getColor('border')}`,
            fontSize: '14px',
            backgroundColor: getColor('background-primary'),
        },
        searchIcon: {
            position: 'absolute' as const,
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: getColor('text-secondary'),
        },
        addButton: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            width: '200px',
        },
        productGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
        },
        productImageContainer: {
            position: 'relative' as const,
            backgroundColor: getColor('background-primary'),
            borderRadius: '0.375rem',
            width: '100px',
            height: '100px',
            marginRight: '0.625rem',
        },
        productInfo: {
            flex: 1,
        },
        productPrice: {
            marginTop: '0.3125rem',
            color: getColor('text-primary')
        },
        loadingMore: {
            // textAlign: 'center',
            marginTop: '1rem',
        },
        card: {
            backgroundColor: getColor('surface'),
            borderRadius: '20px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column' as const,
            height: '100%',
            justifyContent: 'space-between',
        },
        imageContainer: {
            position: 'relative' as const,
            width: '100%',
            height: '150px',
            marginBottom: '10px',
            borderRadius: '10px',
            overflow: 'hidden',
        },
        productName: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: getColor('text-primary'),
            marginBottom: '10px',
        },
        pageBar: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
        },
        pageButton: {
            margin: '0 0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
        },
        activePageButton: {
            backgroundColor: getColor('secondary'),
        },
    }), [currentTheme]); // Recalculate styles when theme changes

    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized, isLoading } = useCoreClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    const loadProducts = useCallback(async (pageToLoad: number) => {
        if (!coreClient || isLoadingProducts) return;

        setIsLoadingProducts(true);
        try {
            const { products, total } = await coreClient.getProducts({
                searchTerm,
                page: pageToLoad,
                categoryFilter: "",
                itemsPerPage: ITEMS_PER_PAGE
            });
            setProducts(products);
            setTotalProducts(total);
            setCurrentPage(pageToLoad);
        } catch (error) {
            console.error('Error loading products:', error);
            dispatch(setError('Failed to load products'));
            toast.error('Failed to load products');
        } finally {
            setIsLoadingProducts(false);
        }
    }, [coreClient, searchTerm, dispatch]);

    useEffect(() => {
        if (isInitialized && coreClient) {
            loadProducts(1);
        }
    }, [isInitialized, coreClient, loadProducts]);
    const searchProducts = useCallback(() => {
        loadProducts(1);
    }, [loadProducts]);

    const handlePageChange = (page: number) => {
        loadProducts(page);
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
        return <LoadingScreen />;
    }

    if (!isInitialized || !coreClient) {
        return <div style={styles.container}>Error: Product system not initialized</div>;
    }

    return (
        <div style={styles.container}>
            <main style={styles.main}>
                <motion.header
                    style={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={styles.title}>Products</h1>
                    <motion.button
                        style={styles.notificationIcon}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </motion.button>
                </motion.header>

                <motion.div
                    style={styles.searchContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div style={{ position: 'relative', width: '100%', marginRight: '16px' }}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by name"
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    searchProducts();
                                }
                            }}
                        />
                    </div>
                    <motion.button
                        style={styles.addButton}
                        onClick={handleAddProduct}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add Product
                    </motion.button>
                </motion.div>

                <motion.div
                    style={styles.productGrid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <AnimatePresence>
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                style={styles.card}
                                onClick={() => handleEditProduct(product)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                            >

                                <div style={styles.imageContainer}>
                                    {product.image && product.image.length > 0 && <Image
                                        src={product.image ? `http://localhost:6001/img/product/${product.image[0]}` : '/path/to/placeholder.png'}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />}
                                </div>
                                <h3 style={styles.productName}>{product.name}</h3>
                                <CategoriesChips categories={product.category}></CategoriesChips>
                                <h1 style={styles.productPrice}>RM {product.price}</h1>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <div style={styles.pageBar}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            style={{
                                ...styles.pageButton,
                                ...(page === currentPage ? styles.activePageButton : {})
                            }}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
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