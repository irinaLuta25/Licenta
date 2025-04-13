const express=require("express")
const router=express.Router()

const intervalController=require("../controllers").intervalController;

router.get("/getAll",intervalController.getAllIntervals);
router.get("/:id",intervalController.getIntervalById);
router.get("/getAllAvailableIntervalsBySpecialistId/:id",intervalController.getAllAvailableIntervalsBySpecialistId);
router.post("/create",intervalController.createInterval);
router.put("/update/:id",intervalController.updateInterval);
router.put("/updateIntervalStatus/:id",intervalController.updateIntervalStatus);
router.delete("/delete/:id",intervalController.deleteInterval);

module.exports=router