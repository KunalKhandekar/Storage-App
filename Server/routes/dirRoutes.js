import { Router } from "express";

import validateRequest from "../middlewares/validateRequest.js";
import { createDir, deleteDir, getDir, updateDir } from "../controllers/dirControllers.js";

const router = Router();

router.get("/{:id}", getDir);

router.post("/{:parentDirId}", createDir);

router.patch("/:id", updateDir);

router.delete("/:id", deleteDir);

router.param("id", validateRequest);
router.param("pzrentDirId", validateRequest);

export default router;
