"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Transaction() {
    return {
        account_id: true,
        date: true,
        id: true,
        invoice_amount: true,
        product: true,
        purchase_amount: true,
        purchase_method: true,
        repeated_purchase: true,
        tax_amount: true,
    };
}
exports.default = Transaction;
