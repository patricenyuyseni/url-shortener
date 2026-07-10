import { redirectLinkService } from "../services/redirect.service.js";

export async function redirectLink(req, res) {
    try {
        const { code } = req.params;

        const result = await redirectLinkService(code, req);

        res.redirect(302, result.target_url);

    } catch (error) {
        console.log(error);

        if (error.message === "LINK_NOT_FOUND") {
    return res.status(404).json({
        message: "Link not found"
    });
}

        res.status(500).json({
            message: "Internal server error"
        });
    }
}