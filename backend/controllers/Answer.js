const AnswerDb = require("../models").Answer;
const EmployeeDb = require("../models").Employee;
const UserDb = require("../models").User;
const QuestionDb = require("../models").Question;

const controller = {
    createAnswer: async (req, res) => {
        try {
            const answer = await AnswerDb.create({
                answer: req.body.answer,
                questionId: req.body.questionId,
                employeeId: req.body.employeeId,
                isAnonymous: req.body.isAnonymous
            });
            res.status(200).send(answer);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateAnswer: async (req, res) => {
        const id = req.params.id;
        try {
            const answer = await AnswerDb.findByPk(id);
            if (!answer) return res.status(400).send("Answer not found");

            const updated = await answer.update({
                answer: req.body.answer,
                questionId: req.body.questionId,
                employeeId: req.body.employeeId,
                isAnonymous: req.body.isAnonymous
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteAnswer: async (req, res) => {
        try {
            const answer = await AnswerDb.findByPk(req.params.id);
            if (answer) {
                await answer.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Answer not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllAnswers: async (req, res) => {
        try {
            const answers = await AnswerDb.findAll();
            res.status(200).send(answers);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAnswerById: async (req, res) => {
        try {
            const answer = await AnswerDb.findByPk(req.params.id);
            res.status(200).send(answer);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllAnswersByQuestionId: async (req, res) => {
        const { questionId } = req.params;
        if (!questionId) {
            throw new Error("No ID provided");
        }
        try {
            const answers = await AnswerDb.findAll({
                where: { questionId },
                include: {
                    model: EmployeeDb,
                    include: {
                        model: UserDb,
                        attributes: ['firstName', 'lastName'],
                    },
                },
            });
            console.log("ANSWERS DIN BACK", answers)
            res.status(200).send(answers);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllAnswersByEmployeeId: async (req, res) => {
        const { employeeId } = req.params;
        if (!employeeId) {
            throw new Error("No ID provided");
        }
        try {
            const answers = await AnswerDb.findAll({
                where: { employeeId }
            });
            res.status(200).send(answers);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    checkHasFeedbackForTherapySession: async (req, res) => {
        const { therapySessionId, employeeId } = req.params;
        if (!therapySessionId || !employeeId) {
            return res.status(400).send("therapySessionId and employeeId required");
        }
        try {
            const questions = await QuestionDb.findAll({
                where: { therapySessionId }
            });

            const questionIds = questions.map(q => q.id);

            if (questionIds.length === 0) {
                return res.json({ hasFeedback: false });
            }

            const existingAnswer = await AnswerDb.findOne({
                where: {
                    questionId: questionIds,
                    employeeId
                }
            });

            res.json({ hasFeedback: !!existingAnswer });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking feedback for therapy session" });
        }
    },

    checkHasFeedbackForEvent: async (req, res) => {
        const { eventId, employeeId } = req.params;
        if (!eventId || !employeeId) {
            return res.status(400).send("eventId and employeeId required");
        }
        try {
            const questions = await QuestionDb.findAll({
                where: { eventId }
            });

            const questionIds = questions.map(q => q.id);

            if (questionIds.length === 0) {
                return res.json({ hasFeedback: false });
            }

            const existingAnswer = await AnswerDb.findOne({
                where: {
                    questionId: questionIds,
                    employeeId
                }
            });

            res.json({ hasFeedback: !!existingAnswer });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking feedback for event" });
        }
    },
}

module.exports = controller;