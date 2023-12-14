"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
const types_1 = require("./models/types");
class Status extends jsonrequest_1.default {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/status';
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        return types_1.NodeStatusResponse.from_obj_for_encoding(body);
    }
}
exports.default = Status;
