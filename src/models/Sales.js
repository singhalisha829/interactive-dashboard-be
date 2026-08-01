import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  productId: {type: String, required: true},
  quantity: { type: Number, required: true },
  region: { 
    type: String, 
    required: true, 
    enum: ['North America', 'Europe', 'Asia Pacific', 'Latin America'] 
  },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['Credit Card', 'PayPal', 'UPI', 'Crypto'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Completed', 'Pending', 'Refunded'] 
  },
  createdAt: { type: Date, required: true }
});

const Sales = mongoose.model('Sales', salesSchema);
export default Sales;