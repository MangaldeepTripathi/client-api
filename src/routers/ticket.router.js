const express= require('express')
const router= express.Router();
const {insertTicket}= require("../model/ticket/Ticket.model")

router.all("/",(req, res, next)=>{
    //res.json({message:"return from Ticket router"})
    next();
})

router.post("/",async (req, res)=>{
    try {
    const{subject, sender, message}= req.body;
    const ticketObj = {
        clientId: "63af4322a5c635f4190e8da8",
        subject,
        conversations: [
          {
            sender,
            message,
          },
        ],
      };
      const result = await insertTicket(ticketObj);
      console.log("result",result);
      if (result._id) {
        return res.json({
          status: "success",
          message: "New ticket has been created!",
        });
      }

      res.json({
        status: "error",
        message: "Unable to create the ticket , please try again later",
      });
    } catch (error) {
        res.json({ status: "error", message: error.message });
      }


})

module.exports=router;