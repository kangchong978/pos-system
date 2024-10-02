export class VariationOption {
    name?: string;
    price?: number;
    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}

export class Variation {
    name: string;
    required: boolean;
    options: VariationOption[];
    constructor(name: string, required: boolean, options: any[]) {
        this.name = name;
        this.required = required;
        this.options = options;
    }

    /**
     * Variation {
     *  name: 'Size',
     *  requried: true,
     *  options: [
     *      {'name':'S', 'price':10.00},
     *      {'name':'M', 'price':12.00},
     *      {'name':'L', 'price':15.00},
     *  ]
     * }
     */
}

export class Product {
    id?: number; // null for new create product
    name: string;
    image: string[];
    category: string[];
    description: string;
    code: string;
    price: number;
    variation: Variation[];

    constructor(name: string, image: string[], category: string[], description: string, code: string, price: number, variation: Variation[], id?: number,) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.category = category;
        this.description = description;
        this.code = code;
        this.price = price;
        this.variation = variation;
    }

    // Static method to create a Product instance from a plain object
    static fromPlainObject(obj: any): Product {
        return new Product(
            obj.name,
            obj.image,
            obj.category,
            obj.description,
            obj.code,
            obj.price,
            obj.variation,
            obj.id
        );
    }


    public setName(name: string) {
        this.name = name;
    }

    public setPrice(price: number) {
        this.price = price;
    }
    public setCategory(category: string[]) {
        this.category = category;
    }

    public setImage(image: string[]) {
        this.image = image;
    }
    public setDescription(description: string) {
        this.description = description;
    }
}

export interface MyFile {
    file?: File;
    url?: string;
}

export interface Category {
    id: number;
    name: string;
}