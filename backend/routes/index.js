const express=require("express")
const router=express.Router()

const answerRouter=require("./Answer");
const emotionalStateRouter=require("./EmotionalState");
const employeeRouter=require("./Employee");
const employeeEventRouter=require("./EmployeeEvent");
const employeeGoalRouter=require("./EmployeeGoal");
const employeeRewardRouter=require("./EmployeeReward");
const eventRouter=require("./Event");
const habitRouter=require("./Habit");
const habitTrackingRouter=require("./HabitTracking");
const intervalRouter=require("./Interval");
const problemRouter=require("./Problem");
const questionRouter=require("./Question");
const rewardRouter=require("./Reward");
const specialistRouter=require("./Specialist");
const specialistSpecializationRouter=require("./SpecialistSpecialization");
const specializationRouter=require("./Specialization");
const therapySessionRouter=require("./TherapySession");
const userRouter=require("./User");

router.use("/answer",answerRouter);
router.use("/emotionalState",emotionalStateRouter);
router.use("/employee",employeeRouter);
router.use("/employeeEvent",employeeEventRouter);
router.use("/employeeGoal",employeeGoalRouter);
router.use("/employeeReward",employeeRewardRouter);
router.use("/event",eventRouter);
router.use("/habit",habitRouter);
router.use("/habitTracking",habitTrackingRouter);
router.use("/interval",intervalRouter);
router.use("/problem",problemRouter);
router.use("/question",questionRouter);
router.use("/reward",rewardRouter);
router.use("/specialist",specialistRouter);
router.use("/specialistSpecialization",specialistSpecializationRouter);
router.use("/specialization",specializationRouter);
router.use("/specialist",therapySessionRouter);
router.use("/therapySession",therapySessionRouter);
router.use("/user",userRouter);

module.exports=router;