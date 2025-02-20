"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const job_route_1 = __importDefault(require("./routes/job.route"));
const acountLimiter_1 = __importDefault(require("./utils/acountLimiter"));
const app = (0, express_1.default)();
app.use(acountLimiter_1.default, (0, cors_1.default)(), (0, compression_1.default)(), express_1.default.json(), express_1.default.urlencoded({ extended: false }));
app.get("/healthcheck", (req, res) => {
    res.sendStatus(200);
});
app.use("/api/jobs", job_route_1.default);
app.use((req, res, next) => {
    next(new http_errors_1.default.NotFound());
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: "error",
        error: err.message || err.error,
    });
});
exports.default = app;
