const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
app.use(express.json());
const secrectKey = "secrectKey";
const users = [];
const products = [];
app.get("/api", (req, res) => {
  console.log("server running");
});
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 3);
    console.log(hashedPassword);
    const user = { username, password: hashedPassword };
    console.log(users);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});
app.post("/login", (req, res) => {
  const user = {
    id: 12,
    username: "pallavi",
    email: "pallavi@yopmail.com",
  };
  jwt.sign({ user }, secrectKey, { expiresIn: "300s" }, (err, token) => {
    console.log(token);
    res.json({ token });
  });
});
app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secrectKey, (err, authData) => {
    if (err) {
      res.json({
        result: "Invalid Token",
      });
    } else {
      res.json({
        message: "Profile access data",
        authData,
      });
    }
  });
});
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    console.log("bearerHeader", bearer);
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      result: "token is not valid",
    });
  }
}

app.post("/createProduct", verifyToken, (req, res) => {
  const product = req.body;
  products.push(product);
  res.status(201).json({ message: "Product created successfully" });
});
app.get("/products", verifyToken, (req, res) => {
  res.json(products);
});

app.put("/product/:id", verifyToken, (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = { ...products[index], ...updatedProduct };
  res.json({ message: "Product updated successfully" });
});

app.delete("/productUpdate/:id", verifyToken, (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});
app.listen(3000, () => {
  console.log("app is running on 3000");
});
