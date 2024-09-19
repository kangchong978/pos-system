import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { buildCategorieseChipsEdit } from './categoriesChipsEdit';
import toast from 'react-hot-toast';
import ImageGallery from './imagesGallary';
import CoreClient from '@/utils/client';

interface EditProductModalProps {
    product: Product;
    onClose: () => void;
    onSave: (product: Product) => void;
    onRemove: (product: Product) => void;
}


const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave, onRemove }) => {
    const [editedProduct, setEditedProduct] = useState(product);
    const [categories, setCategories] = useState<null | string>();
    const [newCategory, setNewCategory] = useState('');
    const [errors, setErrors] = useState<{ name: string, price: string, categories: string }>({ 'name': '', 'price': '', 'categories': '' });
    const [files, setFiles] = useState<MyFile[]>();

    useEffect(() => {
        setCategories(editedProduct.category);

        if (editedProduct.image != '') {
            var result = editedProduct.image.split(',');
            console.log(result);
            setFiles(result.map((e) => {
                const file: MyFile = { 'url': e };
                return file;
            }));
            //
        }
    }, [])


    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({ ...errors, categories: '' });

        const { name, value } = e.target;
        setNewCategory(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name == 'name') setErrors({ ...errors, name: '' });
        if (name == 'price') setErrors({ ...errors, price: '' });

        setEditedProduct({ ...editedProduct, [name]: value });
    };
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const addProductCategory = () => {

        const previousCategories = categories;

        const convertedCategories = previousCategories?.split(',').map(role => role.trim())

        if (!convertedCategories?.some((e) => e == newCategory.trim())) {
            const newProductCategory = (!previousCategories) ? `${newCategory}` : `${previousCategories},${newCategory}`; // Concatenate new category
            setEditedProduct({ ...editedProduct, category: newProductCategory }); // Update editedProduct
            setCategories(newProductCategory);
            setNewCategory('');
        } else {
            setErrors({ ...errors, categories: 'This category already existed.' });
        }


    }

    const removeProductCategory = (categoryToRemove: string) => {
        if (!categories) return;
        // Split the current categories into an array
        const previousCategories = categories.split(',');

        // Filter out the category to be removed
        const updatedCategories = previousCategories.filter(
            (category) => category.trim() !== categoryToRemove.trim()
        );

        // Join the remaining categories back into a string
        const newProductCategory = updatedCategories.join(',');

        // Update the state with the new category string
        setEditedProduct({ ...editedProduct, category: newProductCategory });
        setCategories(newProductCategory);
    };

    const removeProductImage = (file: MyFile) => {
        if (!files) return;

        if (file.file) {
            // Convert FileList to an array for easier manipulation
            const filesArray = Array.from(files);

            // Filter out the file to be removed
            const updatedFiles = filesArray.filter(f => f.file?.name !== file.file?.name);

            // Update the state with the new file list
            setFiles(updatedFiles as unknown as MyFile[]);
            console.log(`Removed file: ${file.file.name}`);
        } else {
            //
            // Convert FileList to an array for easier manipulation
            const filesArray = Array.from(files);

            // Filter out the file to be removed
            const updatedFiles = filesArray.filter(f => f.url !== file.url);

            // Update the state with the new file list
            setFiles(updatedFiles as unknown as MyFile[]);
            console.log(`Removed file: ${file.url}`);

        }

    };


    const uploadProductImage = async () => {
        if (!files || files.length == 0) return { ...editedProduct, image: '' };
        //
        const client = CoreClient.getInstance();
        const uploadedImageUrl = await client.uploadProductImage(files);

        return { ...editedProduct, image: uploadedImageUrl ?? '' };
    }

    const formValidation = () => {

        setErrors({
            'name': (editedProduct.name) ? '' : 'This field cannot be empty.',
            'price': (editedProduct.price.toString() != '') ? '' : 'This field cannot be empty.',
            'categories': (editedProduct.category) ? '' : 'This field cannot be empty.',
        })


        return editedProduct.name && (editedProduct.price.toString() != '') && editedProduct.category;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6">

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <ImageGallery files={files} onRemove={removeProductImage} />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="file-upload" // Add an id for the label to reference
                            hidden // Hide the default file input
                            onChange={(e) => {
                                const newFiles = e.target.files;
                                if (newFiles) {
                                    const existingFilesArray = files ? Array.from(files) : [];

                                    const combinedFiles = [...existingFilesArray, ...Array.from(newFiles).map((e) => {
                                        const newFile: MyFile = { 'file': e };
                                        return newFile;
                                    })];
                                    setFiles(combinedFiles as unknown as MyFile[]); // Update state with combined files
                                }
                            }}
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center p-2 border rounded bg-red-500 text-white cursor-pointer block mt-2" // Added flex, items-center, and justify-center
                        >
                            Upload Files
                        </label>


                        <h3 className="font-bold mt-4 mb-2">Product Name</h3>
                        <input
                            type="text"
                            name="name"
                            value={editedProduct.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors?.name && <p className='text-red-600'>{errors.name}</p>}
                        <h3 className="font-bold mt-4 mb-2">Categories</h3>
                        {categories &&
                            buildCategorieseChipsEdit(categories, (v: string) => { removeProductCategory(v); })
                        }
                        <input placeholder="+ new category" className="p-2 border rounded" value={newCategory ?? ''} onChange={handleCategoryInputChange} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addProductCategory();
                            }
                        }} />
                        {errors?.categories && <p className='text-red-600'>{errors.categories}</p>}

                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Descriptions</h3>
                        <textarea
                            name="description"
                            value={editedProduct.description}
                            onChange={handleTextAreaChange}
                            className="w-full p-2 border rounded h-40"
                        />

                        <h3 className="font-bold mt-4 mb-2">Price per item</h3>
                        <input
                            type="number"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors?.price && <p className='text-red-600'>{errors.price}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => onRemove(editedProduct)} className="px-4 py-2 border rounded">Delete</button>
                    <button onClick={() => onClose()} className="px-4 py-2 border rounded">Cancel</button>
                    <button onClick={async () => {
                        try {
                            if (formValidation()) {
                                const result = await uploadProductImage();
                                if (result)
                                    onSave(result);
                            }
                        } catch (error) {
                            console.error(error);
                            toast.error('Failed to upload image');
                        }
                    }} className="px-4 py-2 bg-red-500 text-white rounded">Save Changes</button>
                </div>

            </div>
        </div>
    );
};

export default EditProductModal;