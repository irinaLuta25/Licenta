const {
  Employee,
  Specialist,
  User,
  TherapySession,
  Interval,
} = require("../models");
const cosineSimilarity = require("compute-cosine-similarity");

const controller = {
  getRecommendations: async (req, res) => {
    const employeeId = req.params.employeeId;

    try {
      const employee = await Employee.findByPk(employeeId);
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      const specialists = await Specialist.findAll({ include: User });

      const sessions = await TherapySession.findAll({
        include: {
          model: Interval,
          attributes: ["specialistId"],
        },
        attributes: ["satisfactionScore"],
      });

      const avgScores = {};
      for (const session of sessions) {
        const specialistId = session.interval?.specialistId;
        const score = session.satisfactionScore;

        if (!specialistId) continue;

        if (!avgScores[specialistId]) {
          avgScores[specialistId] = { total: 0, count: 0 };
        }

        avgScores[specialistId].total += score;
        avgScores[specialistId].count += 1;
      }

      Object.keys(avgScores).forEach((id) => {
        const { total, count } = avgScores[id];
        avgScores[id] = +(total / count).toFixed(2);
      });

      const encode = (value) =>
        typeof value === "string" ? value.toLowerCase().trim() : "";

      const employeeVector = [
        employee.department,
        employee.preferredGender,
        employee.preferredTherapyStyle,
        employee.preferredFormation,
        employee.preferredSpecialization,
      ];

      const minAge = employee.preferredMinAge;
      const maxAge = employee.preferredMaxAge;

      const recommendations = [];

      for (const spec of specialists) {
        const user = spec.user;
        const age = typeof user.age === "number" ? user.age : 35;

        if (
          employee.preferredGender &&
          encode(user.gender) !== encode(employee.preferredGender)
        )
          continue;

        if (
          employee.preferredFormation &&
          spec.formation !== employee.preferredFormation
        )
          continue;

        if (
          employee.preferredTherapyStyle &&
          spec.therapyStyle !== employee.preferredTherapyStyle
        )
          continue;

        if (
          employee.preferredSpecialization &&
          encode(spec.specialization) !==
            encode(employee.preferredSpecialization)
        )
          continue;

        if (
          typeof age === "number" &&
          ((employee.preferredMinAge && age < employee.preferredMinAge) ||
            (employee.preferredMaxAge && age > employee.preferredMaxAge))
        )
          continue;

        const specialistVector = [
          employee.department,
          user.gender,
          spec.therapyStyle,
          spec.formation,
          spec.specialization,
        ];

        const categories = [
          employeeVector[0],
          specialistVector[0],
          employeeVector[1],
          specialistVector[1],
          employeeVector[2],
          specialistVector[2],
          employeeVector[3],
          specialistVector[3],
          employeeVector[4],
          specialistVector[4],
        ];

        const unique = [...new Set(categories)];
        const vectorA = unique.map((v) =>
          encode(employeeVector).includes(encode(v)) ? 1 : 0
        );
        const vectorB = unique.map((v) =>
          encode(specialistVector).includes(encode(v)) ? 1 : 0
        );

        const ageTarget = (minAge + maxAge) / 2 || 35;
        const ageDiff = 1 - Math.abs(age - ageTarget) / 20;

        vectorA.push(1);
        vectorB.push(ageDiff);

        const similarity = cosineSimilarity(vectorA, vectorB);
        const satisfaction = avgScores[spec.id] || 3.5;

        const finalScore = +(
          0.7 * similarity +
          0.3 * (satisfaction / 5)
        ).toFixed(3);

        recommendations.push({ specialistId: spec.id, score: finalScore });
      }

      recommendations.sort((a, b) => b.score - a.score);
      res.json(recommendations.slice(0, 3));
    } catch (err) {
      console.error("Eroare recomandare:", err);
      res.status(500).json({ error: "Eroare server" });
    }
  },
};

module.exports = controller;
