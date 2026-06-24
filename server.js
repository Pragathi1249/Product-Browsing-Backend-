const express = require("express");
const pool = require("./db");

const app = express();

app.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const cursorId = req.query.cursorId;

    let query = `
      SELECT *
      FROM products
      WHERE 1=1
    `;

    const values = [];
    let idx = 1;

    // Category filter
    if (category) {
      query += ` AND category = $${idx}`;
      values.push(category);
      idx++;
    }

    // Cursor pagination
    if (cursorId) {
      query += ` AND id < $${idx}`;
      values.push(parseInt(cursorId));
      idx++;
    }

    query += `
      ORDER BY id DESC
      LIMIT $${idx}
    `;

    values.push(limit);

    console.log("QUERY:");
    console.log(query);

    console.log("VALUES:");
    console.log(values);

    const result = await pool.query(query, values);

    const products = result.rows;

    let nextCursor = null;

    if (products.length > 0) {
      nextCursor = products[products.length - 1].id;
    }

    res.json({
      products,
      nextCursor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});