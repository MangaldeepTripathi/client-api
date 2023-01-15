const {verifyAccessJWT}= require("../helpers/jwt.helper")
const {getJWT, deleteJWT}= require("../helpers/redis.helper")

   //res.json(authorization);
    //1- Verify if JWT is valid
    //2- Check if JWT is exist in redis
    //3- Extract user id
    //4- Get user profile based on the user profile
const userAuthorization= async (req, res, next)=>{
    const {authorization}= req.headers;
   // console.log("authorization",authorization);
 
    const decoded= await verifyAccessJWT(authorization);
    const userId= await getJWT(authorization);
    //console.log("userId...",userId)
    //console.log(decoded);
   // console.log(decoded.email);
    if(decoded.email){
        const userId= await getJWT(authorization);
        console.log("userId...",userId)
        if(!userId){
          return  res.status(403).json({message:"forbidden"});
        }
       req.userId= userId;
      return next();
    }
    deleteJWT(authorization);
    res.status(403).json({message:"forbidden"});
    //next();
}

module.exports={
    userAuthorization,
}