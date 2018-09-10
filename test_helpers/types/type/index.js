"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = __importDefault(require("./account"));
const forum_1 = __importDefault(require("./forum"));
const message_1 = __importDefault(require("./message"));
const transaction_1 = __importDefault(require("./transaction"));
function BaseTypes() {
    return {
        account: () => account_1.default(),
        forum: () => forum_1.default(),
        message: () => message_1.default(),
        transaction: () => transaction_1.default(),
    };
}
exports.default = BaseTypes;
