import express from 'express';
import Settings from '../Models/settings.js';
import User from '../Models/user.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/password', async (req, res) => {
    try {
        console.log('req.body:', req.body); 
        const { userId, oldPassword, newPassword } = req.body;
        console.log('userId:', userId);
        const user = await User.findById(userId);
        console.log('user:', user); 

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.password !== oldPassword) {
            return res.status(401).json({ success: false, message: 'Wrong current password' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        
        Object.assign(settings, req.body);
        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




export default router;