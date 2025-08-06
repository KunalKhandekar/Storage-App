import { Router } from "express";
import {
  getFileInfoAndURL,
  getSharedFileViaLink,
} from "../controllers/fileControllers.js";
import { serveFile } from "../middlewares/serveFile.js";

const router = Router();

// ---------------- Guest Routes -------------------------

// GET /guest/file/:fileId
// Desc -> Retrieve file information and URL for displaying file preview.
// Params -> { fileId }
router.get("/file/:fileId", getFileInfoAndURL);

// Note: Google-hosted files cannot be served directly (Unauthorized).

// GET /guest/file/view/:fileId
// Desc -> Serve a file via a public link.
// Params -> { fileId }
// Query -> { token: string }
router.get("/file/view/:fileId", getSharedFileViaLink, serveFile);

export default router;
