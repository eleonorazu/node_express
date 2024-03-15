import menu from "../db/menu.json" assert { type: "json" };

// Darbas su file systema
import fs from "fs";

import path, { dirname } from "path";

// konvertuojame failo url į failo kelia
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const menuController = {
  getMenu: (req, res) => {
    try {
      if (req.query.paginate === "true") {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;

        // start - (page - 1) * limit = 0 - (1 - 1) * 3 = 0
        const start = (page - 1) * limit;
        const end = page * limit;

        const paginatedMenu = menu.slice(start, end);

        res.status(200).json(paginatedMenu);
      } else {
        res.status(200).json(menu);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while retrieving menu items." });
    }
  },

  createMenu: async (req, res) => {
    try {
      const newMenu = {
        ...req.body,
      };

      menu.push(newMenu);
      menu.forEach((menu, index) => {
        menu.id = index + 1;
      });

      await fs.promises.writeFile(
        path.join(__dirname, "../db/menu.json"),
        JSON.stringify(menu, null, 2)
      );

      res.status(201).json(newMenu);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating Item." });
    }
  },
  getMenuById: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = menu.find((item) => item.id === id);

      if (!item) {
        res.status(404).json({ message: "Item not found." });
        return;
      }

      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving the item by id.",
      });
    }
  },
  updateMenu: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateMenu = { ...req.body, id };

      let itemIndex = menu.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        res.status(404).json({ message: "Item not found." });
        return;
      }
      menu[itemIndex] = updateMenu;
      await fs.promises.writeFile(
        path.join(__dirname, "../db/menu.json"),
        JSON.stringify(menu, null, 2)
      );

      res.status(200).json(updateMenu);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the item" });
    }
  },
  updateMenuById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedFields = req.body;

      let itemIndex = menu.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        res.status(404).json({ message: "item not found." });
        return;
      }

      menu[itemIndex] = { ...menu[itemIndex], ...updatedFields };

      await fs.promises.writeFile(
        path.join(__dirname1, "../db/menu.json"),
        JSON.stringify(menu, null, 2)
      );

      res.status(200).json(menu[itemIndex]);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the item" });
    }
  },
  deleteMenu: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      let itemIndex = menu.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        res.status(404).json({ message: "Item not found." });
        return;
      }

      menu.splice(itemIndex, 1);

      await fs.promises.writeFile(
        path.join(__dirname, "../db/menu.json"),
        JSON.stringify(menu, null, 2)
      );

      // 204 arba 200 - mes galime manyti message
      res.status(200).json({ message: "Item successfully deleted." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the user." });
    }
  },
};

export default menuController;
