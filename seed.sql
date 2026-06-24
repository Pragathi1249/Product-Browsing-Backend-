-- OPTIONAL: clean table before inserting
TRUNCATE TABLE products RESTART IDENTITY;

-- Insert 200,000 products efficiently
INSERT INTO products (
    name,
    category,
    price,
    created_at,
    updated_at
)
SELECT
    'Product ' || gs AS name,

    CASE
        WHEN r < 0.33 THEN 'Electronics'
        WHEN r < 0.66 THEN 'Fashion'
        ELSE 'Books'
    END AS category,

    ROUND((random() * 10000)::numeric, 2) AS price,

    -- ensures stable ordering + realistic variation
    NOW() - (INTERVAL '1 second' * gs) - (random() * INTERVAL '10 days') AS created_at,

    NOW() - (INTERVAL '1 second' * gs) - (random() * INTERVAL '10 days') AS updated_at

FROM (
    SELECT
        gs,
        random() AS r
    FROM generate_series(1, 200000) gs
) sub;