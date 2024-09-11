import React, { useState } from 'react';
import Image from 'next/image';

interface EditProductModalProps {
    product: Product;
    onClose: () => void;
    onSave: (product: Product) => void;
}


const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave }) => {
    const [editedProduct, setEditedProduct] = useState(product);

    const handleInputChange = (e: String) => {
        // const { name, value } = e.target;
        // setEditedProduct({ ...editedProduct, [name]: value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="bg-red-50 rounded-lg p-4 mb-4">
                            <Image src={product.image} alt={product.name} width={300} height={300} className="rounded-lg" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Product Name</h2>
                        <input
                            type="text"
                            name="name"
                            value={editedProduct.name}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <h3 className="font-bold mt-4 mb-2">Categories</h3>
                        <div className="flex space-x-2">
                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm">Burger</span>
                            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-sm">Recommended</span>
                            <button className="text-gray-400">+add</button>
                        </div>
                        <h3 className="font-bold mt-4 mb-2">Product code</h3>
                        <div className="flex items-center space-x-4">
                            <Image src="/qr-code.png" alt="QR Code" width={100} height={100} />
                            <span>{product.code}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Descriptions</h3>
                        <textarea
                            name="description"
                            value={editedProduct.description}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded h-40"
                        />
                        <h3 className="font-bold mt-4 mb-2">Variations</h3>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Name</th>
                                    <th className="text-left">Type</th>
                                    <th className="text-left">Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Size</td>
                                    <td>Single</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Add-ons</td>
                                    <td>Multiple</td>
                                    <td>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="border p-2 rounded">
                                                <div>Onion</div>
                                                <div className="text-red-500">+$0.20</div>
                                                <div className="text-sm text-gray-500">whole onion</div>
                                            </div>
                                            <div className="border p-2 rounded">
                                                <div>Cheese</div>
                                                <div className="text-red-500">+$0.20</div>
                                                <div className="text-sm text-gray-500">1 slice</div>
                                            </div>
                                            <div className="border p-2 rounded">
                                                <div>Chili Powder</div>
                                                <div className="text-red-500">+$0.20</div>
                                                <div className="text-sm text-gray-500">20 gram</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 className="font-bold mt-4 mb-2">Price per item</h3>
                        <input
                            type="number"
                            name="price"
                            value={editedProduct.price}
                            // onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => onClose()} className="px-4 py-2 border rounded">Cancel</button>
                    <button onClick={() => onSave(editedProduct)} className="px-4 py-2 bg-red-500 text-white rounded">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;