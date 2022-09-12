const mongoose=require("mongoose");
const emailValidator=require("email-validator")
let {DB_Link}=require("./screte");
mongoose.connect(DB_Link).then(function(db){
    console.log("db created");
}).catch(function(err){
console.log("err",err);
})
//syntex
const userSchema=new mongoose.Schema({
    name:{
        type : String,
        required:[true,"kindly enter the name "],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function(){
            return emailValidator.validate(this.email);
        }
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        minlength: 7,
        required: true
    },
    confirmPassword: {
        type: String,
        minlength: 7,
        validate: function(){
            return this.password==this.confirmPassword
        },
        required: true
    },
    createAt :{
    type : Date
    },
    token :{
    type : String
    },
    role : {
        type:String,
        enum:["admin","user","manager"],
        default:"user"
    },
    bookings:{
        type:[mongoose.Schema.ObjectId],
        ref:"bookingModel"
    },
})
userSchema.pre("save",function(){
    // db confirm password will not saved
    this.confirmPassword=undefined;
})
// midleware
userSchema.methods.resetHandler = function (password , confirmPassword){
    this.password=password;
    this.confirmPassword;
    // token reuse not possible
    this.token=undefined;
}
const userModel=mongoose.model("userModel",userSchema);
// ( async function createUser(){
//     let userObj= {
//         name: "sumit",
//         password: "123456789",
//         age:23,
//         email:"abc@gmail.com",
//         confirmPassword:"123456789"
//       }
//      let user = await userModel.create(userObj);
//     console.log("user",user);
// })();

module.exports=userModel