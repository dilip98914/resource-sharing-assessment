import express from "express";
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
} from "../controllers/resourceController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post(
  "/resources/upload",
  authenticateUser,
  upload.single("file"),
  createResource
);
router.get("/resources", authenticateUser, getResources);
router.get("/resources/:id", authenticateUser, getResourceById);
router.delete("/resources/:id", authenticateUser, deleteResource);

export default router;
