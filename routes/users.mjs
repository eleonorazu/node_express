import express from "express";

import userController from "../controller/usersController.mjs";
import { validate } from "../middleware/userValidationScheme.mjs";
import { userValidationSchema, validateUserId } from "../Validators/userValidator.mjs";

const router = express.Router();
router.get("/", userController.getUsers);

router.post(
  "/register",
  validate(userValidationSchema, validateUserId),
  userController.createUser
);
router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.patch("/:id", userController.updateUserById);

router.delete("/:id", userController.deleteUser);

router.get("/:id/orders", userController.getOrders);

router.post("/:userId/orders", userController.orderByUserIdMenuId);
router.delete("/:userId/orders/:orderId", userController.deleteOrder);

export default router;
