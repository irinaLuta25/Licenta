const UserDb = require("../models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const controller = {
    register: async (req, res) => {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            password: req.body.password,
            role: req.body.role,
        };

        for (let field in user) {
            if (user[field] === undefined || user[field] === null) {
                return res.status(400).send(`${field} is empty!`);
            }
        }

        const checkUser = await UserDb.findOne({
            where: {
                email: user.email,
            },
        });

        if (checkUser) {
            return res.status(200).send("Email already registered");
        }

        try {
            user.password = await bcrypt.hash(user.password, 10);
            const user = await UserDb.create(user);
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    login: async (req, res) => {
        const payload = {
            email: req.body.email,
            password: req.body.password,
        };

        if (!payload.email || !payload.password) {
            return res.status(400).send("No email/password");
        }

        try {
            const user = await UserDb.findOne({
                where: {
                    email: payload.email,
                },
            });

            if (user) {
                const match = bcrypt.compare(payload.password, user.password);

                if (match) {
                    req.session.user = await jwt.sign(
                        user.get(),
                        process.env.COOKIE_SECRET,
                        {
                            algorithm: "HS256",
                            expiresIn: "1h",
                        }
                    );
                    return res
                        .status(200)
                        .send({ message: "Login success!", userId: user.id });
                } else {
                    return res.status(400).send("Incorrect email or password!");
                }
            }

            res.status(400).send("Incorrect email or password!");
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateUser: async (req, res) => {
        const userId = req.params.id
        const payload = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            password: req.body.password,
            role: req.body.role,
        };

        try {
            const user = UserDb.findByPk(userId);
            if (!user) {
                return res.status(400).send("User not found");
            }

            const newUser = await user.update(payload)
            res.status(200).send(newUser)
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteUser: async (req, res) => {
        const id = req.params.id;
        try {
            const user = await UserDb.findByPk(id);
            if (user) {
                await user.destroy();
                res.status(200).send("S-a sters");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await UserDb.findAll();
            res.status(200).send(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getUserById: async (req, res) => {
        const id = req.params.id;
        try {
            const user = await UserDb.findByPk(id);
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // logout: async(req,res) => {
    //     req.session={};

    // }
};

module.exports=controller;
