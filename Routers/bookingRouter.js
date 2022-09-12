const express=require("express");
const bookingRouter=express.Router();
const factory=require("../helper/factory");
const protectRoute=require("./authRouter");
const userModel=require("../model/userModel");
const bookingModel=require("../model/bookingModel");
const Razorpay=require("razorpay");
const {KEY_ID,KEY_SECRET}=require("../model/screte");
// const reviewModel=require("../model/reviewModel");
var razorpay=new Razorpay({
    key_id:KEY_ID,
    key_secret:KEY_SECRET,
});

const initiateBooking=async function(req,res){
try{
let booking=await bookingModel.create(req.body);
let bookingId=booking["_id"];
let userId=req.body.user;
let user=await userModel.findById(userId);
user.bookings.push(bookingId);
await user.save();

const payment_capture=1;
const amount=500;
const currency="INR";
 
const options={
    amount,
    currency,
    receipt:`rs_${bookingId}`,
    payment_capture,
};
const response=await razorpay.orders.create(options);
console.log(response);
res.status(200).json({
    id:response.id,
    currency:response.currency,
    amount:response.amount,
    booking:booking,
    message:"booking created",
})
}catch(err){
res.status(500).json({
message:err.message
});
}
}
const getbookings=factory.getElement(bookingModel);
const deletebooking=async function(req,res){
    try{
    let booking=bookingModel.findByIdAndDelete(req.body);
    console.log("booking",booking);
    let userId=await booking.user;
    let user=await userModel.findById(userId);
    let idxOfbooking =user.bookings.indexOf(booking["_id"]);
    user.booking.splice(idxOfbooking,1);
    await user.save();
    res.status(200).json({
        message:"booking deleted",
        booking:booking
    })
    }catch(err){
    res.status(500).json({
    message:err.message
    });
    }
    }
const updatebooking =factory.updateElement(bookingModel);
const getbookingById=factory.getElementById(bookingModel); 
async function verifyPayment(req,res){
    const secret=KEY_SECRET;
    console.log(req.body);
    const shasum=crypto.createHmac("sha256",secret);
    shasum.update(JSON.stringify(req.body));

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      res.status(200).json({
        message: "OK",
      });
    } else {
      res.status(403).json({ message: "Invalid" });
    }
};
bookingRouter.route("/verification").post(verifyPayment);
bookingRouter.use(protectRoute);
bookingRouter.route("/") 
// add protectRoute in that
    .get(getbookings)
    .post(initiateBooking);
    

bookingRouter.route("/:id")
    .get(getbookingById)
    .patch(updatebooking)
    .delete(deletebooking);
    
    module.exports=bookingRouter;