const express=require("express")
const router=express.Router()

const intervalController=require("../controllers").intervalController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get("/getAll",intervalController.getAllIntervals);
router.get("/:id",intervalController.getIntervalById);
router.get("/getAllAvailableIntervalsBySpecialistId/:id",intervalController.getAllAvailableIntervalsBySpecialistId);
router.post("/create",requireRole("specialist"),intervalController.createInterval);
router.put("/update/:id",requireRole("specialist"),intervalController.updateInterval);
router.put("/updateIntervalStatus/:id",intervalController.updateIntervalStatus);
router.delete("/delete/:id",intervalController.deleteInterval);

module.exports=router