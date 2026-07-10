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