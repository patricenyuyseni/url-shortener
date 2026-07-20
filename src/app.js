import express from "express";
import swaggerUi from "swagger-ui-express";

import linksRoutes from "./routes/links.routes.js";
import { redirectLink } from "./controllers/redirect.controller.js";
import { openapiSpecification } from "./docs/openapi.js";


const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "URL Shortener API is running"
    });
});


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});


app.get("/openapi.json", (req, res) => {
    res.json(openapiSpecification);
});


app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
);


app.use("/links", linksRoutes);


app.get("/:code", redirectLink);

app.get("/:code", redirectLink);

export default app;