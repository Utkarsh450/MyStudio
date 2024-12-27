const express = require('express');
const router = express.Router();
const {protect} = require("../middlewares/user");

router.get("/",protect,(req,res)=>{
    res.render('chat');
})

module.exports = router;