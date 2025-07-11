const express=require("express")
const router=express.Router()

const answerController=require("../controllers").answerController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware); 

router.get("/getAll", requireRole("specialist"),answerController.getAllAnswers);
router.get("/:id", requireRole("specialist"),answerController.getAnswerById);
router.get("/getAllAnswersByQuestionId/:questionId", requireRole("specialist"),answerController.getAllAnswersByQuestionId);
router.get("/getAllAnswersByEmployeeId/:employeeId", requireRole("specialist"),answerController.getAllAnswersByEmployeeId);
router.get('/checkFeedbackForTherapySession/:therapySessionId/:employeeId', answerController.checkHasFeedbackForTherapySession);
router.get('/checkFeedbackForEvent/:eventId/:employeeId', answerController.checkHasFeedbackForEvent);
router.post("/create", requireRole("angajat"),answerController.createAnswer);
router.put("/update/:id", requireRole("angajat"),answerController.updateAnswer);
router.delete("/delete/:id", requireRole("angajat"),answerController.deleteAnswer);

module.exports=router