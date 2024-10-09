// interface Order {
//     orders: Product[];
// }

import { VariationOption } from "./product";

export interface PaymentSummary {
    subTotal: number;
    tax: number;
    total: number;
}

export enum OrderType {
    DineIn = 'dinein',
    TakeAway = 'takeaway'
}

export enum OrderStatus {
    Active = 'active',
    Canceled = 'canceled',
    Completed = 'completed'
}

export class PosVariationOption {
    pName: string;
    name: string;
    price: number;
    constructor(pName: string, name: string, price: number) {
        this.pName = pName;
        this.name = name;
        this.price = price;
    }
}

export class PosProduct {
    name: string;
    id: number;
    price: number;
    image: string[];
    quantity: number;
    variation: PosVariationOption[];

    constructor(name: string, id: number, price: number, image: string[], quantity: number, variation: PosVariationOption[]) {
        this.name = name;
        this.id = id;
        this.price = price;
        this.image = image;
        this.quantity = quantity ?? 1;
        this.variation = variation ?? [];
    }

    // Static method to create a Product instance from a plain object
    static fromPlainObject(obj: any): PosProduct {
        return new PosProduct(
            obj.name,
            obj.id,
            obj.price,
            obj.image,
            obj.quantity,
            []
        );
    }
}

export class Order {
    id: number;
    orderType: OrderType;
    products: PosProduct[];
    subTotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    tableId?: number;
    createDate: Date;
    updateDate: Date;

    constructor(orderType: OrderType, id: number, products: PosProduct[], subTotal: number, tax: number, total: number, createDate: Date, updateDate: Date, status?: OrderStatus, tableId?: number) {
        this.id = id
        this.orderType = orderType;
        this.products = products;
        this.subTotal = subTotal ?? 0;
        this.tax = tax ?? 0;
        this.total = total ?? 0;
        this.status = status ?? OrderStatus.Active;
        this.tableId = tableId;
        this.createDate = createDate ?? new Date();
        this.updateDate = updateDate ?? new Date();
    }


    // Static method to create a Product instance from a plain object
    static fromPlainObject(obj: any): Order {
        return new Order(
            obj.orderType,
            obj.id,
            obj.products,
            obj.subTotal,
            obj.tax,
            obj.total,
            obj.createDate,
            obj.updateDate,
            obj.orderStatus,
            obj.tableId,
        );
    }


}
