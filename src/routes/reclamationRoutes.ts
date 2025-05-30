import express from "express";
import {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation,
} from "../controllers/reclamationController";

const router = express.Router();

router.post("/create", createReclamation);
router.get("/", getAllReclamations);
router.get("/:id", getReclamationById);
router.put("/:id", updateReclamation);
router.delete("/:id", deleteReclamation);

export default router;
