const userModel=require("../model/useModel")
const express=require('express');
const jwt=require("jsonwebtoken");
const authRouter = express.Router();
const {JWT_Key}=require("../model/screte");
let emailSender=require("../helper/emailSender");
async function signUpUser(req, res) {
    try{
        let userObj = req.body;
        console.log("userObj",userObj);
        let user=await userModel.create(userObj);
        console.log(user);
        // user.push({
        //     email, name, password,createAt
        // })
        console.log(user);
        res.status(200).json({
            message: "user created",
            createUser: req.body
        })
    } catch(err){
        res.status(500).json({
            message: err.message
        })
    }
    
}
async function loginUser(req, res) {
// email,password ->useModel
try{
    if(req.body.email){
let user= await userModel.findOne({email: req.body.email});
 if(user.email==req.body.email && user.password==req.body.password){
    let payload=user["_id"];
    let token = jwt.sign({ id: payload },JWT_Key); 
    res.cookie("jwt", token ,{httpOnly:true});
    res.status(200).json({
        user,
        "message":"user logged in"
    })
 }else{
    res.status(401).json({
        "message":"email or password is wrong"
    })
 }

    }else{
     return res.status(403).json({
        message:"email is not present"
     }) 
    }

} catch(err){
    res.status(500).json({
        message: err.message
    })
}

}
function setCreatedAt(req, res, next) {
    let body=req.body;
    let length=Object.keys(body).length;
    if(length==0){
        return res.status(400).json({
            message:"can't create user when body i empty"
        })
    }
    req.body.createAt = new Date().toISOString();
    next();
}
async function forgetPassword(req,res){
    let email=req.body.email;
    let seq=(Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    try{
    
      if(email){ 
        console.log(email);
     await userModel.updateOne({ email },{ token :seq});
     let user = await userModel.findOne({email});
     await emailSender(seq);
     console.log(user);

       if(user?.token){
       return res.status(200).json( {
         message:"Email send with token"+seq
       });
    }else{
        return res.status(404).json({
            message:"user not found"
        })
    }
}else{
    res.status(404).json({
        message:"please enter email"
    })
}
} catch(err){
 res.status(500).json({
    message:err.message
 })
}
}

async function resetPassword(req , res){
    let {token,password,confirmPassword}=req.body;
    try{
        if(token){
            // findOne
            let user = await userModel.findOne({token});
            if(user){
            user.resetHandler(password,confirmPassword);
            await user.save();
            res.status(200).json({
                message: "user password changed"
            })
             }else{
                return res.status(404).json({
                    message:"user not found "
                })
             }
        }else{
            return res.status(404).json({
                message:"incorrect token "
            })
        }
    } catch(err){
        res.status(500).json({
            message:err.message
         })
    }
}
    
authRouter
    .post("/signup", setCreatedAt, signUpUser)
    .post("/login", loginUser)
    .post("/forgetPassword",forgetPassword)
    .post("/resetPassword",resetPassword);
module.exports=authRouter;