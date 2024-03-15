import express from "express";
import menuController from "../controller/menuController.mjs";

const router = express.Router();

router.get("/", menuController.getMenu);

router.post("/add", menuController.createMenu);

router.get("/:id", menuController.getMenuById);

router.put("/:id", menuController.updateMenu);

router.patch("/:id", menuController.updateMenuById);

router.delete("/:id", menuController.deleteMenu);

export default router;
