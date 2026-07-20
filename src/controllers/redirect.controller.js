import { redirectLinkService } from "../services/redirect.service.js";

export async function redirectLink(req, res) {
    try {
        const { code } = req.params;

        const result = await redirectLinkService(code, req);

        if (result?.status === "not_found") {
            return res.status(404).json({
                message: "Link not found"
            });
        }

        if (result?.status === "expired") {
            return res.status(410).json({
                message: "Link has expired"
            });
        }

        return res.redirect(302, result.target_url);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}