# node-express-mongoose

Simple project using node.js, express.js and mongoose

On this project, by API requests, it is possible to do a CRUD to the MongoDB database. The idea is to think you have a store, and you need to register your products .

---

# Guide

- Model folder, there is a file called `products.js`. These file is a mongoose schema used to map the fields that I want to create at MongoDB. 
- `products-batch.json`: Example of JSON file to create more than one documents on MongoDB (insertMany)
- `router.js`: All the API routes and verbs. Whole CRUD logical.
- `storeconnections.json`: my MongoDB local host connection with the database store and collection products created
