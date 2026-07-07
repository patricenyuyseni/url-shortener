import { createLinkSchema} from  "../validators/links.validator.js";

export async function createLink(req, res) {
    try{ 
        const validatedData  = createLinkSchema.parse(req.body);
        res.status(201).json({
            message: "Link created successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while creating the link"
        });
    }
}