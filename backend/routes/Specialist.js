const express=require("express")
const router=express.Router()

const specialistController=require("../controllers").specialistController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get("/getAll",specialistController.getAllSpecialists);
router.get("/getAllTherapists",specialistController.getAllTherapists);
router.get("/getSpecialistByUserId/:userId",specialistController.getSpecialistByUserId)
router.get("/:id",specialistController.getSpecialistById);
router.post("/create", specialistController.createSpecialist);
router.put("/update/:id",requireRole("specialist"), specialistController.updateSpecialist);
router.delete("/delete/:id",specialistController.deleteSpecialist);

module.exports=router