import express from "express";
import { createLink,getLinkByCode,getLinkClicks,deleteLink} from "../controllers/links.controller.js";
import { redirectLink } from "../controllers/redirect.controller.js";

const router = express.Router();

router.post("/", createLink);

router.get("/:code/clicks", getLinkClicks);

router.get("/:code/details", getLinkByCode);

router.delete("/:code", deleteLink);

router.get("/:code", redirectLink);

export default router;