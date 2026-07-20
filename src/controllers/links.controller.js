import { ZodError } from "zod";
import {
    createLinkService,
    getLinkByCodeService,
    getLinkClicksService,
    deleteLinkService
} from "../services/links.services.js";
import { createLinkSchema } from "../validators/links.validator.js";
import { clicksQuerySchema } from "../validators/links.validator.js";

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



export async function getLinkClicks(req, res) {
    try {

        const { code } = req.params;

        const query = clicksQuerySchema.parse(req.query);

        const clicks = await getLinkClicksService(
            code,
            query.after || null,
            query.limit || 10
        );

        res.status(200).json(clicks);

    } catch (error) {

        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

    export async function deleteLink(req, res) {
    try {
        const { code } = req.params;

        const deletedLink = await deleteLinkService(code);

        if (!deletedLink) {
            return res.status(404).json({
                message: "Link not found"
            });
        }

        res.status(200).json({
            message: "Link deleted successfully",
            data: deletedLink
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}
