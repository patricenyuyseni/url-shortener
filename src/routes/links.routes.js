import express from "express";

import {
    createLink,
    getLinkByCode,
    getLinkClicks,
    getLinkClicksCsv,
    deleteLink
} from "../controllers/links.controller.js";

const router = express.Router();


router.post("/", createLink);


router.get("/:code/clicks.csv", getLinkClicksCsv);

router.get("/:code/clicks", getLinkClicks);


router.get("/:code", getLinkByCode);


router.delete("/:code", deleteLink);


export default router;