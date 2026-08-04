export const openapiSpecification = {
    openapi: "3.0.0",

    info: {
        title: "URL Shortener API",
        version: "1.0.0",
        description: "API documentation for URL Shortener service"
    },

    servers: [
        {
            url: "https://url-shortener-1-o521.onrender.com",
            description: "Production server"
        },
        {
            url: "http://localhost:3000",
            description: "Local development server"
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
                        description: "Link created successfully"
                    },
                    400: {
                        description: "Validation error"
                    },
                    409: {
                        description: "Code already exists"
                    },
                    500: {
                        description: "Internal server error"
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
                            type: "string",
                            example: "google"
                        }
                    }
                ],

                responses: {
                    302: {
                        description: "Redirect"
                    },
                    404: {
                        description: "Link not found"
                    },
                    410: {
                        description: "Link expired"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            }
        },

        "/links/{code}/clicks": {
            get: {
                summary: "Get link click history",

                parameters: [
                    {
                        name: "code",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer"
                        }
                    },
                    {
                        name: "after_clicked_at",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            format: "date-time"
                        }
                    },
                    {
                        name: "after_id",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer"
                        }
                    }
                ],

                responses: {
                    200: {
                        description: "Clicks returned"
                    },
                    404: {
                        description: "Link not found"
                    },
                    400: {
                        description: "Validation error"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            }
        },

        "/links/{code}/clicks.csv": {
            get: {
                summary: "Export clicks as CSV",

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
                    200: {
                        description: "CSV file returned"
                    },
                    404: {
                        description: "Link not found"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            }
        },

        "/links/{code}": {
            get: {
                summary: "Get link metadata",

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
                    200: {
                        description: "Link metadata returned"
                    },
                    404: {
                        description: "Link not found"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            },

            delete: {
                summary: "Delete a link",

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
                    204: {
                        description: "Link deleted successfully"
                    },
                    404: {
                        description: "Link not found"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            }
        }
    }
};