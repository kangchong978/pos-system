import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { MyFile } from '@/common/type/product';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';




interface ImageGalleryProps {
    files: MyFile[] | undefined;
    onRemove: Function;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ files, onRemove }) => {

    const { currentTheme } = useTheme(); // Get the current theme

    /* to overcome the theme incorrect by rerender while theme changed */
    const styles = useMemo(() => ({
        container: {
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
        },
        mainImageContainer: {
            position: 'relative' as const,
            height: '300px',
            backgroundColor: getColor('background-primary'),
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '16px',
        },
        removeButton: {
            position: 'absolute' as const,
            top: '16px',
            right: '16px',
            opacity: 0.5,
            color: getColor('on-primary'),
            backgroundColor: getColor('error'),
            padding: '8px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            transition: 'opacity 0.3s ease',
        },
        navigationContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
        },
        navButton: {
            backgroundColor: getColor('background-secondary'),
            border: `1px solid ${getColor('border')}`,
            borderRadius: '4px',
            padding: '8px',
            cursor: 'pointer',
        },
        thumbnailContainer: {
            display: 'flex',
            overflowX: 'auto' as const,
            gap: '8px',
            padding: '8px',
            border: `1px solid ${getColor('border')}`,
            borderRadius: '4px',
        },
        thumbnail: {
            width: '64px',
            height: '64px',
            objectFit: 'cover' as const,
            cursor: 'pointer',
            borderRadius: '4px',
            border: `2px solid transparent`,
        },
        thumbnailActive: {
            borderColor: getColor('primary'),
        },
    }), [currentTheme]); // Recalculate styles when theme changes


    const [currentIndex, setCurrentIndex] = useState(0);

    const mapMyFile = (file: MyFile): string => {
        if (file.file) return URL.createObjectURL(file.file);
        return `http://localhost:6001/img/product/${file.url}`;
    };

    const imageUrls: string[] = files ? Array.from(files).map(mapMyFile) : [];

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
        <div style={styles.container}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    style={styles.mainImageContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {imageUrls.length > 0 && (
                        <Image
                            src={imageUrls[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    )}
                    <motion.button
                        style={styles.removeButton}
                        whileHover={{ opacity: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemove}
                    >
                        <Trash2 size={20} />
                    </motion.button>
                </motion.div>
            </AnimatePresence>

            <div style={styles.navigationContainer}>
                <motion.button
                    style={styles.navButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    disabled={imageUrls.length <= 1}
                >
                    <ChevronLeft size={24} color={getColor('primary')} />
                </motion.button>

                <div style={styles.thumbnailContainer}>
                    {imageUrls.map((url, index) => (
                        <motion.img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                                ...styles.thumbnail,
                                ...(currentIndex === index ? styles.thumbnailActive : {}),
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>

                <motion.button
                    style={styles.navButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    disabled={imageUrls.length <= 1}
                >
                    <ChevronRight size={24} color={getColor('primary')} />
                </motion.button>
            </div>
        </div>
    );
};

export default ImageGallery;