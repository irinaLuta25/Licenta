const UserDb = require("../models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeDb=require("../models").Employee;
const SpecialistDb=require("../models").Specialist;

const controller = {
    register: async (req, res) => {
        console.log("aaaaa");
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
            const newUser = await UserDb.create(user);
            console.log("User creat:", newUser.id, newUser.role);

            try {
                if (newUser.role === "angajat") {
                  await EmployeeDb.create({ userId: newUser.id });
                  console.log("Employee creat");
                } else if (newUser.role === "specialist") {
                  await SpecialistDb.create({ userId: newUser.id });
                  console.log("Specialist creat");
                }
              } catch (err) {
                console.error("Eroare la creare employee/specialist:", err.message);
            }

            res.status(200).send(newUser);
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
                const match = await bcrypt.compare(payload.password, user.password);

                if (match) {
                    const token = jwt.sign(
                        { id: user.id, email: user.email, role: user.role },
                        process.env.COOKIE_SECRET,
                        { algorithm: "HS256", expiresIn: "8h" }
                    );
                
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "Lax",
                        maxAge: 24 * 60 * 60 * 1000 , // 1 zi
                    });
                    return res
                        .status(200)
                        .send({ message: "Login success!", userId: user.id });
                } else {
                    return res.status(400).send("Incorrect email or password!");
                }
            }

            return res.status(400).send("Incorrect email or password!");
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

    getUserFromCookie: async(req,res) => {
        const token=req.cookies.token;
        if(!token) {
            return res.status(400).send("No token provided!");
        }
        try{
            const user=jwt.verify(token,process.env.COOKIE_SECRET);
            return res.status(200).send(user);
        } catch(err) {
            return res.status(500).send(err.message);
        }
    },

    logout: async (req, res) => {
        res.clearCookie("token");
        res.status(200).send({ message: "Logged out" });
    }
    
};

module.exports=controller;
