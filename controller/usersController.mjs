import users from "../db/users.json" assert { type: "json" };
import menu from "../db/menu.json" assert { type: "json" };
import orders from "../db/orders.json" assert { type: "json" };

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

  login: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const user = users.find(
        (user) => user.name === username || user.email === email
      );

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.password !== password) {
        res.status(401).json({ message: "Invalid password." });
        return;
      }

      req.session.userId = user.id;

      res.status(200).json({ message: "User Logged in successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while logging in." });
    }
  },
  logout: (req, res) => {
    try {
      if (!req.session.userId) {
        res.status(400).json({ message: "No active session." });
        return;
      }

      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({
            message: "An error occurred while destroying log out session",
          });
          return;
        }
      });

      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while logging out" });
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
        quantity: item.quantity,
      }));

      res.status(200).json(orderMenuItemsInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while retrieving the user orders.",
      });
    }
  },

  orderByUserIdMenuId: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Please log in." });
      }

      req.session.userId = user.id;
      const userId = Number(req.params.userId);
      const itemId = Number(req.query.itemId);
      const quantity = Number(req.query.quantity);

      const user = users.find((user) => user.id === userId);
      const item = menu.find((item) => item.id === itemId);

      if (!user || !item) {
        res.status(404).json({ message: "User or Menu item were not found." });
        return;
      }

      let maxOrderId;
      if (orders.length > 0) {
        maxOrderId = Math.max(...orders.map((order) => order.id));
      } else {
        maxOrderId = 0;
      }

      //pridedame 1 kad tureti sekanti id
      const orderToSave = {
        id: maxOrderId + 1, //  Naujo orderio id sukurimas
        customerId: userId,
        Items: [],
      };
      //pashinam ir saugome i users tik itemId o i orders info orderToSave + tai ka gauname is requesto (menuItemId ir quantity)
      orderToSave.Items.push({
        menuItemId: itemId,
        quantity: quantity,
      });

      orders.push(orderToSave);

      user.orderItems.push(orderToSave.id);

      await fs.promises.writeFile(
        path.join(__dirname, "../db/orders.json"),
        JSON.stringify(orders, null, 2)
      );

      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );

      res.status(201).json(orderToSave);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the order." });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orderId = parseInt(req.params.orderId);

      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const orderIndex = orders.findIndex((order) => order.id === orderId);
      if (orderIndex === -1) {
        res.status(404).json({ message: "Order not found." });
        return;
      }

      users[userIndex].orderItems = users[userIndex].orderItems.filter(
        (id) => id !== orderId
      );
      orders.splice(orderIndex, 1);

      await fs.promises.writeFile(
        path.join(__dirname, "../db/users.json"),
        JSON.stringify(users, null, 2)
      );

      await fs.promises.writeFile(
        path.join(__dirname, "../db/orders.json"),
        JSON.stringify(orders, null, 2)
      );

      res.status(200).json({ message: "Item successfully cancelled" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Order wasn't cancelled" });
    }
  },
};

export default userController;
