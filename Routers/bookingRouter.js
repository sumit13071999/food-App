const express=require("express");
const bookingRouter=express.Router();
const factory=require("../helper/factory");
const protectRoute=require("./authRouter");
const planModel=require("../model/planModel");
const bookingModel=require("../model/bookingModel");


const createbooking=async function(req,res){
try{
let booking=bookingModel.create(req.body);
console.log("booking",booking);
let PlanId=await booking.plan;
let plan=await planModel.findById(PlanId);
plan.bookings.push(booking["_id"]);
if(plan.averageRating){
let sum=plan.averageRating*plan.bookings.length;
let finalAvgRating=(sum+booking.rating)/(plan.booking.length+1);
plan.averageRating=finalAvgRating;
}else{
    plan.averageRating=booking.rating;
}
await plan.save();
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
    let PlanId=await booking.plan;
    let plan=await planModel.findById(PlanId);
    let idxOfbooking =plan.bookings.indexOf(booking["_id"]);
    plan.booking.splice(idxOfbooking,1);
    await plan.save();
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
    .post(createbooking);
    

bookingRouter.route("/:id")
    .get(getbookingById)
    .patch(updatebooking)
    .delete(deletebooking);
    bookingRouter.route("/top3plans").get(Top3Plans);
    async function Top3Plans(){
        // booking model -> get me first three plan in decreaseing order of rating
         try{
            //find Empty ->full model search and you will get all the enteries
            const bookings=await bookingModel.find().limit(3).sort({
                rating: -1
            });
            res.status().json({
                bookings,
                message:"bookings "
            })
         }catch(err){
          res.status().json({
            err:err.message
          })
         }
    }
    module.exports=bookingRouter;