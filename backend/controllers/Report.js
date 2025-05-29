const { Employee, EmotionalState } = require("../models");
const { Op } = require("sequelize");

const controller = {
  getMoodEvolution: async (req, res) => {
    const { managerId } = req.params;
    const { month, year } = req.query;

    if (!managerId || !month || !year) {
      return res.status(400).send("Missing managerId, month or year");
    }

    try {
      // 1. Cautam angajatul manager
      const manager = await Employee.findOne({ where: { userId: managerId } });
      if (!manager || !manager.isManager) {
        return res.status(403).send("User is not a manager");
      }

      // 2. Toti angajatii din acelasi department
      const employees = await Employee.findAll({
        where: {
          department: manager.department,
          isManager: false
        }
      });

      const employeeIds = employees.map(emp => emp.id);
      if (employeeIds.length === 0) return res.status(200).send([]);

      // 3. Perioada de filtrare
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const states = await EmotionalState.findAll({
        where: {
          employeeId: { [Op.in]: employeeIds },
          recordedAt: { [Op.between]: [startDate, endDate] }
        },
        raw: true
      });

      // 4. Grupare date: pe zi + mood
      const grouped = {};
      for (const s of states) {
        const date = s.recordedAt.toISOString().split("T")[0];
        if (!grouped[date]) grouped[date] = {};
        if (!grouped[date][s.mood]) grouped[date][s.mood] = [];
        grouped[date][s.mood].push(s.intensity);
      }

      // 5. Calculam media pe fiecare mood/zi
      const result = Object.entries(grouped).map(([date, moods]) => {
        const entry = { date };
        for (const [mood, values] of Object.entries(moods)) {
          const sum = values.reduce((a, b) => a + b, 0);
          entry[mood] = +(sum / values.length).toFixed(2);
        }
        return entry;
      });

      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

module.exports = controller;
