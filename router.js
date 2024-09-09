const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bodyParser = require("body-parser");
const productSchema = require("./model/products.js");

app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/store")
  .then(console.log("Connected!"));

const mongoURI = process.env.MONGOURI;
const productModel = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.post("/product", async (req, res) => {
  try {
    const newProduct = new productModel(req.body);

    // **Validation Check (Optional):**
    const validationErrors = newProduct.validateSync();
    if (validationErrors) {
      const errors = Object.values(validationErrors.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ error: "Validation errors:", errors });
    }

    await newProduct.save();

    // Send a 201 Created status code upon successful creation
    res.status(201).json(newProduct);
    console.log(JSON.stringify(newProduct)); // Log the created product
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating product" });
  }
});

app.get("/products", (req, res) => {
  productModel
    .find()
    .then((products) => {
      res.json(products); // Send the retrieved documents as a JSON response
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      res.status(500).send("Error fetching products");
    });
});

app.delete("/product/:_id", (req, res) => {
  productModel
    .deleteOne({ _id: req.params._id })
    .then((products) => {
      res.json(products); // Send the retrieved documents as a JSON response
    })
    .catch((err) => {
      console.error("Error deleting products:", err);
      res.status(500).send("Error deleting products");
    });
});

app.put("/product/:_id", (req, res) => {
  productModel
    .findOneAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        updateDate: new Date().toISOString(),
      },
      { new: true }
    )
    .then((productName) => {
      res.json(productName);
    })
    .catch((err) => {
      res.status(500).send("Error updating product name", err);
    });
  console.log(req.body.name);
});

app.listen(3000);