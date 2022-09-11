const express=require("express");
const reviewRouter=express.Router();
const factory=require("../helper/factory");
const protectRoute=require("./authRouter");
const planModel=require("../model/planModel");
const reviewModel=require("../model/reviewModel");


const createReview=async function(req,res){
try{
let review=reviewModel.create(req.body);
console.log("review",review);
let PlanId=await review.plan;
let plan=await planModel.findById(PlanId);
plan.reviews.push(review["_id"]);
if(plan.averageRating){
let sum=plan.averageRating*plan.reviews.length;
let finalAvgRating=(sum+review.rating)/(plan.review.length+1);
plan.averageRating=finalAvgRating;
}else{
    plan.averageRating=review.rating;
}
await plan.save();
res.status(200).json({
    message:"review created",
    review:review
})
}catch(err){
res.status(500).json({
message:err.message
});
}
}
const getReviews=factory.getElement(reviewModel);
const deleteReview=async function(req,res){
    try{
    let review=reviewModel.findByIdAndDelete(req.body);
    console.log("review",review);
    let PlanId=await review.plan;
    let plan=await planModel.findById(PlanId);
    let idxOfreview =plan.reviews.indexOf(review["_id"]);
    plan.review.splice(idxOfreview,1);
    await plan.save();
    res.status(200).json({
        message:"review deleted",
        review:review
    })
    }catch(err){
    res.status(500).json({
    message:err.message
    });
    }
    }
const updateReview =factory.updateElement(reviewModel);
const getReviewById=factory.getElementById(reviewModel); 

reviewRouter.use(protectRoute);
reviewRouter.route("/") 
// add protectRoute in that
    .get(getReviews)
    .post(createReview);
    

reviewRouter.route("/:id")
    .get(getReviewById)
    .patch(updateReview)
    .delete(deleteReview);
    reviewRouter.route("/top3plans").get(Top3Plans);
    async function Top3Plans(){
        // review model -> get me first three plan in decreaseing order of rating
         try{
            //find Empty ->full model search and you will get all the enteries
            const reviews=await reviewModel.find().limit(3).sort({
                rating: -1
            });
            res.status().json({
                reviews,
                message:"Reviews "
            })
         }catch(err){
          res.status().json({
            err:err.message
          })
         }
    }
    module.exports=reviewRouter;