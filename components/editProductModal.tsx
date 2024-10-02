
import { MyFile, Product, Variation } from "@/common/type/product";
import { setError, setFiles, setNewCategory, setNewVariation, setNewVariationOption, setProduct, updateProductField } from "@/redux_slices/productEditSlice";
import { AppDispatch, RootState } from "@/store";
import { initialize } from "next/dist/server/lib/render-server";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageGallery from "./imagesGallary";
import { buildCategorieseChipsEdit } from "./categoriesChipsEdit";
import toast from "react-hot-toast";
import { useCoreClient } from "@/utils/useClient";

interface EditProductModalProps {
    oriProduct: Product;
    onClose: () => void;
    onSave: (product: Product) => void;
    onRemove: (product: Product) => void;
}


const EditProductModal: React.FC<EditProductModalProps> = ({ oriProduct, onClose, onSave, onRemove }) => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full   max-h-[90vh] flex flex-col">
                <div className="mx-[20px] mt-[20px] flex justify-start space-x-4">
                    <h1 className="text-2xl font-bold text-red-500">{product.name}</h1>
                </div>
                <div className="p-4 grid grid-cols-[30%,auto] gap-6 overflow-y-auto flex-grow">

                    <div>
                        <ImageGallery files={files} onRemove={handleFileRemove} />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="file-upload" // Add an id for the label to reference
                            hidden // Hide the default file input
                            onChange={handleFilesChanges}
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
                            value={product.name}
                            onChange={(v) => dispatch(updateProductField({ field: v.target.name, value: v.target.value }))}
                            className="w-full p-2 border rounded"
                        />
                        {errors?.name && <p className='text-red-600'>{errors.name}</p>}
                        <h3 className="font-bold mt-4 mb-2">Categories</h3>
                        {product.category &&
                            buildCategorieseChipsEdit(product.category, (v: string) => { handleCategoryRemove(v); })
                        }
                        <input placeholder="+ new category" className="p-2 border rounded" value={newCategory ?? ''}
                            onChange={handleCategoryInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddCategory();
                                }
                            }}
                        />
                        {errors?.category && <p className='text-red-600'>{errors.category}</p>}

                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Descriptions</h3>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={(v) => dispatch(updateProductField({ field: v.target.name, value: v.target.value }))}
                            className="w-full p-2 border rounded h-40 mb-2"
                        />

                        <h3 className="font-bold mb-2">Variations</h3>

                        {product.variation && product.variation.map((v, i) => (
                            <div className="mb-[10px] border p-2">
                                <div className="flex mb-[10px] relative">
                                    <button className="mr-2 border h-[20px] w-[20px] flex items-center justify-center" onClick={() => handleRemoveVariation(i)}>
                                        <p className="text-xs text-gray-300">-</p>
                                    </button>
                                    <h3>{v.name}</h3>

                                    {/* Position the right div */}
                                    <div className="absolute top-0 right-0 flex items-center">
                                        <input className="mr-1" type="checkbox" checked={v.required} onClick={() => handleRequiredVariation(i, v.required)} />
                                        <label>Required</label>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-wrap mb-[10px]">
                                        {v.options.map((w, wi) => (
                                            <div className="mr-[4px] mb-[4px]">
                                                {/* <p>{w.name} | {w.price}</p> */}
                                                <div className="rounded border border-red-500 px-[10px] py-[5px] flex">
                                                    <p className="text-gray mr-[4px]">{w.name}</p>
                                                    <p className="text-red-500"> [+RM{w.price}]</p>
                                                    <button onClick={() => handleRemoveVariationOption(i, wi)}>
                                                        <div className="cursor-pointer ml-2">
                                                            <p className="text-gray-300">✕</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex">
                                        <div>
                                            <input name="name" placeholder="+ new option" className="p-2 border rounded mr-[10px]" value={newVariationOption.name ?? ''} onChange={handleVaritationOptionInputChange} onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddVariationOption(i);
                                                }
                                            }} />
                                            {errors?.variationOption?.name && <p className='text-red-600'>{errors?.variationOption?.name}</p>}
                                        </div>
                                        <div>

                                            <input name="price" placeholder="+ price" className="p-2 border rounded" type="number" value={newVariationOption.price} onChange={handleVaritationOptionInputChange} onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddVariationOption(i);
                                                }
                                            }} />
                                            {errors?.variationOption?.price && <p className='text-red-600'>{errors?.variationOption?.price}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}



                        <input placeholder="+ new variation" className="p-2 border rounded" value={newVariation ?? ''} onChange={handleVaritationInputChange} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddVariation();
                            }
                        }} />
                        {errors?.variation && <p className='text-red-600'>{errors.variation}</p>}

                        <h3 className="font-bold mt-4 mb-2">Price per item (RM)</h3>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(v) => dispatch(updateProductField({ field: v.target.name, value: v.target.value }))}
                            className="w-full p-2 border rounded"

                        />
                        {errors?.price && <p className='text-red-600'>{errors.price}</p>}

                    </div>
                </div>
                <div className="m-3 flex justify-end space-x-4">
                    <button onClick={() => onRemove(product)} className="px-4 py-2 border rounded">Delete</button>
                    <button onClick={() => onClose()} className="px-4 py-2 border rounded">Cancel</button>
                    <button onClick={(v) => handleSubmit()} className="px-4 py-2 bg-red-500 text-white rounded">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;