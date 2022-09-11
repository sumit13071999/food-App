const mongoose=require("mongoose");

let {DB_Link}=require("../model/screte");
mongoose.connect(DB_Link).then(function(db){
    console.log("db created");
}).catch(function(err){
console.log("err",err);
});
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"review can't be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Review must conatins some rating"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"userModel",
        required:[true,"Review must belon to a user"]
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:"planModel",
        required:[true,"Review must belong to a plan"]
    }
})
const reviewModel=mongoose.model("reviewModel",reviewSchema);
module.exports=reviewModel;