const express=require("express");
const bookingRouter=express.Router();
const factory=require("../helper/factory");
const protectRoute=require("./authRouter");
const userModel=require("../model/userModel");
const bookingModel=require("../model/bookingModel");
// const reviewModel=require("../model/reviewModel");


const initiateBooking=async function(req,res){
try{
let booking=await bookingModel.create(req.body);
let bookingId=booking["_id"];
let userId=req.body.user;
let user=await userModel.findById(userId);
user.bookings.push(bookingId);
await user.save();
res.status(200).json({
    message:"booking created",
    booking:booking
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