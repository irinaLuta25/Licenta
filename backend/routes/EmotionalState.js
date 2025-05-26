const express=require("express")
const router=express.Router()

const emotionalStateController=require("../controllers").emotionalStateController;

router.get("/getAll",emotionalStateController.getAllEmotionalStates);
router.get("/:id",emotionalStateController.getEmotionalStateById);
router.get("/getAllEmotionalStatesByEmployeeId/:employeeId",emotionalStateController.getAllEmotionalStatesByEmployeeId);
router.post("/create",emotionalStateController.createEmotionalState);
router.put("/update/:id",emotionalStateController.updateEmotionalState);
router.delete("/delete/:id",emotionalStateController.deleteEmotionalState);

module.exports=router