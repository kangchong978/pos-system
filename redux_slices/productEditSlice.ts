import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Variation, MyFile, VariationOption } from '@/common/type/product';



interface ProductEditState {
    product: Product;
    errors: { name?: string, price?: string, category?: string, variation?: string, variationOption?: { name?: string, price?: string } };
    /* required special process before submit form */
    files: MyFile[];
    newCategory: string;
    newVariation: string;
    newVariationOption: VariationOption;

}

const initialState: ProductEditState = {
    product: new Product('', [], [], '', '', 0, []),
    errors: {},
    files: [],
    newCategory: '',
    newVariation: '',
    newVariationOption: {}
}

const productEditSlice = createSlice({
    name: 'productEdit',
    initialState,
    reducers: {
        setProduct: (state, action: PayloadAction<Product>) => {
            state.product = action.payload;



            state.files = state.product.image.map((e) => {
                const file: MyFile = { 'url': e };
                return file;
            });

            // reset state elements 
            state.errors = {};
            state.newCategory = '';
            state.newVariation = '';
            state.newVariationOption = {};
        },
        setFiles: (state, action: PayloadAction<MyFile[]>) => {
            state.files = action.payload;
        },
        setNewCategory: (state, action: PayloadAction<string>) => {
            state.newCategory = action.payload;
        },
        setNewVariation: (state, action: PayloadAction<string>) => {
            state.newVariation = action.payload;
        },
        setNewVariationOption: (state, action: PayloadAction<VariationOption>) => {
            state.errors = {
                ...state.errors,
                variationOption: undefined
            }
            state.newVariationOption = action.payload;
        },
        updateProductField: (state, action: PayloadAction<{ field: keyof any; value: any }>) => {
            state.errors = {
                ...state.errors,
                [action.payload.field]: undefined
            }
            state.product = Product.fromPlainObject({
                ...state.product,
                [action.payload.field]: action.payload.value
            });
        },
        setError: (state, action: PayloadAction<{}>) => {
            state.errors = action.payload;
        },
    }
})

export const {
    setProduct,
    setFiles,
    setNewCategory,
    setNewVariation,
    setNewVariationOption,
    updateProductField,
    setError
} = productEditSlice.actions;

export default productEditSlice.reducer;