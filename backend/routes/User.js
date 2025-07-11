const express=require("express")
const router=express.Router()

const userController=require("../controllers").userController;
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get("/getAll", authMiddleware,  requireRole("specialist"), userController.getAllUsers);
router.get("/getUserFromCookie", authMiddleware, userController.getUserFromCookie);
router.get("/:id",authMiddleware, userController.getUserById);
router.post("/register",upload.single("profileImage"),userController.register);
router.post("/login",userController.login);
router.post("/logout", authMiddleware, userController.logout);
router.put("/update/:id", upload.single("profileImage"), userController.updateUser);
router.delete("/delete/:id",authMiddleware, userController.deleteUser);

module.exports=router