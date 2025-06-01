const express=require("express")
const router=express.Router()

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const eventController=require("../controllers").eventController;

router.get("/getAll",eventController.getAllEvents);
router.get("/:id",eventController.getEventById);
router.get("/getAllEventsBySpecialistId/:specialistId",eventController.getAllEventsBySpecialistId);
router.get("/getAllEventsByTargetDepartment/:department",eventController.getAllEventsByTargetDepartment);
router.get("/getAllTrainings",eventController.getAllTrainings);
router.get("/getAllWorkshops",eventController.getAllWorkshops);
router.post("/create", upload.single("file"), eventController.createEvent);
router.put("/update/:id",eventController.updateEvent);
router.delete("/delete/:id",eventController.deleteEvent);

module.exports=router