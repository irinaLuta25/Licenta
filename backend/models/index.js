const sequelize=require('sequelize')
const db=require("../config/db")

const AnswerModel=require("./Answer")
const EmotionalStateModel=require("./EmotionalState")
const EmployeeModel=require("./Employee")
const EmployeeEventModel=require("./EmployeeEvent")
const EmployeeGoalModel=require("./EmployeeGoal")
const EmployeeRewardModel=require("./EmployeeReward")
const EventModel=require("./Event")
const HabitModel=require("./Habit")
const HabitTrackingModel=require("./HabitTracking")
const IntervalModel=require("./Interval")
const ProblemModel=require("./Problem")
const QuestionModel=require("./Question")
const RewardModel=require("./Reward")
const SpecialistModel=require("./Specialist")
const SpecialistSpecializationModel=require("./SpecialistSpecialization")
const SpecializationModel=require("./Specialization")
const TherapySessionModel=require("./TherapySession")
const UserModel=require("./User")

const Answer=AnswerModel(db,sequelize)
const EmotionalState=EmotionalStateModel(db,sequelize)
const Employee=EmployeeModel(db,sequelize)
const EmployeeEvent=EmployeeEventModel(db,sequelize)
const EmployeeGoal=EmployeeGoalModel(db,sequelize)
const EmployeeReward=EmployeeRewardModel(db,sequelize)
const Event=EventModel(db,sequelize)
const Habit=HabitModel(db,sequelize)
const HabitTracking=HabitTrackingModel(db,sequelize)
const Interval=IntervalModel(db,sequelize)
const Problem=ProblemModel(db,sequelize)
const Question=QuestionModel(db,sequelize)
const Reward=RewardModel(db,sequelize)
const Specialist=SpecialistModel(db,sequelize)
const SpecialistSpecialization=SpecialistSpecializationModel(db,sequelize)
const Specialization=SpecializationModel(db,sequelize)
const TherapySession=TherapySessionModel(db,sequelize)
const User=UserModel(db,sequelize)

User.hasOne(Employee)
Employee.belongsTo(User)

User.hasOne(Specialist)
Specialist.belongsTo(User)

Specialist.hasMany(SpecialistSpecialization)
SpecialistSpecialization.belongsTo(Specialist)

Specialization.hasMany(SpecialistSpecialization)
SpecialistSpecialization.belongsTo(Specialization)

Specialist.hasMany(Interval)
Interval.belongsTo(Specialist)

Interval.hasOne(TherapySession)
TherapySession.belongsTo(Interval)

Interval.hasOne(Event)
Event.belongsTo(Interval)

Employee.hasMany(TherapySession)
TherapySession.belongsTo(Employee)

TherapySession.hasMany(Question)
Question.belongsTo(TherapySession)

Event.hasMany(Question)
Question.belongsTo(Event)

Question.hasMany(Answer)
Answer.belongsTo(Question)

Employee.hasMany(Answer)
Answer.belongsTo(Employee)

Specialist.hasMany(Event)
Event.belongsTo(Specialist)

Event.hasMany(EmployeeEvent)
EmployeeEvent.belongsTo(Event)

Employee.hasMany(EmployeeEvent)
EmployeeEvent.belongsTo(Employee)

Employee.hasMany(EmotionalState)
EmotionalState.belongsTo(Employee)

Employee.hasMany(Problem)
Problem.belongsTo(Employee)

Employee.hasMany(EmployeeReward)
EmployeeReward.belongsTo(Employee)

Habit.hasMany(EmployeeGoal)
EmployeeGoal.belongsTo(Habit)

Reward.hasMany(EmployeeReward)
EmployeeReward.belongsTo(Reward)

Employee.hasMany(EmployeeGoal)
EmployeeGoal.belongsTo(Employee)

EmployeeGoal.hasMany(HabitTracking)
HabitTracking.belongsTo(EmployeeGoal)


module.exports = {
    User,
    Answer,
    EmotionalState,
    Employee,
    EmployeeEvent,
    EmployeeGoal,
    EmployeeReward,
    Event,
    Habit,
    HabitTracking,
    Interval,
    Problem,
    Question,
    Reward,
    Specialist,
    SpecialistSpecialization,
    Specialization,
    TherapySession,
    db
}

// pag 177 - 219 - omul ca fiinta sociala
