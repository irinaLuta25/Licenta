const express=require("express")
const router=express.Router()

const employeeGoalController=require("../controllers").employeeGoalController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/getAll",employeeGoalController.getAllEmployeeGoals);
router.get("/:id",employeeGoalController.getEmployeeGoalById);
router.get("/getAllEmployeeGoalsByEmployeeId/:employeeId",requireRole("angajat"),employeeGoalController.getAllEmployeeGoalsByEmployeeId);
router.post("/create",requireRole("angajat"),employeeGoalController.createEmployeeGoal);
router.put("/update/:id",requireRole("angajat"),employeeGoalController.updateEmployeeGoal);
router.delete("/delete/:id",requireRole("angajat"),employeeGoalController.deleteEmployeeGoal);

module.exports=router