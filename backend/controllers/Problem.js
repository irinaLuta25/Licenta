const ProblemDb = require("../models").Problem;

const controller = {
    createProblem: async (req, res) => {
        try {
            const problem = await ProblemDb.create({
                description: req.body.description,
                isAnonymous: req.body.isAnonymous
            });
            res.status(200).send(problem);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateProblem: async (req, res) => {
        try {
            const problem = await ProblemDb.findByPk(req.params.id);
            if (!problem) return res.status(400).send("Problem not found");

            const updated = await problem.update({
                description: req.body.description,
                isAnonymous: req.body.isAnonymous
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteProblem: async (req, res) => {
        try {
            const problem = await ProblemDb.findByPk(req.params.id);
            if (problem) {
                await problem.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Problem not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllProblems: async (req, res) => {
        try {
            const problems = await ProblemDb.findAll();
            res.status(200).send(problems);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getProblemById: async (req, res) => {
        try {
            const problem = await ProblemDb.findByPk(req.params.id);
            res.status(200).send(problem);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;