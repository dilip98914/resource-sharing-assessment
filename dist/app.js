"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.send("OK HEALTH!");
});
app.use("/api/user", resourceRoutes_1.default);
app.use("/api/", resourceRoutes_1.default);
exports.default = app;
