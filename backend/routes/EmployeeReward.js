const express=require("express")
const router=express.Router()

const employeeRewardController=require("../controllers").employeeRewardController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/getAll",employeeRewardController.getAllEmployeeRewards);
router.get("/:id",employeeRewardController.getEmployeeRewardById);
router.get("/getAllRewardsByEmployeeId/:employeeId",requireRole("angajat"),employeeRewardController.getAllRewardsByEmployeeId);
router.get("/getAllRewardsByRewardId/:id",employeeRewardController.getAllRewardsByRewardId);


module.exports=router