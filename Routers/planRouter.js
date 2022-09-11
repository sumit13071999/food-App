const express=require('express');
const PlanRouter = express.Router();
const protectRoute=require("./routeHelper");
const PlanModel = require("../model/planModel");
const factory = require('../helper/factory');

    const createPlan=factory.createElement(PlanModel);
    const getPlans=factory.getElement(PlanModel);
    const deletePlan=factory.deleteElement(PlanModel);
    const updatePlan =factory.updateElement(PlanModel);
    const getPlanById=factory.getElementById(PlanModel);

PlanRouter.use(protectRoute);
PlanRouter.route("/top3plans").get(Top3Plans);
PlanRouter.route("/") 
// add protectRoute in that
    .get(getPlans)
    .post(createPlan)
    

PlanRouter.route("/:id")
    .get(getPlanById)
    .patch(updatePlan)
    .delete(deletePlan);


async function Top3Plans(req,res){
try{
let plans=await PlanModel.find().sort("-averageRating").limit(3)
.populate({path:  'reviews'});
console.log(plans);
res.status(200).json({
plans
})
}catch(err){
res.status(200).json({
message: err.message
})
}
}
// async function createPlan(req,res){
//         try{
//         let plan=req.body;
//             if(plan){
//                 plan=await PlanModel.create(plan);
//                res.status(200).json({
//             plan:plan,
//             });
//             }else {
//                 res.status(200).json({
//                     message:"kindly enter plan data"
//                 });
//             }
//         }catch(err){
//     console.error(err);
//     res.status(500).json({
//         message:"server Error"
//     });
//         }
//     }
//     async function updatePlan(req, res) {
//         try{
//      await PlanModel.updateOne({name},req.body);
//      let plan= await PlanModel.findOne({name})
//         res.status(200).json(Plan);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//            message :"Server error"
//         });
//     }
// }
//    async function deletePlan(req, res) {
//         Plan = {}
//         res.status(200).json(Plan);
//     }
//    async function getPlanById(req, res) {
//         try{ 
//         let id=req.params.id;
//          let plan=PlanModel.getElementById(id);
//         res.status(200).json({
//             plan:plan
//         });
//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             message:"Server error"
//         });
//     }
//     }
//     async  function getPlans(req, res) {
//         try{
//         //filter
//         //sort
//         //remove
//         //paginate
//         let ans=JSON.parse(req.query.myquery);

//         let sortField=req.query.sort;
//         let plansQuery=PlanModel.find(ans);
//         let sortQuery=plansQuery.sort(`${sortField}`);
//         let params=req.query.select.split("%").join(" ");
//         let filteredQuery = sortQuery.select(`${params} -_id`)
       
//         // pagination
//         //skip
//         //limit
//         let page=Number(req.query.page)|| 1;
//         let limit=Number(req.query.limit)|| 3;
//         let toSkip=(page - 1)*limit;
//         let paginationResultPromise = filteredQuery.skip(toSkip).limit(limit);
//         let result = await paginationResultPromise;

//      let Plans=await PlanModel.find(); 
//      res.status(200).json({
//         "message":"list of all the Plans",
//         Plan: result
//      })
//         }catch(err){
//             res.status(500).json({
//                 error:err.message,
//                 "message":" can't get Plans"
//             })
//         }
        
//     }
    
    module.exports= PlanRouter;