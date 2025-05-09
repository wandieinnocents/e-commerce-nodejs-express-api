const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// schema
const userSchema = require("./models/User");
const productSchema = require("./models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


dotenv.config();

const app = express();
// middleware 
app.use(express.json());

const port = process.env.PORT;

// server creation
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// mongodb database connection
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", () => {
    console.log("Connected to MongoDB");
});

console.log(userSchema);

//api routes
//-------------- authentication --------------
//register endpoint
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required"
            });
        }
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                message: "User already exists"
            });
        }

        const newUser = await userSchema.create({
            username,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        });

        //result after registration
        res.status(201).json({
            newUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }

});


// login endpoint
const secret = process.env.TOKEN_SECRET;
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userSchema.findOne({ email });

        if (user) {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }
            const token = jwt.sign(
                // payload
                {
                    email: user.email,
                    username: user.username,
                }, secret, {}
            );

            // cookie creation
            res.cookie("token", token).json(user);

            res.status(200).json({
                token,
                user
            });


        } else {
            return res.status(401).json({
                message: "User not found"
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});

//logout endpoint
app.post("/logout", (req, res) => {
    res.cookie("token", "").json({
        message: "User Logged out successful"
    });
});


//-------------- products --------------
// create product
app.post("/products", async (req, res) => {
    const { title, description, category, img, quantity, price } = req.body;

    try {

        if (!title || !description || !category || !img || !quantity || !price) {
            return res.status(401).json({
                message: "All fields are required"
            });
        }
        const existingProduct = await productSchema.findOne({ title });
        if (existingProduct) {
            return res.status(401).json({
                message: "Product already exists"
            });
        }

        const newProduct = await productSchema.create({
            title, description, category, img, quantity, price
        });

        //result after product creation
        return res.status(201).json({
            newProduct
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});

// get all products
app.get("/products", async (req, res) => {
    try {
        const products = await productSchema.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});
// get single product
app.get("/products/:id", async (req, res) => {
    //get product parameters  from url
    const { id } = req.params;
    try {
        const product = await productSchema.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}
);

// update product
app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, category, img, quantity, price } = req.body;
    try {
        const product = await productSchema.findByIdAndUpdate(id, {
            title, description, category, img, quantity, price
        }, { new: true });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});
// delete product
app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productSchema.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});
// get products by category
app.get("/products/category/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await productSchema.find({ category });
        if (!products) {
            return res.status(404).json({
                message: "Products not found"
            });
        }
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}
);





