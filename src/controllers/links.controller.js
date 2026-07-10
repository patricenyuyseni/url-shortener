import { createLinkSchema} from  "../validators/links.validator.js";
import { createLinkService } from "../services/links.services.js";
import { ZodError } from "zod";
export async function createLink(req, res) {
    try{ 
        const validatedData  = createLinkSchema.parse(req.body);
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
         if (error.code === '23505') { // Unique violation error code
            return res.status(409).json({
                message: "The provided code already exists. Please choose a different code."
            });
        }
        res.status(500).json({
            message: "Internal server error",
        });
    }
}