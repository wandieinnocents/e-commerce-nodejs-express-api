const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userSchema = require("./models/User");
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


