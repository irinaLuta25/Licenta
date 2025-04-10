const express=require("express")
const router=express.Router()

const employeeRewardController=require("../controllers").employeeRewardController;

router.get("/getAll",employeeRewardController.getAllEmployeeRewards);
router.get("/:id",employeeRewardController.getEmployeeRewardById);
router.get("/getAllRewardsByEmployeeId/:id",employeeRewardController.getAllRewardsByEmployeeId);
router.get("/getAllRewardsByRewardId/:id",employeeRewardController.getAllRewardsByRewardId);
router.post("/create",employeeRewardController.createEmployeeReward);
router.put("/update/:id",employeeRewardController.updateEmployeeReward);
router.delete("/delete/:id",employeeRewardController.deleteEmployeeReward);

module.exports=router