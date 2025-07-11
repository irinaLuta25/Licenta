const express=require("express")
const router=express.Router()

const habitTrackingController=require("../controllers").habitTrackingController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/getAll",habitTrackingController.getAllHabitTrackings);
router.get("/:id",habitTrackingController.getHabitTrackingById);
router.get("/getAllHabitTrackingByEmployeeGoalId/:employeeGoalId",requireRole("angajat"),habitTrackingController.getAllHabitTrackingByEmployeeGoalId);
router.post("/create",requireRole("angajat"),habitTrackingController.createHabitTracking);
router.put("/update/:id",requireRole("angajat"),habitTrackingController.updateHabitTracking);
router.delete("/delete/:id",requireRole("angajat"),habitTrackingController.deleteHabitTracking);

module.exports=router