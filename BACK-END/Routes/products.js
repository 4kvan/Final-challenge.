import express from 'express';
import Product from '../Models/products.js';
import multer from 'multer';
import path from 'path';
import { clear } from 'console';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'tasteImages', maxCount: 20 } 
]);



router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







router.post('/', upload, async (req, res) => {
        
     const tastesData = [];
if (req.body['tastes']) {
  const tasteNames = Array.isArray(req.body['tastes']) 
    ? req.body['tastes'].map(t => JSON.parse(t).name)
    : [JSON.parse(req.body['tastes']).name];
  
  const tasteImages = req.files['tasteImages'] || [];
  
  tasteNames.forEach((name, i) => {
    tastesData.push({
      name,
      image: tasteImages[i] ? `/uploads/${tasteImages[i].filename}` : ''
    });
  });
}
    try {
        const { name, description, price, category, stock,  } = req.body;
        const product = new Product({
            name,
            description,
            price: Number(price),
            category,
            stock : Number(stock),
            image: req.files && req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '',
            video: req.files && req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : '',
            isFeatured: req.body.isFeatured === 'true',
            tastes: tastesData
        });
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        console.log('ERROR:', err.message);
        res.status(400).json({ message: err.message });
    }

    console.log('FILES:', req.files); 
    console.log('BODY:', req.body);
});


router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const uploadNote = multer({ storage }).single('image');

router.post('/:id/notes', uploadNote, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const note = {
            name: req.body.name,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        };

        product.tastes.push(note);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id/notes/:noteId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.tastes = product.tastes.filter(t => t._id.toString() !== req.params.noteId);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;