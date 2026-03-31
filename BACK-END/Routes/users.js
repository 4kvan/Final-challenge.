import express from 'express';
import User from '../Models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.password !== password) return res.status(401).json({ message: 'Wrong password' });

        
        const token = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token   
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

router.post('/register', async (req, res) => {
    try {

        console.log('req.body:', req.body);
       const { name, email, password, phone } = req.body;
       
        

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const user = await User.create({ name, email, password, phone });

        const token = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;