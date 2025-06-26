const express=require("express")
const router=express.Router()

const userController=require("../controllers").userController;
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/getAll",userController.getAllUsers);
router.get("/getUserFromCookie",userController.getUserFromCookie);
router.get("/:id",userController.getUserById);
router.post("/register",upload.single("profileImage"),userController.register);
router.post("/login",userController.login);
router.post("/logout", userController.logout);
router.put("/update/:id", upload.single("profileImage"), userController.updateUser);
router.delete("/delete/:id",userController.deleteUser);

module.exports=router