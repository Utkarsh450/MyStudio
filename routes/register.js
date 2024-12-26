const express = require('express');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', async (req, res) => {
    let { name, email, password } = req.body;

    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists, you must login first" });
    }

    // Hash the password before saving
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    // Create a new user and save it
    let newUser = new userModel({
        name,
        email,
        password: hash
    });

    await newUser.save();

    // Generate JWT token for the new user
    let token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in a cookie and respond with a success message
    res.cookie('token', token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // set secure flag for production
    });

res.redirect("/chat")});

module.exports = router;
