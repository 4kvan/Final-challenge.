import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './DB.js';
import productRoutes from './Routes/products.js';
import userRoutes from './Routes/users.js';
import orderRoutes from './Routes/orders.js';
import settingsRoutes from './Routes/settings.js';


dotenv.config();

const app = express();

connectDB();

app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE','UPDATE'],
    credentials: true
  }
));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }  // ← add this
}));
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.get("/", (req, res) => {
  res.send("Welcome to the API");
});


app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
