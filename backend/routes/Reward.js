const express=require("express")
const router=express.Router()

const rewardController=require("../controllers").rewardController;
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/getAll",rewardController.getAllRewards);
router.get("/:id",rewardController.getRewardById);
router.post("/create",rewardController.createReward);
router.put("/update/:id",rewardController.updateReward);
router.delete("/delete/:id",rewardController.deleteReward);

module.exports=router