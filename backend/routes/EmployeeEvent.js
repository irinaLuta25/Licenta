const express=require("express")
const router=express.Router()

const employeeEventController=require("../controllers").employeeEventController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/getAll",employeeEventController.getAllEmployeeEvents);
router.get("/:id",employeeEventController.getEmployeeEventById);
router.get("/getAllEmployeeEventsByEmployeeId/:employeeId",employeeEventController.getAllEmployeeEventsByEmployeeId);
router.get("/getAllEmployeeEventsByEventId/:eventId",employeeEventController.getAllEmployeeEventsByEventId);
router.post("/create",requireRole("angajat"),employeeEventController.createEmployeeEvent);
router.put("/update/:id",requireRole("angajat"),employeeEventController.updateEmployeeEvent);
router.delete("/delete/:id",employeeEventController.deleteEmployeeEvent);

module.exports=router