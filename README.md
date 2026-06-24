# Product Browsing Backend

A backend service built with Node.js, Express, PostgreSQL (Supabase) that allows users to browse a large dataset of products efficiently.

## Features

- Browse ~200,000 products
- View newest products first
- Filter products by category
- Fast cursor-based pagination
- PostgreSQL database hosted on Supabase
- REST API endpoints

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Supabase

## Database Schema

Products table:

| Column | Type |
|----------|----------|
| id | BIGSERIAL PRIMARY KEY |
| name | TEXT |
| category | TEXT |
| price | NUMERIC |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Indexes used:

```sql
CREATE INDEX IF NOT EXISTS idx_products_updated_id
ON products(updated_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_products_category_updated_id
ON products(category, updated_at DESC, id DESC);
```

## Generating Test Data

The database is populated with 200,000 products using PostgreSQL's `generate_series()`.

```sql
INSERT INTO products (name, category, price, created_at, updated_at)
SELECT
  'Product ' || gs,
  (ARRAY['Electronics','Clothing','Books','Home'])[floor(random()*4)+1],
  round((random()*1000)::numeric, 2),
  now(),
  now()
FROM generate_series(1, 200000) gs;
```

## API Endpoints

### Get Products

```http
GET /products
```

Example:

```http
http://localhost:5000/products?limit=20
```

### Filter by Category

```http
GET /products?category=Electronics&limit=20
```

### Pagination

First request:

```http
GET /products?limit=20
```

Response:

```json
{
  "products": [...],
  "nextCursor": "399981"
}
```

Next page:

```http
GET /products?limit=20&cursorId=399981
```

## Running Locally

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_supabase_connection_string
```

### Start Server

```bash
node server.js
```

Server runs on:

```text
http://localhost:5000
```

## Project Structure

```text
project/
│
├── server.js
├── db.js
├── schema.sql
├── seed.sql
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Design Decisions

- Cursor-based pagination was chosen instead of OFFSET pagination because it performs better on large datasets.
- PostgreSQL indexes were added to support efficient sorting and filtering.
- Data generation is done directly inside PostgreSQL using `generate_series()` for better performance.

## Improvements With More Time

- Add authentication
- Deploy frontend UI
- Add API documentation using Swagger
- Add automated tests
- Add caching for frequently accessed queries

## AI Usage

AI tools (ChatGPT) were used to:
- Understand cursor-based pagination
- Review SQL queries
- Improve backend implementation

All code was tested and understood before submission.
