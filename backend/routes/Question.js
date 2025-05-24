const express=require("express")
const router=express.Router()

const questionController=require("../controllers").questionController;

router.get("/getAll",questionController.getAllQuestions);
router.get("/:id",questionController.getQuestionById);
router.get("/getAllQuestionsByEventId/:eventId",questionController.getAllQuestionsByEventId);
router.get("/getAllQuestionsByTherapySessionId/:therapySessionId",questionController.getAllQuestionsByTherapySessionId);
router.get("/getAllQuestionsBySpecialistId/:specialistId",questionController.getAllQuestionsBySpecialistId);
router.post("/createForEvent", questionController.createQuestionForEvent);
router.post("/createForTherapy", questionController.createQuestionForTherapySession);
router.put("/update/:id",questionController.updateQuestion);
router.delete("/delete/:id",questionController.deleteQuestion);

module.exports=router