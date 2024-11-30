require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const productJson = require("./products.json");

const start = async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(productJson);
    console.log("connect");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
