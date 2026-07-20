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

export async function getLinkClicksService(code, after, limit) {

    const link = await db.query(
        `
        SELECT id
        FROM links
        WHERE code = $1
        `,
        [code]
    );

    if (link.rows.length === 0) {
        return {
            status: "not_found"
        };
    }


    const result = await db.query(
        `
        SELECT 
            clicks.*
        FROM clicks
        WHERE link_id = $1
        ORDER BY clicked_at ASC
        LIMIT $2
        `,
        [
            link.rows[0].id,
            limit
        ]
    );

    return result.rows;
}

export async function deleteLinkService(code) {
    const result = await db.query(
        `
        DELETE FROM links
        WHERE code = $1
        RETURNING *;
        `,
        [code]
    );

    return result.rows[0];
}

export async function getLinkClicksCsvService(code) {
    const result = await db.query(
        `
        SELECT 
            clicks.id,
            clicks.clicked_at,
            clicks.referrer,
            clicks.user_agent
        FROM clicks
        JOIN links ON links.id = clicks.link_id
        WHERE links.code = $1
        ORDER BY clicks.clicked_at ASC
        `,
        [code]
    );

    return result.rows;
}