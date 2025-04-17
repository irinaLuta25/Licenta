const express=require("express")
const router=express.Router()

const employeeEventController=require("../controllers").employeeEventController;

router.get("/getAll",employeeEventController.getAllEmployeeEvents);
router.get("/:id",employeeEventController.getEmployeeEventById);
router.get("/getAllEmployeeEventsByEmployeeId/:employeeId",employeeEventController.getAllEmployeeEventsByEmployeeId);
router.post("/create",employeeEventController.createEmployeeEvent);
router.put("/update/:id",employeeEventController.updateEmployeeEvent);
router.delete("/delete/:id",employeeEventController.deleteEmployeeEvent);

module.exports=router