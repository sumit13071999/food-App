
const jwt=require("jsonwebtoken");
const {JWT_Key}=require("../model/screte");
function protectRoute(req, res, next){
try {
  console.log(req.cookies.jwt);
if(req.cookies.jwt){
  let decryptedToken=jwt.verify(req.cookies.jwt,JWT_Key);
  if(decryptedToken){
    req.uid=decryptedToken.id;
  next();
  }else{
    res.status(500).json({
      message:"your cookies is change please login again"
    })
  }
}else{
   res.status(401).json({
    Message:"you are not allowed"
   })
}
}catch(err){
res.status(500).json({
error:err.message,
"message": "can't get user"
})
}
}
module.exports=protectRoute;

