const userController = require('./User');
const answerController = require('./Answer');
const emotionalStateController = require('./EmotionalState');
const employeeController = require('./Employee');
const employeeEventController = require('./EmployeeEvent');
const employeeGoalController = require('./EmployeeGoal');
const employeeRewardController = require('./EmployeeReward');
const eventController = require('./Event');
const habitController = require('./Habit');
const habitTrackingController = require('./HabitTracking');
const intervalController = require('./Interval');
const problemController = require('./Problem');
const questionController = require('./Question');
const rewardController = require('./Reward');
const specialistController = require('./Specialist');
const therapySessionController = require('./TherapySession');
const recommendationController = require("./recommendation");
const reportsController = require("./Report");

module.exports = {
    userController,
    answerController,
    emotionalStateController,
    employeeController,
    employeeEventController,
    employeeGoalController,
    employeeRewardController,
    eventController,
    habitController,
    habitTrackingController,
    intervalController,
    problemController,
    questionController,
    rewardController,
    specialistController,
    therapySessionController,
    recommendationController,
    reportsController
};
