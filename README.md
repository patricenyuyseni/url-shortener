# URL Shortener API

A production-ready URL shortener service built with Node.js, Express, PostgreSQL, and Zod validation.

## Features

- Create shortened URLs
- Custom short codes
- URL expiration support
- Redirect handling with HTTP 302
- Atomic click counter updates
- Click tracking:
  - timestamp
  - referrer
  - user agent
- Click history API with cursor pagination
- CSV export for click logs
- Input validation using Zod
- SQL injection protection
- OpenAPI documentation

## Tech Stack

- Node.js
- Express
- PostgreSQL
- pg
- Zod
- Swagger UI

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd url-shortener
