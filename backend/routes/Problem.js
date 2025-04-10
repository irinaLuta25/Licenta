const express=require("express")
const router=express.Router()

const problemController=require("../controllers").problemController;

router.get("/getAll",problemController.getAllProblems);
router.get("/:id",problemController.getProblemById);
router.get("/getAllAnonymousProblems",problemController.getAllAnonymousProblems);
router.get("/getAllProblemsByEmployeeId/:id",problemController.getAllProblemsByEmployeeId);
router.post("/create",problemController.createProblem);
router.put("/update/:id",problemController.updateProblem);
router.delete("/delete/:id",problemController.deleteProblem);

module.exports=router