import { Router } from "express";
import {
  getFileInfoAndURL,
  getSharedFileViaLink,
} from "../controllers/fileControllers.js";
import { serveFile } from "../middlewares/serveFile.js";

const router = Router();

router.get("/file/:fileId", getFileInfoAndURL);

// google files cannot be served .... --> (Not authorized)
// if link not enabled then show a different message.
router.get("/file/view/:fileId", getSharedFileViaLink, serveFile);

export default router;
