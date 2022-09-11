const userModel = require("../model/useModel")
const express = require('express');
const userRouter = express.Router();
const protectRoute = require("./routeHelper");
const factory = require("../helper/factory");

// function updateUser(req, res) {
//     let obj = req.body;
//     for (let key in obj) {
//         user[key] = obj[key];
//     }
//     res.status(200).json(user);
// }
// function deleteUser(req, res) {
//     user = {}
//     res.status(200).json(user);
// }
// function getUserById(req, res) {
//     console.log(req.params);
//     res.status(200).send("hello");
// }

const createUser = factory.createElement(userModel);
const getUsers = factory.getElement(userModel);
const deleteUser = factory.deleteElement(userModel);
const updateUser = factory.updateElement(userModel);
const getUserById = factory.getElementById(userModel);
//original code 
// async function createUser(req, res) {
//     try{
//         let user=req.body;
//         if(user){
//             user= await userModel.create(user);
//             res.status(200).json({
//              user:user
//             });
//         }else{
//             res.status(200).json({
//             message:"kindly enter the user data"
//                });
//         }
//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             message:"Server error"
//            });
//     }

// }
// async function getUsers(req, res) {
//     try {
//         let users = await userModel.find();
//         res.status(200).json({
//             "message": "list of all the users",
//             user: users
//         })
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//             "message": " can't get users"
//         })
//     }

// }
function authorizeUser(roleArr) {
    return async function (req, res) {
        let uid = req.uid;
        let { role } = await userModel.findById(uid);
        let isAuthorized = roleArr.includes(role);
        if (isAuthorized) {
            next();
        } else {
            res.status(403).json({
                message: "user not autherized"
            })
        }
    }
}
userRouter.route("/")
    // add protectRoute in that
    .get(protectRoute, authorizeUser(["admin"]), getUsers)
    .post(protectRoute, authorizeUser(["admin"]), createUser);

userRouter.route("/:id")
    .get(protectRoute, authorizeUser(["admin", "manager"]), getUserById)
    .patch(updateUser)
    .delete(protectRoute, authorizeUser(["admin"]), deleteUser);

module.exports = userRouter;