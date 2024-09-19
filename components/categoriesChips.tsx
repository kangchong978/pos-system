const buildCategoriesChips = (categories: string) => {
    if (!categories) return null; // Handle empty string

    const convertedCategories = categories.split(',').map((category) => category.trim());
    const displayCategories = convertedCategories.slice(0, 1); // Get the first 3 categories

    return (
        <>
            {displayCategories.map((category, index) => (
                <div key={index} className="flex flex-wrap items-center bg-red-500 text-white px-2 mb-1 mr-1 sm:rounded inline-flex">
                    <div className="text-white px-2 mr-1 sm:rounded">
                        <p>{category}</p>
                    </div>
                </div>
            ))}
            {convertedCategories.length > 1 && (
                <div className="flex">
                    <div className="text-red-500 px-2 mr-1 sm:rounded">
                        <p>...</p>
                    </div>
                </div>
            )}
        </>
    );
};

export { buildCategoriesChips };
