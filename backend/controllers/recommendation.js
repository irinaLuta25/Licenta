const path = require("path");
const { exec } = require("child_process");
const EmployeeDb = require("../models").Employee;
const SpecialistDb = require("../models").Specialist;
const UserDb = require("../models").User;

const controller = {
  getRecommendations: async (req, res) => {
    const employeeId = req.params.employeeId;

    try {
      const employee = await EmployeeDb.findByPk(employeeId);
      if (!employee) return res.status(404).json({ error: "Employee not found" });

      const specialists = await SpecialistDb.findAll({ include: { model: UserDb} });

      const payload = {
        employee: {
          department: employee.department,
          preferredGender: employee.preferredGender,
          preferredTherapyStyle: employee.preferredTherapyStyle,
          preferredFormation: employee.preferredFormation,
          preferredMinAge: employee.preferredMinAge,
          preferredMaxAge: employee.preferredMaxAge
        },
        specialists: specialists.map(s => ({
          id: s.id,
          gender: s.user?.gender || "altul",
          age: s.user?.age || 35,
          formation: s.formation,
          therapyStyle: s.therapyStyle
        }))
      };

      const scriptPath = path.join(__dirname, "..", "ML", "recommend_specialists.py");

      const payloadString = JSON.stringify(payload).replace(/"/g, '\\"');

      const command = `python "${scriptPath}" "${payloadString}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Eroare la rularea scriptului Python:", error);
          return res.status(500).json({
            error: "Eroare la rularea scriptului Python",
            details: stderr,
          });
        }

        try {
          const result = JSON.parse(stdout);
          res.json(result);
        } catch (e) {
          res.status(500).json({ error: "Eroare la parsarea răspunsului", stdout });
        }
      });
    } catch (err) {
      console.error("Eroare la preluarea datelor:", err);
      res.status(500).json({ error: "Eroare server" });
    }
  },
};

module.exports = controller;
