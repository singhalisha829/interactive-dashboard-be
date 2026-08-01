import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    category:{type:String, required:true,enum: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty']},
    price:{type:Number, required:true},
    stock:{type:Number, required:true},
    createdAt:{type:Date, default:Date.now},
});

const Product = mongoose.model("Product",productSchema);
export default Product;