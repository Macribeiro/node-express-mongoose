const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bodyParser = require("body-parser");
const productSchema = require("./model/products.js");

app.use(bodyParser.json());

const mongoURI = process.env.MONGOURI;
const productModel = mongoose.model("Product", productSchema);

mongoose.connect(mongoURI, {}).then(console.log("Connected!"));

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.post("/product", async (req, res) => {
  try {
    const newProduct = new productModel(req.body);

    const validationErrors = newProduct.validateSync();
    if (validationErrors) {
      const errors = Object.values(validationErrors.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ error: "Validation errors:", errors });
    }

    await newProduct.save();

    res.status(201).json(newProduct);
    console.log(JSON.stringify(newProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating product" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const data = req.body;

    for (const newData of data) {
      await productModel.create(newData);
    }

    res.status(201).send({ message: "New Products Created", data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing JSON objects");
  }
});

app.get("/products", (req, res) => {
  productModel
    .find()
    .then((products) => {
      res.json(products);
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
      res.json(products);
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
