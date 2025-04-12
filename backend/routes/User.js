const express=require("express")
const router=express.Router()

const userController=require("../controllers").userController;

router.get("/getAll",userController.getAllUsers);
router.get("/getUserFromCookie",userController.getUserFromCookie);
router.get("/:id",userController.getUserById);
router.post("/register",userController.register);
router.post("/login",userController.login);
router.post("/logout", userController.logout);
router.put("/update/:id",userController.updateUser);
router.delete("/delete/:id",userController.deleteUser);

module.exports=router