const express = require('express');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', function (req, res){
    res.render('main');

});

module.exports = router;