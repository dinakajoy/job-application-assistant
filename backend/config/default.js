"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
dotenv_safe_1.default.config();
exports.default = {
    environment: {
        port: Number(String(process.env.PORT)) || 1337,
        apiKey: Number(String(process.env.OPENAI_API_KEY)) || "",
    }
};
