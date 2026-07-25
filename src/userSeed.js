import User from "./models/User.js";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";

const userRegister = async () => {
  await connectDB();
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const user = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    await user.save();
    console.log("Admin user created successfully");
  } catch (err) {
    console.log(err);
  }
};

userRegister();
