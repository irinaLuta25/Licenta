const express=require("express")
const router=express.Router()

const habitTrackingController=require("../controllers").habitTrackingController;

router.get("/getAll",habitTrackingController.getAllHabitTrackings);
router.get("/:id",habitTrackingController.getHabitTrackingById);
router.get("/getAllHabitTrackingByEmployeeGoalId/:id",habitTrackingController.getAllHabitTrackingByEmployeeGoalId);
router.post("/create",habitTrackingController.createHabitTracking);
router.put("/update/:id",habitTrackingController.updateHabitTracking);
router.delete("/delete/:id",habitTrackingController.deleteHabitTracking);

module.exports=router