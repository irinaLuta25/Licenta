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
          createdAt: { [Op.between]: [startDate, endDate] },
        },
        raw: true,
      });

      const getWeekLabel = (dateStr) => {
        const day = new Date(dateStr).getDate();
        if (day <= 7) return "Săpt. 1";
        if (day <= 14) return "Săpt. 2";
        if (day <= 21) return "Săpt. 3";
        return "Săpt. 4";
      };

      const grouped = {};
      for (const s of states) {
        const date = s.createdAt.toISOString().split("T")[0];
        const week = getWeekLabel(date);
        if (!grouped[week]) grouped[week] = {};
        if (!grouped[week][s.mood]) grouped[week][s.mood] = [];
        grouped[week][s.mood].push(s.intensity);
      }


      const result = Object.entries(grouped).map(([week, moods]) => {
        const entry = { week }; 
        for (const [mood, values] of Object.entries(moods)) {
          entry[mood] = values.length;
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
          createdAt: { [Op.between]: [startDate, endDate] },
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
        const month = new Date(p.createdAt).getMonth(); 
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
            model: EmployeeEvent, 
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

      const filteredSessions = sessions.filter((session) => {
        if (!session.interval || !session.interval.date) return false;
        return new Date(session.interval.date).getFullYear() === parseInt(year);
      });

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      filteredSessions.forEach((session) => {
        const score = session.satisfactionScore;
        if (score >= 1 && score <= 5) {
          counts[score]++;
        }
      });

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
