const pool = require("../config/db");

const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM menu_items ORDER BY id DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, is_available } = req.body;
    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO menu_items (name, description, price, category, is_available) VALUES (?, ?, ?, ?, ?)",
      [name, description || "", price, category || "", is_available ?? true]
    );

    return res.status(201).json({ message: "Menu item created", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, is_available } = req.body;

    const [result] = await pool.query(
      `UPDATE menu_items
       SET name = ?, description = ?, price = ?, category = ?, is_available = ?
       WHERE id = ?`,
      [name, description || "", price, category || "", is_available ?? true, id]
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
