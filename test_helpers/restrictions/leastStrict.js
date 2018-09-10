"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function LeastStrict() {
    return {
        types: {
            account: ['id', 'last_active_date'],
            forum: ['id', 'last_active_date', 'post_created'],
            message: ['id', 'account_id', 'modified_date'],
        },
        roles: {
            basic: ['id', 'last_active_date'],
            moderator: ['id', 'authorized_date', 'last_active_date'],
        },
    };
}
exports.default = LeastStrict;
