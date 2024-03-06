
import users from "../db/users.json" assert { type: "json" };
import menu from "../db/menu.json" assert { type: "json" };

// Darbas su file systema
import fs from "fs";

import path, { dirname } from "path";

// konvertuojame failo url į failo kelia
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const userController = {
  getUsers: (req, res) => {
    try {
      if (req.query.paginate === "true") {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;

        // start - (page - 1) * limit = 0 - (1 - 1) * 3 = 0
        const start = (page - 1) * limit;
        const end = page * limit;

        const paginatedUser = users.slice(start, end);

        res.status(200).json(paginatedUser);
      } else {
        res.status(200).json(users);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while retrieving users." });
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = {
        ...req.body,
        orderItems: [],
      };

      users.push(newUser);
      users.forEach((user, index) => {
        user.id = index + 1;
      });

      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating user." });
    }
  },
  getUserById: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = users.find((user) => user.id === id);

      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while retrieving the user by id.",
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateUser = { ...req.body, id };

      let userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      // Mums reikia išsaugoti sukurimo datos ir vartotojo rezervacijos
      updateUser.orderItems = users[userIndex].orderItems;

      users[userIndex] = updateUser;

      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );

      res.status(200).json(updateUser);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the user" });
    }
  },
  updateUserById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedFields = req.body;

      let userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      users[userIndex] = { ...users[userIndex], ...updatedFields };

      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );

      res.status(200).json(users[userIndex]);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the user" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      let userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      users.splice(userIndex, 1);

      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );

      // 204 arba 200 - mes galime manyti message
      res.status(200).json({ message: "User successfully deleted." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the user." });
    }
  },
  getOrders: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = users.find((user) => user.id === id);

      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const orderMenuItems = menu.filter((item) =>
        user.orderItems.includes(item.id)
      );

      const orderMenuItemsInfo = orderMenuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        quantity:item.quantity
      }));

      res.status(200).json(orderMenuItemsInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while retrieving the user orders.",
      });
    }
  },
  // check those 2 below!!
  orderByUserIdMenuId: async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const itemId = parseInt(req.params.itemId);

        // Find user and menu
        const user = users.find((user) => user.id === userId);
        const item = menu.find((item) => item.id === itemId);

        // If user or menu not found, return 404
        if (!user || !item) {
            res.status(404).json({ message: "User or menu item not found." });
            return;
        }

        // Push new menu item to orderItems with count 1
        user.orderItems.push(itemId);

        // Update menu quantity
        menu.quantity--;

        // If menu quantity becomes 0, update status
        if (menu.quantity === 0) {
            res.status(200).json({ message: "Out of stock. Please contact the supplier to restock item." });
            return;
        }

        // Write updated data to files
        await fs.promises.writeFile(
            path.join(__dirname, "../db/users.json"),
            JSON.stringify(users, null, 2)
        );

        await fs.promises.writeFile(
            path.join(__dirname, "../db/menu.json"),
            JSON.stringify(menu, null, 2)
        );

        res.status(200).json({ message: "Item successfully added to the order." });
    } catch (error) {
        console.error("Error creating order:", error); // Log the error for debugging
        res.status(500).json({ message: "An error occurred while creating the order." });
    }
},
  deleteOrder: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const itemId = parseInt(req.params.itemId);

      const user = users.find((user) => user.id === userId);
      const item = menu.find((item) => item.id === itemId);

      if (!user || !item) {
        res.status(404).json({ message: "User or menu item is not found" });
        return;
      }
      const orderIndex = user.orderItems.indexOf(itemId);
      if (orderIndex === -1) {
        res.status(400).json({ message: "Item is not reserved by the user" });
        return;
      }
      users.orderItems.splice(orderIndex, 1);
      menu.quantity++;
      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );
      await fs.promises.writeFile(
        path.join(__dirname, "../db/books.json"),
        JSON.stringify(menu, null, 2)
      );
      res.status(200).json({ message: "Item successfully cancelled" });
    } catch (error) {
      res.status(500).json({ message: "Order wasn't cancelled" });
    }
  },
};

export default userController;
