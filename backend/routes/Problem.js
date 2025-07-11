const express=require("express")
const router=express.Router()

const problemController=require("../controllers").problemController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get("/getAll",problemController.getAllProblems);
router.get("/getProblemsByManagerDepartment/:managerId",problemController.getProblemsByManagerDepartment)
router.get("/getAllAnonymousProblems",problemController.getAllAnonymousProblems);
router.get("/getAllProblemsByEmployeeId/:id",problemController.getAllProblemsByEmployeeId);
router.get("/:id",problemController.getProblemById);
router.post("/create",requireRole("angajat"),problemController.createProblem);
router.put("/update/:id",requireRole("angajat"),problemController.updateProblem);
router.delete("/delete/:id",requireRole("angajat"),problemController.deleteProblem);

module.exports=router