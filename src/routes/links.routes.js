import express from "express";
import { createLink } from "../controllers/links.controller.js";

const router = express.Router();

router.post("/", createLink);

export default router;