const express= require('express')
const router= express.Router();

router.all("/",(req, res, next)=>{
    res.json({message:"return from Ticket router"})
})
module.exports=router;