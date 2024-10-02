// @/common/type/sale.ts

export interface SaleRecord {
    id: number;
    date: string;
    total: number;
    taxAmount: number;
    paymentMethod: string;
    status: string;
}

export interface WeeklySale {
    date: string;
    total: number;
}