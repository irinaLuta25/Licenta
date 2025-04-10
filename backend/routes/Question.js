const express=require("express")
const router=express.Router()

const questionController=require("../controllers").questionController;

router.get("/getAll",questionController.getAllQuestions);
router.get("/:id",questionController.getQuestionById);
router.get("/getAllQuestionsByEventId/:id",questionController.getAllQuestionsByEventId);
router.get("/getAllQuestionsBySpecialistId/:id",questionController.getAllQuestionsBySpecialistId);
router.post("/create",questionController.createQuestionForEvent);
router.post("/create",questionController.createQuestionForTherapySession);
router.put("/update/:id",questionController.updateQuestion);
router.delete("/delete/:id",questionController.deleteQuestion);

module.exports=router