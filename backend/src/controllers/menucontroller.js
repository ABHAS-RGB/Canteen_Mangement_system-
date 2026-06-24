const pool = require("../config/db");

const getAllMenuItems = async (req, res) => {
  try {
    const { search, category, canteen } = req.query;

    let query = "SELECT * FROM menu_items WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND name LIKE ?";
      params.push(`%${search}%`);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // NEW — filter by canteen if provided
    if (canteen) {
      query += " AND canteen = ?";
      params.push(canteen);
    }

    query += " ORDER BY id DESC";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, is_available, canteen } = req.body;
    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (!canteen || !["A-Block", "C-Block"].includes(canteen)) {
      return res.status(400).json({ message: "Valid canteen (A-Block or C-Block) is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO menu_items (name, description, price, category, is_available, canteen) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description || "", price, category || "", is_available ?? true, canteen]
    );

    return res.status(201).json({ message: "Menu item created", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, is_available, canteen } = req.body;

    if (canteen && !["A-Block", "C-Block"].includes(canteen)) {
      return res.status(400).json({ message: "Valid canteen (A-Block or C-Block) is required" });
    }

    const [result] = await pool.query(
      `UPDATE menu_items
       SET name = ?, description = ?, price = ?, category = ?, is_available = ?, canteen = ?
       WHERE id = ?`,
      [name, description || "", price, category || "", is_available ?? true, canteen || "A-Block", id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ message: "Menu item updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM menu_items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ message: "Menu item deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};