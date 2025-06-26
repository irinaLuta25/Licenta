const UserDb = require("../models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeDb = require("../models").Employee;
const SpecialistDb = require("../models").Specialist;

const bucket = require("../config/firebaseConfig");

const controller = {
  register: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthdate,
      gender,
      password,
      role,
      department,
      hireDate,
      allowAnonymous,
      description,
      linkedin,
      facebook,
      website,
      isTherapist,
      formation,
      specialization,
      therapyStyle,
    } = req.body;

    let profileImageUrl = null;

    if (req.file) {
      try {
        const file = req.file;
        const firebaseFileName = `${Date.now()}_${file.originalname}`;
        const blob = bucket.file(`profile-images/${firebaseFileName}`);

        const blobStream = blob.createWriteStream({
          resumable: false,
          metadata: {
            contentType: file.mimetype,
          },
        });

        await new Promise((resolve, reject) => {
          blobStream.on("finish", resolve);
          blobStream.on("error", reject);
          blobStream.end(file.buffer);
        });

        await blob.makePublic();
        profileImageUrl = `https://storage.googleapis.com/${bucket.name}/profile-images/${firebaseFileName}`;
      } catch (err) {
        console.error("Eroare la upload profil image:", err.message);
        return res.status(500).send({ message: "Upload imagine eșuat." });
      }
    } else {
      profileImageUrl =
        "https://firebasestorage.googleapis.com/v0/b/mindcare-f5693.firebasestorage.app/o/profile-images%2FDefault_pfp.jpg?alt=media&token=8404e8bc-6b6d-4f5e-a56d-c19febbe79ca";
    }

    const baseUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthdate,
      gender,
      password,
      role,
      profileImage: profileImageUrl,
    };
    console.log("baseUser primit:", baseUser);

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "birthdate",
      "gender",
      "password",
      "role",
    ];
    for (let field of requiredFields) {
      if (!baseUser[field]) {
        return res.status(400).send(`${field} is required!`);
      }
    }

    const checkUser = await UserDb.findOne({
      where: {
        email: email,
      },
    });

    if (checkUser) {
      return res.status(400).send({ message: "Emailul este deja folosit." });
    }

    try {
      baseUser.password = await bcrypt.hash(password, 10);
      const newUser = await UserDb.create(baseUser);
      console.log("User creat:", newUser.id, newUser.role);

      if (newUser.role === "angajat") {
        console.log("Creating Employee with:", {
          department,
          hireDate,
          allowAnonymous,
        });
        const newEmployee = await EmployeeDb.create({
          userId: newUser.id,
          department,
          hireDate,
          allowAnonymous,
          isManager: false,
        });
        console.log("employee creat", newEmployee);
      } else if (newUser.role === "specialist") {
        const newSpecialist = await SpecialistDb.create({
          userId: newUser.id,
          description,
          linkedin,
          facebook,
          website,
          isTherapist: isTherapist === "true" || isTherapist === true,
          formation: isTherapist ? formation : null,
          specialization: isTherapist ? specialization : null,
          therapyStyle: isTherapist ? therapyStyle : null,
        });
        console.log("specialist creat", newSpecialist);
      }

      res.status(200).send(newUser);
    } catch (err) {
      console.error(err);
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
            maxAge: 24 * 60 * 60 * 1000, // 1 zi
          });
          return res
            .status(200)
            .send({ message: "Login success!", userId: user.id });
        } else {
          return res.status(400).send({ message: "Email sau parolă greșită." });
        }
      }

      return res.status(400).send({ message: "Email sau parolă greșită." });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;

    let profileImageUrl = req.body.profileImage;

    if (req.file) {
      try {
        const file = req.file;
        const firebaseFileName = `${Date.now()}_${file.originalname}`;
        const blob = bucket.file(`profile-images/${firebaseFileName}`);

        const blobStream = blob.createWriteStream({
          resumable: false,
          metadata: {
            contentType: file.mimetype,
          },
        });

        await new Promise((resolve, reject) => {
          blobStream.on("finish", resolve);
          blobStream.on("error", reject);
          blobStream.end(file.buffer);
        });

        await blob.makePublic();
        profileImageUrl = `https://storage.googleapis.com/${bucket.name}/profile-images/${firebaseFileName}`;
      } catch (uploadErr) {
        console.error("Eroare la upload poza:", uploadErr.message);
        return res.status(500).send("Eroare la upload poza de profil");
      }
    }

    const payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      password: req.body.password,
      role: req.body.role,
      profileImage: profileImageUrl,
    };

    try {
      const user = await UserDb.findByPk(userId);
      if (!user) {
        return res.status(400).send("User not found");
      }

      const newUser = await user.update(payload);
      res.status(200).send(newUser);
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

  getUserFromCookie: async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send("No token provided!");
    }
    try {
      const user = jwt.verify(token, process.env.COOKIE_SECRET);
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  logout: async (req, res) => {
    res.clearCookie("token");
    res.status(200).send({ message: "Logged out" });
  },
};

module.exports = controller;
