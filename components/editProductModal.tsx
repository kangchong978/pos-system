import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MyFile, Product, Variation } from "@/common/type/product";
import { setError, setFiles, setNewCategory, setNewVariation, setNewVariationOption, setProduct, updateProductField } from "@/redux_slices/productEditSlice";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ImageGallery from "./imagesGallary";
import toast from "react-hot-toast";
import { useCoreClient } from "@/utils/useClient";
import { getColor } from '../utils/colorUtils';
import CategoriesChips from './categoriesChips';
import { Minus, X } from 'lucide-react';
import { useTheme } from './ThemeContext';




interface EditProductModalProps {
    oriProduct: Product;
    onClose: () => void;
    onSave: (product: Product) => void;
    onRemove: (product: Product) => void;
}


const EditProductModal: React.FC<EditProductModalProps> = ({ oriProduct, onClose, onSave, onRemove }) => {

    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        overlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
        },
        modal: {
            backgroundColor: getColor('background-primary'),
            borderRadius: '0.5rem',
            width: '80%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            margin: '1.25rem',
            display: 'flex',
            justifyContent: 'flex-start',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        content: {
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '30% auto',
            gap: '1.5rem',
            overflowY: 'auto' as const,
            flexGrow: 1,
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '0.25rem',
            backgroundColor: getColor('background-secondary'),
            color: getColor('text-primary')
        },
        textarea: {
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '0.25rem',
            height: '10rem',
            marginBottom: '0.5rem',
            backgroundColor: getColor('background-secondary'),
            color: getColor('text-primary')
        },
        button: {
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            color: getColor('text-primary')
        },
        errorText: {
            color: getColor('primary'),
            fontSize: '0.875rem',
        },
        variationContainer: {
            marginBottom: '1rem',
            border: `1px solid ${getColor('border')}`,
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: getColor('background-primary'),
        },
        variationHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
        },
        removeButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '0.25rem',
            backgroundColor: getColor('background-primary'),
            cursor: 'pointer',
        },
        variationName: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: getColor('text-secondary'),
        },
        requiredCheckbox: {
            display: 'flex',
            alignItems: 'center',
        },
        optionsContainer: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '0.5rem',
            marginBottom: '1rem',
        },
        optionChip: {
            borderRadius: '15px',
            padding: '6px 12px',
            border: `1px solid ${getColor('border')}`,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
        },
        optionName: {
            color: getColor('text-primary'),
            marginRight: '0.25rem',
        },
        optionPrice: {
            color: getColor('primary'),
        },
        removeOptionButton: {
            marginLeft: '0.5rem',
            cursor: 'pointer',
            color: getColor('text-secondary'),
        },
        inputContainer: {
            display: 'flex',
            gap: '0.5rem',
        },
    }), [currentTheme]); // Recalculate styles when theme changes



    const dispatch = useDispatch<AppDispatch>();
    const { coreClient, isInitialized, isLoading } = useCoreClient();
    const {
        product,
        errors,
        files,
        newCategory,
        newVariation,
        newVariationOption
    } = useSelector((state: RootState) => state.productEditSlice);

    useEffect(() => {
        dispatch(setProduct(oriProduct));

    }, [dispatch]);

    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewCategory(e.target.value));
    };

    const handleVaritationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewVariation(e.target.value));
    };

    const handleAddCategory = async () => {
        if (!coreClient) return;

        const previousCategories = product.category;
        if (newCategory.trim() == "") {
            dispatch(setError({ ...errors, category: 'Please input a valid text.' }));
        } else if (!previousCategories?.some((e) => e == newCategory.trim())) {

            var result = await coreClient.createCategory(newCategory.trim());

            const newProductCategory = [...previousCategories, newCategory.trim()];
            dispatch(updateProductField({ field: 'category', value: newProductCategory }));
            dispatch(setNewCategory(''));
        }
        else {
            dispatch(setError({ ...errors, category: 'This category already existed.' }));
        }
    }

    const handleAddVariation = () => {
        const previousVariation = (product.variation) ? product.variation : [];
        if (newVariation.trim() == "") {
            dispatch(setError({ ...errors, variation: 'Please input a valid text.' }));
        } else if (!previousVariation.some((e) => e.name == newVariation.trim())) {
            const newItem: Variation = { 'name': newVariation, 'options': [], 'required': true };
            dispatch(updateProductField({ field: 'variation', value: [...previousVariation, newItem] }));
            dispatch(setNewVariation(''));
        }
        else {
            dispatch(setError({ ...errors, variation: 'This variation already existed.' }));
        }
    }

    const handleRemoveVariation = (i: number) => {
        var previousVariation = [...product.variation];
        previousVariation.splice(i, 1);
        dispatch(updateProductField({ field: 'variation', value: previousVariation }));
    }

    const handleRequiredVariation = (i: number, v: boolean) => {
        var previousVariation = [...product.variation];
        previousVariation[i] = { ...previousVariation[i], 'required': !v };
        dispatch(updateProductField({ field: 'variation', value: previousVariation }));
    }

    const handleCategoryRemove = (e: string) => {
        const updatedCategories = product.category.filter(
            (category) => category.trim() !== e.trim()
        );
        dispatch(updateProductField({ field: 'category', value: updatedCategories }));
    }

    const handleFilesChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files;
        if (newFiles) {
            const existingFilesArray = files ? Array.from(files) : [];

            const combinedFiles = [...existingFilesArray, ...Array.from(newFiles).map((e) => {
                const newFile: MyFile = { 'file': e };
                return newFile;
            })];
            dispatch(setFiles(combinedFiles as unknown as MyFile[])); // Update state with combined files
        }
    }

    const handleFileRemove = (file: MyFile) => {
        if (files.length == 0) return;
        if (file.file) {
            // Convert FileList to an array for easier manipulation
            const filesArray = Array.from<MyFile>(files);

            // Filter out the file to be removed
            const updatedFiles = filesArray.filter(f => f.file?.name !== file.file?.name);

            // Update the state with the new file list
            dispatch(setFiles(...[updatedFiles as unknown as MyFile[]]));
            console.log(`Removed file: ${file.file.name}`);
        } else {
            //
            // Convert FileList to an array for easier manipulation
            const filesArray = Array.from<MyFile>(files);

            // Filter out the file to be removed
            const updatedFiles = filesArray.filter(f => f.url !== file.url);

            // Update the state with the new file list
            dispatch(setFiles(...[updatedFiles as unknown as MyFile[]]));
            console.log(`Removed file: ${file.url}`);

        }

    }

    const uploadProductImage = async () => {
        if (!coreClient) return [];

        if (!files || files.length === 0) {
            return [];
        }

        return await coreClient.uploadProductImage(files);
    };

    const variationValidation = () => {
        return !product.variation.some((e) => e.options.length == 0);
    }

    const formValidation = () => {
        const newError = {
            name: product.name ? '' : 'This field cannot be empty.',
            price: product.price.toString() !== '' ? '' : 'This field cannot be empty.',
            category: product.category.length > 0 ? '' : 'This field cannot be empty.',
            variation: variationValidation() ? '' : 'Variation option cannot be empty.',
        };
        dispatch(setError({ ...errors, ...newError }));
        return !(newError.name || newError.price || newError.category || newError.variation);
    };


    const handleSubmit = async () => {
        if (formValidation()) {
            try {
                const uploadedImageUrl = await uploadProductImage();
                product.setImage(uploadedImageUrl);
                dispatch(setProduct(product));
                onSave(product);
            } catch (error) {
                console.error(error);
                toast.error('Failed to submit.');
            }
        }
    };


    const handleVaritationOptionInputChange = ((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewVariationOption({ ...newVariationOption, [e.target.name]: e.target.value }));
    })
    const handleRemoveVariationOption = (parentIndex: number, i: number) => {
        var previousVariations = [...product.variation];
        var target = previousVariations[parentIndex];
        var newOptions = [...target.options];
        newOptions.splice(i, 1);
        var newTarget = { ...target, options: newOptions };
        var newVariations = [
            ...previousVariations.slice(0, parentIndex),  // All items before the target
            newTarget,                                    // The updated target
            ...previousVariations.slice(parentIndex + 1)  // All items after the target
        ];
        dispatch(updateProductField({ field: 'variation', value: newVariations }));
    };
    const handleAddVariationOption = (i: number) => {

        if (!(newVariationOption.name && newVariationOption.price)) {
            dispatch(setError({
                ...errors, variationOption: {
                    name: !newVariationOption.name || newVariationOption.name == '' ? 'Option name cannot be empty.' : '',
                    price: !newVariationOption.price || newVariationOption.price.toString() == '' ? 'Option price cannot be empty.' : '',
                }
            }));
            return;
        }

        var previousVariations = [...product.variation];
        var target = previousVariations[i];
        var isNameAlreadyExists = target.options.some(option => option.name === newVariationOption.name);

        if (isNameAlreadyExists) {
            dispatch(setError({ ...errors, variationOption: { name: 'Option name existed.' } }));
            return;
        }


        var newOptions = [...target.options, { name: newVariationOption.name, price: newVariationOption.price }];
        var newTarget = { ...target, options: newOptions };
        var newVariations = [
            ...previousVariations.slice(0, i),  // All items before the target
            newTarget,                          // The updated target
            ...previousVariations.slice(i + 1)  // All items after the target
        ];

        dispatch(updateProductField({ field: 'variation', value: newVariations }));
        dispatch(setNewVariationOption({}));

    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay as React.CSSProperties}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                style={styles.modal as React.CSSProperties}
            >
                <div style={styles.header}>
                    <h1 style={styles.title}>{product.name}</h1>
                </div>
                {/* ignore this error */}
                <div style={styles.content}>
                    <div>
                        <ImageGallery files={files} onRemove={handleFileRemove} />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="file-upload"
                            hidden
                            onChange={handleFilesChanges}
                        />
                        <motion.label
                            htmlFor="file-upload"
                            style={{
                                ...styles.button,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: getColor('primary'),
                                color: getColor('on-primary'),
                                marginTop: '0.5rem',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Upload Files
                        </motion.label>

                        <h3 style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', color: getColor('text-secondary') }}>Product Name</h3>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={(v) => dispatch(updateProductField({ field: v.target.name, value: v.target.value }))}
                            style={styles.input}
                        />
                        {errors?.name && <p style={styles.errorText}>{errors.name}</p>}

                        <h3 style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', color: getColor('text-secondary') }}>Categories</h3>
                        {product.category &&
                            <CategoriesChips
                                categories={product.category}
                                isEditable={true}
                                onSelectCallback={(v: string) => { handleCategoryRemove(v) }}
                            />
                        }
                        <input
                            placeholder="+ new category"
                            style={styles.input}
                            value={newCategory ?? ''}
                            onChange={handleCategoryInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddCategory();
                                }
                            }}
                        />
                        {errors?.category && <p style={styles.errorText}>{errors.category}</p>}
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: getColor('text-secondary') }}>Descriptions</h3>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={(v) => dispatch(updateProductField({ field: v.target.name, value: v.target.value }))}
                            style={styles.textarea}
                        />

                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: getColor('text-secondary') }}>Variations</h3>

                        <AnimatePresence>
                            {product.variation && product.variation.map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={styles.variationContainer}
                                >
                                    <div style={styles.variationHeader}>
                                        <motion.button
                                            style={styles.removeButton}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemoveVariation(i)}
                                        >
                                            <Minus size={16} color={getColor('text-secondary')} />
                                        </motion.button>
                                        <h3 style={styles.variationName}>{v.name}</h3>
                                        <div style={styles.requiredCheckbox}>
                                            <input
                                                type="checkbox"
                                                checked={v.required}
                                                onChange={() => handleRequiredVariation(i, v.required)}
                                                style={{ marginRight: '0.5rem', backgroundColor: getColor('primary') }}
                                            />
                                            <label style={{ color: getColor('text-secondary') }}>Required</label>
                                        </div>
                                    </div>

                                    <motion.div style={styles.optionsContainer}>
                                        <AnimatePresence>
                                            {v.options.map((w, wi) => (
                                                <motion.div
                                                    key={wi}
                                                    style={styles.optionChip}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                >
                                                    <span style={styles.optionName}>{w.name}</span>
                                                    <span style={styles.optionPrice}>[+RM{w.price}]</span>
                                                    <motion.button
                                                        style={styles.removeOptionButton}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleRemoveVariationOption(i, wi)}
                                                    >
                                                        <X size={14} />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>

                                    <div style={styles.inputContainer}>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                name="name"
                                                placeholder="+ new option"
                                                style={styles.input}
                                                value={newVariationOption.name ?? ''}
                                                onChange={handleVaritationOptionInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddVariationOption(i);
                                                    }
                                                }}
                                            />
                                            {errors?.variationOption?.name && <p style={styles.errorText}>{errors.variationOption.name}</p>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                name="price"
                                                placeholder="+ price"
                                                type="number"
                                                style={styles.input}
                                                value={newVariationOption.price}
                                                onChange={handleVaritationOptionInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddVariationOption(i);
                                                    }
                                                }}
                                            />
                                            {errors?.variationOption?.price && <p style={styles.errorText}>{errors.variationOption.price}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <input
                            placeholder="+ new variation"
                            style={styles.input}
                            value={newVariation ?? ''}
                            onChange={handleVaritationInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddVariation();
                                }
                            }}
                        />
                        {errors?.variation && <p style={styles.errorText}>{errors.variation}</p>}

                        <h3 style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', color: getColor('text-secondary') }}>Price per item (RM)</h3>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(v) => dispatch(updateProductField({ field: v.target.name, value: v.target.value }))}
                            style={styles.input}
                        />
                        {errors?.price && <p style={styles.errorText}>{errors.price}</p>}
                    </div>
                </div>
                <div style={{ margin: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <motion.button
                        onClick={() => onRemove(product)}
                        style={{ ...styles.button, border: `1px solid ${getColor('border')}` }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Delete
                    </motion.button>
                    <motion.button
                        onClick={onClose}
                        style={{ ...styles.button, border: `1px solid ${getColor('border')}` }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        onClick={handleSubmit}
                        style={{
                            ...styles.button,
                            backgroundColor: getColor('primary'),
                            color: getColor('on-primary')
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Save Changes
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default EditProductModal;