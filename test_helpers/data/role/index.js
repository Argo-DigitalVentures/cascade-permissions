"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("./admin"));
const basic_1 = __importDefault(require("./basic"));
const moderator_1 = __importDefault(require("./moderator"));
function BaseRoles() {
    return {
        admin: () => admin_1.default(),
        basic: () => basic_1.default(),
        moderator: () => moderator_1.default(),
    };
}
exports.default = BaseRoles;
