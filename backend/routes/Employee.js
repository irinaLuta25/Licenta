const express=require("express")
const router=express.Router()

const employeeController=require("../controllers").employeeController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/getAll",employeeController.getAllEmployees);
router.get("/getEmployeeByUserId/:userId",employeeController.getEmployeeByUserId);
router.get("/:id",employeeController.getEmployeeById);
router.post("/create", employeeController.createEmployee);
router.put("/update/:id",requireRole("angajat"),employeeController.updateEmployee);
router.delete("/delete/:id",employeeController.deleteEmployee);

module.exports=router