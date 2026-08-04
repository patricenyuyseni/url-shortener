import dotenv from "dotenv";

dotenv.config({
    path: ".env.test",
    override: true
});

import test from "node:test";
import assert from "node:assert/strict";
import { db } from "../db.js";
import {
    createLinkService,
    getLinkClicksService
} from "../services/links.services.js";
import { redirectLinkService } from "../services/redirect.service.js";
import { createLink } from "../controllers/links.controller.js";


test("redirect increases click counter and saves click", async () => {
    const link = await createLinkService({
        target_url: "https://google.com"
    });

    const result = await redirectLinkService(link.code, {
        get(header) {
            if (header === "referer") return "https://example.com";
            if (header === "user-agent") return "test-agent";
            return null;
        }
    });

    assert.equal(result.target_url, "https://google.com");

    const details = await db.query(
        "SELECT click_count FROM links WHERE code = $1",
        [link.code]
    );

    assert.equal(details.rows[0].click_count, 1);

    const clicks = await db.query(
        "SELECT * FROM clicks WHERE link_id = $1",
        [link.id]
    );

    assert.equal(clicks.rows.length, 1);
});


test("expired links do not redirect", async () => {
    const link = await createLinkService({
        target_url: "https://google.com",
        expires_at: "2020-01-01T00:00:00Z"
    });

    const result = await redirectLinkService(link.code, {
        get() {
            return null;
        }
    });

    assert.equal(result.status, "expired");
});


test("SQL injection code is rejected", async () => {
    const req = {
        body: {
            target_url: "https://google.com",
            code: "abc'--"
        }
    };

    let statusCode;
    let response;

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },

        json(data) {
            response = data;
            return this;
        }
    };

    await createLink(req, res);

    assert.equal(statusCode, 400);
    assert.equal(response.message, "Validation error");
});


test("click pagination returns no duplicate ids", async () => {
    const link = await createLinkService({
        target_url: "https://google.com"
    });

    for (let i = 0; i < 5; i++) {
        await redirectLinkService(link.code, {
            get() {
                return null;
            }
        });
    }

    const firstPage = await getLinkClicksService(
        link.code,
        null,
        2
    );

    assert.equal(firstPage.data.length, 2);

    const secondPage = await getLinkClicksService(
        link.code,
        {
            id: firstPage.next_cursor.id
        },
        2
    );

    assert.equal(secondPage.data.length, 2);

    const firstIds = firstPage.data.map(click => click.id);
    const secondIds = secondPage.data.map(click => click.id);

    for (const id of secondIds) {
        assert.equal(firstIds.includes(id), false);
    }
});


test.after(async () => {
    await db.end();
});