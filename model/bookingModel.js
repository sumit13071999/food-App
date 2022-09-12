const mongoose=require("mongoose");

let {DB_Link}=require("../model/screte");
mongoose.connect(DB_Link).then(function(db){
    console.log("db created");
}).catch(function(err){
console.log("err",err);
});
const bookingSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    plan :{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    PriceAtThatTime:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        enum:["pending","failed","success"],
        required:true
    }
})
const bookingModel=mongoose.model("bookingModel",bookingSchema);
module.exports=bookingModel;