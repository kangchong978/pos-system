'use client';
import React, { useState } from 'react';

const categories = [
    { id: 'juices', icon: '🍺', name: 'Juices' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    { id: 'fries', icon: '🍟', name: 'Fries' },
    // Add more categories as needed
];

const CategoryList = () => {
    const [selectedCategory, setSelectedCategory] = useState('juices');

    return (
        <div className='flex'>
            <div className="flex items-center space-x-4 overflow-x-auto py-2 scrollbar-hide">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap
            ${selectedCategory === category.id
                                ? 'bg-red-100 border-2 border-red-500'
                                : 'bg-white'}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <span className="text-xl">{category.icon}</span>
                        <span className={`${selectedCategory === category.id ? 'text-red-500' : 'text-gray-700'}`}>
                            {category.name}
                        </span>
                    </button>
                ))}

            </div>
            <div className="flex items-center ml-4">
                <button className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-gray-500">
                    +
                </button>
            </div>
        </div>
    );
};

export default CategoryList;