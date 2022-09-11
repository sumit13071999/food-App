const mongoose=require("mongoose");
const emailValidator=require("email-validator")
let {DB_Link}=require("../model/screte");
mongoose.connect(DB_Link).then(function(db){
    console.log("db created");
}).catch(function(err){
console.log("err",err);
})
//syntex
const planSchema=new mongoose.Schema({
    name:{
        type : String,
        required:[true, "kindly enter the name"],
        unique:"true",
        // errors handling
        maxlength: [40 ,"your plan length is more than 40 character"],
    },
    duration: {
        type:Number,
        required:[true,"you need to provide duration"],
    },
    price:{
        type:Number,
        required:true,
    },
    ratingsAverage: {
        type:Number,
    },
    discount:{
        type:Number,
        validate: {
        validator: function(){
            return this.discount<this.price;
        },
        message: "Discount must be less than actual price",
    },
    },
    reviews:{
     type:[mongoose.Schema.ObjectId],
     ref:"reviewModel"
    },
    averageRating:Number
    
})

const planModel=mongoose.model("planModel",planSchema);


module.exports=planModel