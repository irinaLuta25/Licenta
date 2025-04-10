const express=require("express")
const router=express.Router()

const specializationController=require("../controllers").specializationController;

router.get("/getAll",specializationController.getAllSpecializations);
router.get("/:id",specializationController.getSpecializationById);
router.post("/create",specializationController.createSpecialization);
router.put("/update/:id",specializationController.updateSpecialization);
router.delete("/delete/:id",specializationController.deleteSpecialization);

module.exports=router