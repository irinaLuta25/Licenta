const express=require("express")
const router=express.Router()

const therapySessionController=require("../controllers").therapySessionController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get("/getAll",therapySessionController.getAllTherapySessions);
router.get("/getAllTherapySessionsByEmployeeId/:employeeId",therapySessionController.getAllTherapySessionsByEmployeeId);
router.get("/getAllTherapySessionsBySpecialistId/:specialistId",therapySessionController.getAllTherapySessionsBySpecialistId);
router.get("/:id",therapySessionController.getTherapySessionById);
router.post("/create",requireRole("angajat"), therapySessionController.createTherapySession);
router.put("/update/:id",therapySessionController.updateTherapySession);
router.delete("/delete/:id",therapySessionController.deleteTherapySession);

module.exports=router