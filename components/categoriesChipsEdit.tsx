const buildCategorieseChipsEdit = (categories: string, onSelectCallback: Function) => {
    if (categories == '') return;
    const convertedCategories = categories.split(',').map(role => role.trim())

    return (<>
        {convertedCategories.map((e) =>
            <div className="flex flex-wrap items-center bg-red-500 text-white px-2 my-1 mr-1 sm:rounded inline-flex">
                <div className="cursor-pointer" >
                    <p>{e}</p>
                </div>
                <div className="cursor-pointer ml-2" onClick={() => onSelectCallback(e)}>
                    <p className="text-white-500">✕</p>
                </div>
            </div>
        )}
    </>);
}

export { buildCategorieseChipsEdit };