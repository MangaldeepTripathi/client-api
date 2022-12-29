const express = require('express')
const router = express.Router();
const { insertUser } = require("../model/user/User.model");
const { hashPassword } = require("../helpers/bcrypt.helper")
router.all("/", (req, res, next) => {
    // console.log(name)
    //res.json({message:"return from user router"})
    next();
});

router.post("/", async (req, res) => {
    const { name, company, address, phone, email, password } = req.body;
    try {
        //Hash Password
        const hashedPass = await hashPassword(password)
        const newUserObj = {
            name,
            company,
            address,
            phone,
            email,
            password: hashedPass
        }
        const result = await insertUser(newUserObj);
        console.log(req.body);
        res.json({ message: "User created successfully", result });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }

})
module.exports = router;