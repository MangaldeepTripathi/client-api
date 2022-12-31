const express = require('express')
const router = express.Router();
const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword,comparePassword } = require("../helpers/bcrypt.helper")
const{ createAccessJWT,createRefreshJWT}= require("../helpers/jwt.helper")
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

// Create sign in user route

router.post("/login", async (req, res) => {
    console.log(req.body);
    const {email, password}= req.body;
    if (!email || !password) {
		return res.json({ status: "error", message: "Invalid form submition!" });
	}
    const user = await getUserByEmail(email);
    const passFromDb = user && user._id ? user.password : null;

	if (!passFromDb)
		return res.json({ status: "error", message: "Invalid email or password!" });

    const result = await comparePassword(password, passFromDb);
    if (!result) {
		return res.json({ status: "error", message: "Invalid email or password!" });
	}
    const accessJWT= await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT= await createRefreshJWT(user.email, `${user._id}`);

    res.json({
        status:"success",
        message:"User loggedin successfully",
        accessJWT,
        refreshJWT
    }) 
})
module.exports = router;