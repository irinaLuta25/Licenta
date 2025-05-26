const express=require("express")
const router=express.Router()

const employeeGoalController=require("../controllers").employeeGoalController;

router.get("/getAll",employeeGoalController.getAllEmployeeGoals);
router.get("/:id",employeeGoalController.getEmployeeGoalById);
router.get("/getAllEmployeeGoalsByEmployeeId/:employeeId",employeeGoalController.getAllEmployeeGoalsByEmployeeId);
router.post("/create",employeeGoalController.createEmployeeGoal);
router.put("/update/:id",employeeGoalController.updateEmployeeGoal);
router.delete("/delete/:id",employeeGoalController.deleteEmployeeGoal);

module.exports=router