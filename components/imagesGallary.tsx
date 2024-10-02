import React, { useState } from 'react';
import Image from 'next/image';
import { MyFile } from '@/common/type/product';

interface ImageGalleryProps {
    files: MyFile[] | undefined;
    onRemove: Function;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ files, onRemove }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const mapMyFile = (file: MyFile): string => {
        if (file.file)
            return URL.createObjectURL(file.file);
        else
            return `http://localhost:6001/img/product/${file.url}`;
    }
    const imageUrls: string[] = files ? Array.from(files).map(file => mapMyFile(file)) : [];



    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
    };

    const handleRemove = () => {
        if (files) {
            onRemove(files[currentIndex]);
            setCurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
        }

    };


    return (
        <div>
            <div className="relative h-[300px]">
                {imageUrls.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 mb-4 h-full  flex items-center justify-center">
                        <Image
                            src={imageUrls[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            className="rounded-lg"
                            objectFit="cover"
                            layout="fill"
                        />
                        <button onClick={handleRemove} className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
                            Remove Image
                        </button>
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-2">
                <button onClick={handlePrev} disabled={imageUrls.length <= 1} className="px-2 py-1 border rounded">Previous</button>
                <div className="flex overflow-x-auto space-x-2 w-full border rounded p-2">
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className={`w-16 h-16 object-cover cursor-pointer border rounded ${currentIndex === index ? 'border-red-500' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>

                <button onClick={handleNext} disabled={imageUrls.length <= 1} className="px-2 py-1 border rounded">Next</button>
            </div>
        </div>
    );
};

export default ImageGallery;