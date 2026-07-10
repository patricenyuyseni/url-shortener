import { db } from "../db.js";

export async function redirectLinkService(code, req) {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const linkResult = await client.query(
            `
            SELECT *
            FROM links
            WHERE code = $1
            `,
            [code]
        );

        const link = linkResult.rows[0];

        if (!link) {
            throw new Error("LINK_NOT_FOUND");
        }

        await client.query(
            `
            UPDATE links
            SET click_count = click_count + 1
            WHERE id = $1
            `,
            [link.id]
        );

        await client.query(
            `
            INSERT INTO clicks (link_id, referrer, user_agent)
            VALUES ($1, $2, $3)
            `,
            [
                link.id,
                req.get("referer") || null,
                req.get("user-agent") || null
            ]
        );

        await client.query("COMMIT");

        return link;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}