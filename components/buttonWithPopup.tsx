'use client';
import { PosProduct, PosVariationOption } from '@/common/type/order';
import { Product, Variation, VariationOption } from '@/common/type/product';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface ButtonWithPopupProps {
    product: Product,
    posProduct: PosProduct,
    addProduct: (product: PosProduct) => {}
}




const ButtonWithPopup: React.FC<ButtonWithPopupProps> = ({ product, posProduct, addProduct }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<PosVariationOption[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);
    const [price, setPrice] = useState(product.price);


    const handleOptionSelected = (k: string, v: VariationOption) => {
        if (!v.name) return;

        // Check if the exact item with matching pName and name exists
        const existingItem = selectedOptions.find(e => e.pName === k && e.name === v.name);

        let newSelected;

        if (existingItem) {
            // Remove the item that matches both pName (key) and name
            newSelected = selectedOptions.filter(e => !(e.pName === k && e.name === v.name));
        } else {
            // Add the new option if no matching item is found
            newSelected = [...selectedOptions.filter(e => e.pName !== k), new PosVariationOption(k, v.name!, v.price!)];
        }

        // Ensure the price is a number
        posProduct.price = newSelected.reduce((total, e) => total + Number(e.price), 0) + product.price;

        setPrice(posProduct.price);
        setSelectedOptions(newSelected);
    };

    const handleAddOrderProduct = () => {
        const condition = product.variation.length != 0;

        if (condition) {
            setShowPopup(true);
        } else {
            addProduct(posProduct);
        }
    };

    const handleAddOrderVariationsProduct = () => {


        // Check if any required variations are not in selectedOptions
        const missingRequiredVariations = product.variation.filter(
            (v) => v.required && !selectedOptions.some((opt) => opt.pName === v.name)
        );

        if (missingRequiredVariations.length > 0) {
            // Handle the case where a required variation is missing
            toast.error(`Missing required variations: ${missingRequiredVariations.map((v) => v.name).join(', ')}`);
            return; // Exit the function if any required variations are missing
        }

        // If all required variations are selected, update the product
        posProduct.variation = selectedOptions;
        addProduct(posProduct);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <button
                className="mt-2 text-red-500 w-full h-10 bg-red-100 rounded-[20px] flex justify-center items-center"
                onClick={handleAddOrderProduct}
            >
                RM {product.price.toFixed(2)}
            </button>

            {showPopup && (
                <div ref={popupRef} className="absolute top-0 left-0 w- bg-white border border-gray-200 shadow-lg rounded-[20px] p-4 z-[3]">
                    {
                        product.variation.map((e) => <>
                            <div className='mb-[6px]'>
                                <div className='flex mb-[4px]'>
                                    <h1>{e.name}</h1> <p className='text-red-500'>{e.required ? '*' : ''}</p>
                                </div>
                                <div className="flex">
                                    {e.options.map((w) => {
                                        const target = selectedOptions.find((a) => a.pName == e.name); // Assuming selected is true for demonstration purposes, replace with actual logic
                                        const selected = (target && target.name == w.name);


                                        return (
                                            <div key={w.name} className="mr-[4px] mb-[4px]">
                                                <button
                                                    onClick={() => handleOptionSelected(e.name, w)}
                                                    className={`rounded border px-[10px] py-[5px] flex ${selected ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-300 text-gray-500'
                                                        }`}
                                                >
                                                    <p className={`mr-[4px] ${selected ? 'text-white' : 'text-gray-500'}`}>{w.name}</p>
                                                    <p className={`${selected ? 'text-white' : 'text-red-500'}`}>[+RM{w.price}]</p>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>)
                    }

                    <button
                        className="mt-2 text-red-500 w-full h-10 bg-red-100 rounded-full flex justify-center items-center"
                        onClick={handleAddOrderVariationsProduct}
                    >
                        <button
                            className="mt-2 text-red-500 w-full h-10 bg-red-100 rounded-[20px] flex justify-center items-center"
                            onClick={handleAddOrderProduct}
                        >
                            RM {price.toFixed(2)}

                        </button>
                    </button>
                    {/* <p className="mb-4">This is your popup content.</p>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center"
                        onClick={() => setShowPopup(false)}
                    >
                        Close
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button> */}
                </div>
            )}
        </div>
    );
};

export default ButtonWithPopup;