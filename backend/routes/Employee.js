const express=require("express")
const router=express.Router()

const employeeController=require("../controllers").employeeController;

router.get("/getAll",employeeController.getAllEmployees);
router.get("/:id",employeeController.getEmployeeById);
router.post("/create",employeeController.createEmployee);
router.put("/update/:id",employeeController.updateEmployee);
router.delete("/delete/:id",employeeController.deleteEmployee);

module.exports=router