import { db } from "../db.js";
import { generateCode } from "../utils/codeGenerator.js";

export async function createLinkService(data) {
    let { target_url, code, expires_at } = data;

    if (!code) {
        code = generateCode();
    }

    const query = `
        INSERT INTO links (target_url, code, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [
        target_url,
        code,
        expires_at
    ];

    const result = await db.query(query, values);

    return result.rows[0];
}

export async function getLinkByCodeService(code) {
    const result = await db.query(
        `
        SELECT *
        FROM links
        WHERE code = $1
        `,
        [code]
    );

    return result.rows[0];
}

export async function getLinkClicksService(
    code,
    after,
    limit
) {
    const linkResult = await db.query(
        `
        SELECT id
        FROM links
        WHERE code = $1
        `,
        [code]
    );

    const link = linkResult.rows[0];

    if (!link) {
        return [];
    }

    const query = `
        SELECT *
        FROM clicks
        WHERE link_id = $1
        AND ($2::timestamp IS NULL OR clicked_at > $2)
        ORDER BY clicked_at ASC
        LIMIT $3
    `;

    const result = await db.query(
        query,
        [link.id, after, limit]
    );

    return result.rows;
}