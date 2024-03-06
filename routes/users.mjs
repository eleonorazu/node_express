import express from 'express';
import userController from '../controller/usersController.mjs';


const router = express.Router();

// router.get('/users', (req, res) => {
//     try {
//         res.status(200).json(users)
//     } catch (error) {
//         res.status(500).json({ message: 'An error occurred while retrieving users.' })
//     }
// });

router.get('/',userController.getUsers);

router.post('/register',userController.createUser);

router.get('/:id', userController.getUserById);

router.put('/:id',userController.updateUser);

router.patch('/:id',userController.updateUserById );

router.delete('/:id',userController.deleteUser );

router.get("/:id/orders",userController.getOrders );

router.post("/:userId/orders/:menuId",userController.orderByUserIdMenuId );
router.delete("/:userId/reservations/:menuId",userController.deleteReservation);

export default router;