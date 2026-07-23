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


    const linkId = link.rows[0].id;


    let query = `
        SELECT
            clicks.id,
            clicks.clicked_at,
            clicks.referrer,
            clicks.user_agent
        FROM clicks
        WHERE clicks.link_id = $1
    `;


    const values = [linkId];


    if (after) {

        query += `
            AND (
                clicks.clicked_at > $2::timestamptz
                OR (
                    clicks.clicked_at = $2::timestamptz
                    AND clicks.id > $3
                )
            )
        `;

        values.push(
            after.clicked_at,
            after.id
        );
    }


    query += `
        ORDER BY clicks.clicked_at ASC, clicks.id ASC
        LIMIT $${values.length + 1}
    `;


    values.push(limit);


    const result = await db.query(query, values);


    return {
        data: result.rows,
        next_cursor: result.rows.length > 0
            ? {
                id: result.rows[result.rows.length - 1].id,
                clicked_at: result.rows[result.rows.length - 1].clicked_at
            }
            : null
    };
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
            clicks.id,
            clicks.clicked_at,
            clicks.referrer,
            clicks.user_agent
        FROM clicks
        JOIN links ON links.id = clicks.link_id
        WHERE links.code = $1
        ORDER BY clicks.clicked_at ASC, clicks.id ASC
        `,
        [code]
    );


    return result.rows;
}