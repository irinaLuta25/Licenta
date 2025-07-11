const express=require("express")
const router=express.Router()

const emotionalStateController=require("../controllers").emotionalStateController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/:id",emotionalStateController.getEmotionalStateById);
router.get("/getAllEmotionalStatesByEmployeeId/:employeeId",emotionalStateController.getAllEmotionalStatesByEmployeeId);
router.post("/create",requireRole("angajat"),emotionalStateController.createEmotionalState);
router.put("/update/:id",requireRole("angajat"),emotionalStateController.updateEmotionalState);
router.delete("/delete/:id",requireRole("angajat"),emotionalStateController.deleteEmotionalState);

module.exports=router