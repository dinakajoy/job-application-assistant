"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname).toLowerCase();
        if (file.mimetype !== "application/pdf" || fileExt !== ".pdf") {
            return cb(new Error("Only PDF files are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.default = upload;
