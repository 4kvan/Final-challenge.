import express from 'express';
import Order from '../Models/orders.js';
import jwt from 'jsonwebtoken';
import Product from '../Models/products.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email phone')
            .populate('products.product', 'name price image');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/myorders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const orders = await Order.find({ user: decoded._id })
            .populate('products.product', 'name price image');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        console.log('PUT body:', req.body);  
        const order = await Order.findById(req.params.id)
            .populate('products.product');
        
         

        if (req.body.isDelivered && !order.isDelivered) {
            console.log('reducing stock...');  
            for (const item of order.products) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.log('ERROR:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const order = new Order({
            user: decoded._id,
            products: req.body.products,
            totalPrice: req.body.totalPrice
        });

        const saved = await order.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;