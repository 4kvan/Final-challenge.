import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    storeName: { type: String, default: 'Maison 2MD' },
    email: { type: String, default: '2md@luxury.com' },
    phone: { type: String, default: 'xxx-xxx-xx4' },
    address: { type: String, default: 'Algeria, Algiers' },
    freeShippingThreshold: { type: Number, default: 350 },
    maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);