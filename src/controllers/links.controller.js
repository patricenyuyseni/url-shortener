import { ZodError } from "zod";
import {
    createLinkService,
    getLinkByCodeService
} from "../services/links.services.js";
import { createLinkSchema } from "../validators/links.validator.js";

export async function createLink(req, res) {
    try {
        const validatedData = createLinkSchema.parse(req.body);

        const result = await createLinkService(validatedData);

        res.status(201).json({
            message: "Link created successfully",
            data: result
        });

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        if (error.code === "23505") {
            return res.status(409).json({
                message: "The provided code already exists. Please choose a different code."
            });
        }

        console.log(error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export async function getLinkByCode(req, res) {
    try {
        const { code } = req.params;

        const result = await getLinkByCodeService(code);

        if (!result) {
            return res.status(404).json({
                message: "Link not found"
            });
        }

        res.status(200).json(result);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}