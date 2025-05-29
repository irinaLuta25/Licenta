const {
  Employee,
  EmotionalState,
  Problem,
  Event,
  EmployeeEvent,
  Interval,
  TherapySession,
} = require("../models");
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
          isManager: false,
        },
      });

      const employeeIds = employees.map((emp) => emp.id);
      if (employeeIds.length === 0) return res.status(200).send([]);

      // 3. Perioada de filtrare
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const states = await EmotionalState.findAll({
        where: {
          employeeId: { [Op.in]: employeeIds },
          recordedAt: { [Op.between]: [startDate, endDate] },
        },
        raw: true,
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
  },

  getMoodFrequency: async (req, res) => {
    const { managerId } = req.params;
    const { month, year } = req.query;

    if (!managerId || !month || !year) {
      return res.status(400).send("Missing managerId, month or year");
    }

    try {
      const manager = await Employee.findOne({ where: { userId: managerId } });
      if (!manager || !manager.isManager) {
        return res.status(403).send("User is not a manager");
      }

      const employees = await Employee.findAll({
        where: {
          department: manager.department,
          isManager: false,
        },
      });
      const employeeIds = employees.map((emp) => emp.id);
      if (employeeIds.length === 0) return res.status(200).send([]);

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const states = await EmotionalState.findAll({
        where: {
          employeeId: { [Op.in]: employeeIds },
          recordedAt: { [Op.between]: [startDate, endDate] },
        },
        raw: true,
      });

      const freq = {};
      for (const s of states) {
        freq[s.mood] = (freq[s.mood] || 0) + 1;
      }

      const result = Object.entries(freq).map(([mood, count]) => ({
        mood,
        count,
      }));
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getProblemsPerMonth: async (req, res) => {
    const { managerId } = req.params;
    const { year } = req.query;

    if (!managerId || !year) {
      return res.status(400).send("Missing managerId or year");
    }

    try {
      const manager = await Employee.findOne({ where: { userId: managerId } });
      if (!manager || !manager.isManager) {
        return res.status(403).send("User is not a manager");
      }

      const employees = await Employee.findAll({
        where: {
          department: manager.department,
          isManager: false,
        },
      });

      const employeeIds = employees.map((emp) => emp.id);
      if (employeeIds.length === 0) return res.status(200).send([]);

      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31T23:59:59`);

      const problems = await Problem.findAll({
        where: {
          employeeId: { [Op.in]: employeeIds },
          createdAt: { [Op.between]: [startDate, endDate] },
        },
        raw: true,
      });

      const monthlyCounts = Array(12).fill(0);
      for (const p of problems) {
        const month = new Date(p.createdAt).getMonth(); // 0 - 11
        monthlyCounts[month]++;
      }

      const result = monthlyCounts.map((count, index) => ({
        month: new Date(0, index).toLocaleString("ro-RO", { month: "long" }),
        count,
      }));

      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getEventTypeDistribution: async (req, res) => {
    const { managerId } = req.params;
    const { year } = req.query;

    if (!managerId || !year) {
      return res.status(400).send("Missing managerId or year");
    }

    try {
      const manager = await Employee.findOne({ where: { userId: managerId } });
      if (!manager || !manager.isManager) {
        return res.status(403).send("User is not a manager");
      }

      const department = manager.department;

      const events = await Event.findAll({
        where: {
          targetDepartment: { [Op.or]: [department, "General"] },
        },
        include: [
          {
            model: Interval,
            attributes: ["date"],
          },
          {
            model: EmployeeEvent, // folosim direct modelul
          },
        ],
      });

      const filtered = events.filter((event) => {
        if (!event.interval || !event.interval.date) return false;
        const eventYear = new Date(event.interval.date).getFullYear();
        return eventYear === parseInt(year);
      });

      const counts = { training: 0, workshop: 0 };
      for (const e of filtered) {
        const type = e.type.toLowerCase();
        if (type === "training" || type === "workshop") {
          counts[type] += e.employee_events?.length || 0;
        }
      }

      return res.status(200).json([
        { type: "Training", count: counts.training },
        { type: "Workshop", count: counts.workshop },
      ]);
    } catch (err) {
      console.error("Error in getEventTypeDistribution:", err);
      return res.status(500).send("Server error");
    }
  },

  getTherapySatisfactionDistribution: async (req, res) => {
  const { managerId } = req.params;
  const { year } = req.query;

  if (!managerId || !year) {
    return res.status(400).send("Missing managerId or year");
  }

  try {
    const manager = await Employee.findOne({ where: { userId: managerId } });
    if (!manager || !manager.isManager) {
      return res.status(403).send("User is not a manager");
    }

    const department = manager.department;

    // Aducem toate sesiunile cu satisfactie != null, angajatii din departamentul managerului si intervalul
    const sessions = await TherapySession.findAll({
      where: {
        satisfactionScore: { [Op.not]: null },
      },
      include: [
        {
          model: Employee,
          required: true,
          where: { department: { [Op.or]: [department, "General"] } },
        },
        {
          model: Interval,
          required: true,
        },
      ],
      raw: false,
    });

    // Filtrăm manual în JS sesiunile după anul din interval.date
    const filteredSessions = sessions.filter(session => {
      if (!session.interval || !session.interval.date) return false;
      return new Date(session.interval.date).getFullYear() === parseInt(year);
    });

    // Contorizăm scorurile
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredSessions.forEach(session => {
      const score = session.satisfactionScore;
      if (score >= 1 && score <= 5) {
        counts[score]++;
      }
    });

    // Construim array-ul final
    const distribution = [];
    for (let i = 1; i <= 5; i++) {
      distribution.push({ score: i, count: counts[i] });
    }

    return res.status(200).json(distribution);
  } catch (error) {
    console.error("Error getTherapySatisfactionDistribution:", error);
    return res.status(500).send("Server error");
  }
},

};

module.exports = controller;
