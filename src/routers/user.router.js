const express = require('express')
const router = express.Router();
const { insertUser, getUserByEmail,getUserById, updatePassword } = require("../model/user/User.model");
const {setPasswordResetPin,getPinByEmailPin,deletePin} = require("../model/reset-pin/ResetPin.model")
const { hashPassword,comparePassword } = require("../helpers/bcrypt.helper")
const{ createAccessJWT,createRefreshJWT}= require("../helpers/jwt.helper")
const {userAuthorization}= require("../middleware/authorization.middleware")
const {emailProcessor}= require("../helpers/email.helper")
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
     await emailProcessor({email, pin:setPin.pin, type:"request-new-password"});
       return res.json({
            status: "success",
            message:
                "If the email is exist in our database, the password reset pin will be sent shortly.",
        });
    }
    return res.json({status:"error", message:"If the email is exist into the database, the password reset pin will be send shortly"});
});

router.patch("/reset-password", async(req, res)=>{
    const { email, pin, newPassword } = req.body;
    const getPin = await getPinByEmailPin(email, pin);
    if (getPin?._id) {
        const dbDate = getPin.addedAt;
		const expiresIn = 1;

		let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

		const today = new Date();

		if (today > expDate) {
			return res.json({ status: "error", message: "Invalid or expired pin." });
		}
        // encrypt new password
		const hashedPass = await hashPassword(newPassword);

		const user = await updatePassword(email, hashedPass);
        if (user._id) {
			// send email notification
			await emailProcessor({ email, type: "update-password-success" });

			////delete pin from db
			deletePin(email, pin);

			return res.json({
				status: "success",
				message: "Your password has been updated",
			});
		}

    }
    res.json({
		status: "error",
		message: "Unable to update your password. plz try again later",
	});
});
module.exports = router;