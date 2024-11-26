"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resourceController_1 = require("../controllers/resourceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = express_1.default.Router();
router.post("/resources/upload", authMiddleware_1.authenticateUser, uploadMiddleware_1.upload.single("file"), resourceController_1.createResource);
router.get("/resources", authMiddleware_1.authenticateUser, resourceController_1.getResources);
router.get("/resources/:id", authMiddleware_1.authenticateUser, resourceController_1.getResourceById);
router.delete("/resources/:id", authMiddleware_1.authenticateUser, resourceController_1.deleteResource);
exports.default = router;
