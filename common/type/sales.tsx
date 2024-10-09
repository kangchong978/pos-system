// @/common/type/sale.ts

export class SaleRecord {
    id: number;
    order_id: number;
    total_amount: number;
    tax_amount: number;
    payment_method: string;
    transaction_date: string;

    constructor(
        id: number,
        order_id: number,
        total_amount: number,
        tax_amount: number,
        payment_method: string,
        transaction_date: string
    ) {
        this.id = id;
        this.order_id = order_id;
        this.total_amount = total_amount;
        this.tax_amount = tax_amount;
        this.payment_method = payment_method;
        this.transaction_date = transaction_date;
    }

    static fromPlainObject(obj: any): SaleRecord {
        return new SaleRecord(
            obj.id,
            obj.order_id,
            obj.total_amount,
            obj.tax_amount,
            obj.payment_method,
            obj.transaction_date
        );
    }
}