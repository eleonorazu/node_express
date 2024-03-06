import express from 'express';
import menu from '../db/menu.json' assert { type: "json" };

const router = express.Router();

router.get('/', (req, res) => {
  res.json(menu);
});

export default router;