const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
    return res.status(401).json({ message: "All fields are required" });
    }
    try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).json({ message: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ newUser });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const secret = process.env.TOKEN_SECRET;
    try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid Password" });

    const token = jwt.sign({ email: user.email, username: user.username }, secret, {});
    res.status(200).json({ token, user });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

const logout = (req, res) => {
    res.cookie("token", "").json({ message: "User Logged out successfully" });
};

module.exports = { register, login, logout };
