const express=require("express")
const router=express.Router()

const specialistController=require("../controllers").specialistController;

router.get("/getAll",specialistController.getAllSpecialists);
router.get("/getAllTherapists",specialistController.getAllTherapists);
router.get("/getSpecialistByUserId/:userId",specialistController.getSpecialistByUserId)
router.get("/:id",specialistController.getSpecialistById);
router.post("/create",specialistController.createSpecialist);
router.put("/update/:id",specialistController.updateSpecialist);
router.delete("/delete/:id",specialistController.deleteSpecialist);

module.exports=router