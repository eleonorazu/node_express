import express from 'express';
import userRouter from './routes/users.mjs';
import menuRouter from './routes/menu.mjs';
import session from './middleware/session.mjs'
import cookies from './middleware/cookies.mjs'

// Create an Express application
const app = express();
app.use(session)
app.use(cookies)
const PORT = 3000;

// Middleware
app.use(express.json());

// Use routers
app.use('/api/v1/restaurant/users', userRouter);
app.use('/api/v1/restaurant/menu', menuRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
