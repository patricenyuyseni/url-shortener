export const openapiSpecification = {
    openapi: "3.0.0",

    info: {
        title: "URL Shortener API",
        version: "1.0.0",
        description: "API documentation for URL Shortener service"
    },

    servers: [
        {
            url: "http://localhost:3000"
        }
    ],

    paths: {
        "/links": {
            post: {
                summary: "Create a short link",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    target_url: {
                                        type: "string",
                                        example: "https://google.com"
                                    },
                                    code: {
                                        type: "string",
                                        example: "google"
                                    },
                                    expires_at: {
                                        type: "string",
                                        format: "date-time"
                                    }
                                },
                                required: [
                                    "target_url"
                                ]
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Link created"
                    },
                    400: {
                        description: "Validation error"
                    }
                }
            }
        },

        "/{code}": {
            get: {
                summary: "Redirect to original URL",
                parameters: [
                    {
                        name: "code",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    }
                ],
                responses: {
                    302: {
                        description: "Redirect"
                    },
                    404: {
                        description: "Not found"
                    },
                    410: {
                        description: "Expired"
                    }
                }
            }
        }
    }
};
