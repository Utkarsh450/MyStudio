const express = require('express');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', function (req, res) {
    res.render('login');
});

router.post("/", async (req, res) => {
    let { email, password } = req.body;
    
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // set secure flag for production
    });
    res.redirect("/chat");

});

module.exports = router;
