const express=require("express")
const router=express.Router()

const eventController=require("../controllers").eventController;

router.get("/getAll",eventController.getAllEvents);
router.get("/:id",eventController.getEventById);
router.get("/getAllEventsBySpecialistId/:id",eventController.getAllEventsBySpecialistId);
router.get("/getAllEventsByTargetDepartment/:department",eventController.getAllEventsByTargetDepartment);
router.get("/getAllEventsForManagers",eventController.getAllEventsForManagers);
router.get("/getAllTrainings",eventController.getAllTrainings);
router.get("/getAllWorkshops",eventController.getAllWorkshops);
router.post("/create",eventController.createEvent);
router.put("/update/:id",eventController.updateEvent);
router.delete("/delete/:id",eventController.deleteEvent);

module.exports=router