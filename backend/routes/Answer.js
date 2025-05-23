const express=require("express")
const router=express.Router()

const answerController=require("../controllers").answerController;

router.get("/getAll",answerController.getAllAnswers);
router.get("/:id",answerController.getAnswerById);
router.get("/getAllAnswersByQuestionId/:questionId",answerController.getAllAnswersByQuestionId);
router.get("/getAllAnswersByEmployeeId/:employeeId",answerController.getAllAnswersByEmployeeId);
router.get('/checkFeedbackForTherapySession/:therapySessionId/:employeeId', answerController.checkHasFeedbackForTherapySession);
router.get('/checkFeedbackForEvent/:eventId/:employeeId', answerController.checkHasFeedbackForEvent);
router.post("/create",answerController.createAnswer);
router.put("/update/:id",answerController.updateAnswer);
router.delete("/delete/:id",answerController.deleteAnswer);

module.exports=router