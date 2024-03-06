import express from 'express';
import userRouter from './routes/users.mjs';
import menuRouter from './routes/menu.mjs';

// Create an Express application
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Use routers
app.use('/api/v1/library/users', userRouter);
app.use('/api/v1/library/menu', menuRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
