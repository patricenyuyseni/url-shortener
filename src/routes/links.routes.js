import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    res.status(201).json({
        message: "Link created successfully"
    });
});

export default router;