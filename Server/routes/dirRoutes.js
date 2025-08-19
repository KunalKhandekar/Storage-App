import { Router } from "express";

import validateRequest from "../middlewares/validateRequest.js";
import {
  createDir,
  deleteDir,
  getDir,
  updateDir,
} from "../controllers/dirControllers.js";
import { limiter } from "../utils/RateLimiter.js";

const router = Router();

["id", "parentDirId"].forEach((param) => router.param(param, validateRequest));

// GET /directory/:id
// Desc    -> Retrieve directory information.
// Params  -> { id: string }
router.get("/{:id}", limiter.getDirLimiter, getDir);

// POST /directory/:parentDirId?
// Desc    -> Create a directory inside a parent directory.
// Params  -> { parentDirId?: string }
// Headers -> { dirname: string }
router.post("/{:parentDirId}", limiter.createDirLimiter, createDir);

// PATCH /directory/:id
// Desc   -> Update the directory name.
// Params -> { id: string }
// Body   -> { name: string }`
router.patch("/:id", limiter.updateDirLimiter, updateDir);

// DELETE /directory/:id
// Desc   -> Delete a directory by ID.
// Params -> { id: string }
router.delete("/:id", limiter.deleteDirLimiter, deleteDir);

export default router;
