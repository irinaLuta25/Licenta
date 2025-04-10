const express=require("express")
const router=express.Router()

const specialistSpecializationController=require("../controllers").specialistSpecializationController;

router.get("/getAll",specialistSpecializationController.getAllSpecialistSpecializations);
router.get("/:id",specialistSpecializationController.getSpecialistSpecializationById);
router.get("/getAllSpecialistSpecializationsBySpecialistId/:id",specialistSpecializationController.getAllSpecialistSpecializationsBySpecialistId);
router.post("/create",specialistSpecializationController.createSpecialistSpecialization);
router.put("/update/:id",specialistSpecializationController.updateSpecialistSpecialization);
router.delete("/delete/:id",specialistSpecializationController.deleteSpecialistSpecialization);

module.exports=router