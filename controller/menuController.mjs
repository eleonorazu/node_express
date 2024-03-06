// import menu from "../db/menu.json" assert { type: "json" };

// // Darbas su file systema
// import fs from "fs";

// import path, { dirname } from "path";

// // konvertuojame failo url į failo kelia
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const menuItemController = {
//   getMenuItems: async (req, res) => {
//     try {
//       // Call the controller function to get all users
//       const menus = await getMenus();
      
//       // Send the users data as response
//       res.json(menus);
//     } catch (error) {
//       // Handle any errors that occur during the process
//       res.status(500).json({ message:"Server Error"});
//     }
//   },

//   createUser: async (req, res) => {
//     try {
//       const newUser = {
//         ...req.body,
//         orderItems: [],
//       };

//       users.push(newUser);
//       users.forEach((user, index) => {
//         user.id = index + 1;
//       });

//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/users.json"),
//         JSON.stringify(users, null, 2)
//       );

//       res.status(201).json(newUser);
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ message: "An error occurred while creating user." });
//     }
//   },
//   getUserById: (req, res) => {
//     try {
//       const id = parseInt(req.params.id);
//       const user = users.find((user) => user.id === id);

//       if (!user) {
//         res.status(404).json({ message: "User not found." });
//         return;
//       }

//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).json({
//         message: "An error occurred while retrieving the user by id.",
//       });
//     }
//   },
//   updateUser: async (req, res) => {
//     try {
//       const id = parseInt(req.params.id);
//       const updateUser = { ...req.body, id };

//       let userIndex = users.findIndex((user) => user.id === id);

//       if (userIndex === -1) {
//         res.status(404).json({ message: "User not found." });
//         return;
//       }

//       // Mums reikia išsaugoti sukurimo datos ir vartotojo rezervacijos
//       updateUser.registered_on = users[userIndex].registered_on;
//       updateUser.reservation = users[userIndex].reservation;

//       users[userIndex] = updateUser;

//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/users.json"),
//         JSON.stringify(users, null, 2)
//       );

//       res.status(200).json(updateUser);
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ message: "An error occurred while updating the user" });
//     }
//   },
//   updateUserById: async (req, res) => {
//     try {
//       const id = parseInt(req.params.id);
//       const updatedFields = req.body;

//       let userIndex = users.findIndex((user) => user.id === id);

//       if (userIndex === -1) {
//         res.status(404).json({ message: "User not found." });
//         return;
//       }

//       users[userIndex] = { ...users[userIndex], ...updatedFields };

//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/users.json"),
//         JSON.stringify(users, null, 2)
//       );

//       res.status(200).json(users[userIndex]);
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ message: "An error occurred while updating the user" });
//     }
//   },
//   deleteUser: async (req, res) => {
//     try {
//       const id = parseInt(req.params.id);

//       let userIndex = users.findIndex((user) => user.id === id);

//       if (userIndex === -1) {
//         res.status(404).json({ message: "User not found." });
//         return;
//       }

//       users.splice(userIndex, 1);

//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/users.json"),
//         JSON.stringify(users, null, 2)
//       );

//       // 204 arba 200 - mes galime manyti message
//       res.status(200).json({ message: "User successfully deleted." });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ message: "An error occurred while deleting the user." });
//     }
//   },
//   getOrders: (req, res) => {
//     try {
//       const id = parseInt(req.params.id);
//       const user = users.find((user) => user.id === id);

//       if (!user) {
//         res.status(404).json({ message: "User not found." });
//         return;
//       }

//       const reservedMenuItems = menu.filter((item) =>
//         user.reservation.includes(item.id)
//       );

//       const reservedMenuItemsInfo = reservedMenuItems.map((item) => ({
//         id: item.id,
//         name: item.name,
//         description: item.description,
//         price: item.price,
//         category: item.category,
//       }));

//       res.status(200).json(reservedMenuItemsInfo);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         message: "An error occurred while retrieving the user orders.",
//       });
//     }
//   },
//   reservationByUserIdBooksId: async (req, res) => {
//     try {
//       const userId = parseInt(req.params.userId);
//       const bookId = parseInt(req.params.bookId);

//       const user = users.find((user) => user.id === userId);
//       const book = books.find((book) => book.id === bookId);

//       if (!user || !book) {
//         res.status(404).json({ message: "User or book not found." });
//         return;
//       }

//       if (user.reservation.includes(bookId)) {
//         res
//           .status(400)
//           .json({ message: "Book is already reserved by the user." });
//         return;
//       }

//       if (book.quantity === 0 || !book.available) {
//         res.status(400).json({ message: "Book is not available" });
//         return;
//       }

//       user.reservation.push(bookId);

//       // Mano kiekis knygų turėtu sumažėti, kai vartotojas įkelia pas saves į rezervacija
//       book.quantity--;

//       if (book.quantity === 0) {
//         book.available = false;
//       }

//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/users.json"),
//         JSON.stringify(users, null, 2)
//       );

//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/books.json"),
//         JSON.stringify(books, null, 2)
//       );

//       res.status(200).json({ message: "Book successfully reserved." });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "An error occurred while creating the reservation." });
//     }
//   },
//   deleteReservation: async (req, res) => {
//     try {
//       const userId = parseInt(req.params.userId);
//       const bookId = parseInt(req.params.bookId);

//       const user = users.find((user) => user.id === userId);
//       const book = books.find((book) => book.id === bookId);

//       if (!user || !book) {
//         res.ststus(404).json({ message: "User of book is not found" });
//         return;
//       }
//       const reservationIndex = user.reservation.indexOf(bookId);
//       if (reservationIndex === -1) {
//         res.status(400).json({ message: "Book is not reserved by the user" });
//         return;
//       }
//       users.reservation.splice(reservationIndex, 1);
//       book.quantity++;
//       book.available = true;
//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/users.json"),
//         JSON.stringify(users, null, 2)
//       );
//       await fs.promises.writeFile(
//         path.join(__dirname, "../db/books.json"),
//         JSON.stringify(books, null, 2)
//       );
//       res.status(200).json({ message: "Book successfully returned" });
//     } catch (error) {
//       res.status(500).json({ message: "Reservation wasn't deleted" });
//     }
//   },
// };

// export default menuItemController;
