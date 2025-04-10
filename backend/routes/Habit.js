const express=require("express")
const router=express.Router()

const habitController=require("../controllers").habitController;

router.get("/getAll",habitController.getAllHabits);
router.get("/:id",habitController.getHabitById);
router.post("/create",habitController.createHabit);
router.put("/update/:id",habitController.updateHabit);
router.delete("/delete/:id",habitController.deleteHabit);

module.exports=router