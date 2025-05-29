const express=require("express")
const router=express.Router()

const problemController=require("../controllers").problemController;

router.get("/getAll",problemController.getAllProblems);
router.get("/getProblemsByManagerDepartment/:managerId",problemController.getProblemsByManagerDepartment)
router.get("/getAllAnonymousProblems",problemController.getAllAnonymousProblems);
router.get("/getAllProblemsByEmployeeId/:id",problemController.getAllProblemsByEmployeeId);
router.get("/:id",problemController.getProblemById);
router.post("/create",problemController.createProblem);
router.put("/update/:id",problemController.updateProblem);
router.delete("/delete/:id",problemController.deleteProblem);

module.exports=router