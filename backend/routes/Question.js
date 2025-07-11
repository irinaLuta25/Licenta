const express=require("express")
const router=express.Router()

const questionController=require("../controllers").questionController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get("/getAll",questionController.getAllQuestions);
router.get("/:id",questionController.getQuestionById);
router.get("/getAllQuestionsByEventId/:eventId",questionController.getAllQuestionsByEventId);
router.get("/getAllQuestionsByTherapySessionId/:therapySessionId",questionController.getAllQuestionsByTherapySessionId);
router.get("/getAllQuestionsBySpecialistId/:specialistId",questionController.getAllQuestionsBySpecialistId);
router.post("/createForEvent",requireRole("specialist"), questionController.createQuestionForEvent);
router.post("/createForTherapy", requireRole("specialist"), questionController.createQuestionForTherapySession);
router.put("/update/:id", requireRole("specialist"), questionController.updateQuestion);
router.delete("/delete/:id", requireRole("specialist"), questionController.deleteQuestion);

module.exports=router