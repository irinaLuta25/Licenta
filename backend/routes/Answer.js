const express=require("express")
const router=express.Router()

const answerController=require("../controllers").answerController;

router.get("/getAll",answerController.getAllAnswers);
router.get("/:id",answerController.getAnswerById);
router.get("/getAllAnswersByQuestionId/:id",answerController.getAllAnswersByQuestionId);
router.get("/getAllAnswersByEmployeeId/:id",answerController.getAllAnswersByEmployeeId);
router.post("/create",answerController.createAnswer);
router.put("/update/:id",answerController.updateAnswer);
router.delete("/delete/:id",answerController.deleteAnswer);

module.exports=router