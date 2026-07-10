import express from "express";
import { createLink,getLinkByCode} from "../controllers/links.controller.js";
import { redirectLink } from "../controllers/redirect.controller.js";

const router = express.Router();

router.post("/", createLink);

router.get("/:code/details", getLinkByCode);

router.get("/:code", redirectLink);

export default router;