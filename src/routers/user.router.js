const express = require('express')
const router = express.Router();
const { insertUser, getUserByEmail,getUserById } = require("../model/user/User.model");
const {setPasswordResetPin} = require("../model/reset-pin/ResetPin.model")
const { hashPassword,comparePassword } = require("../helpers/bcrypt.helper")
const{ createAccessJWT,createRefreshJWT}= require("../helpers/jwt.helper")
const {userAuthorization}= require("../middleware/authorization.middleware")

router.all("/", (req, res, next) => {
    // console.log(name)
    //res.json({message:"return from user router"})
    next();
});

//Get user profile
router.get("/", userAuthorization, async(req, res)=> {
    const _id= req.userId;
    const userProf= await getUserById(_id);
    res.json({user:userProf});
})

//create a new user
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

router.post("/reset-password", async(req, res)=>{
    const {email}= req.body;
    const user= await getUserByEmail(email)
    if(user && user.id){
     const setPin= await setPasswordResetPin(email)
    return res.json(setPin)
    }
    return res.json({status:"error", message:"If the email is exist into the database, the password reset pin will be send shortly"});
});
module.exports = router;