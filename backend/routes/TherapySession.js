const express=require("express")
const router=express.Router()

const therapySessionController=require("../controllers").therapySessionController;

router.get("/getAll",therapySessionController.getAllTherapySessions);
router.get("/:id",therapySessionController.getTherapySessionById);
router.get("/getAllTherapySessionsByEmployeeId/:id",therapySessionController.getAllTherapySessionsByEmployeeId);
router.get("/getAllTherapySessionsBySpecialistId/:id",therapySessionController.getAllTherapySessionsBySpecialistId);
router.post("/create",therapySessionController.createTherapySession);
router.put("/update/:id",therapySessionController.updateTherapySession);
router.delete("/delete/:id",therapySessionController.deleteTherapySession);

module.exports=router