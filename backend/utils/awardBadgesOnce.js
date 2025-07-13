const { Employee, EmployeeGoal, HabitTracking, Habit, Reward, EmployeeReward } = require("../models");

const checkAndUpdateAllRewards = async () => {
  const employees = await Employee.findAll();

  for (const employee of employees) {
    const goals = await EmployeeGoal.findAll({
      where: { employeeId: employee.id },
      include: [{ model: Habit }],
    });

    const completedCounts = {};

    for (const goal of goals) {
      const trackings = await HabitTracking.findAll({
        where: { employeeGoalId: goal.id },
      });

      const grouped = {};

      for (const t of trackings) {
        const d = new Date(t.createdAt);
        let key = "";

        if (goal.period === "zilnic") {
          key = d.toISOString().split("T")[0];
        } else if (goal.period === "săptămânal") {
          const start = new Date(d);
          start.setDate(d.getDate() - d.getDay());
          key = start.toISOString().split("T")[0];
        } else if (goal.period === "lunar") {
          key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        } else if (goal.period === "anual") {
          key = `${d.getFullYear()}`;
        }

        grouped[key] = (grouped[key] || 0) + t.value;
      }

      const cat = goal.habit.category;
      const periodsCompleted = Object.values(grouped).filter(v => v >= goal.targetValue).length;
      completedCounts[cat] = (completedCounts[cat] || 0) + periodsCompleted;
    }

    for (const [category, count] of Object.entries(completedCounts)) {
      const reward = await Reward.findOne({ where: { category } });
      if (!reward) continue;

      const existing = await EmployeeReward.findOne({
        where: { employeeId: employee.id, rewardId: reward.id },
        order: [["level", "DESC"]],
      });

      let currentLevel = existing ? existing.level : 0;
      let needed = 5 * (currentLevel + 1);

      while (count >= needed) {
        const alreadyGiven = await EmployeeReward.findOne({
          where: {
            employeeId: employee.id,
            rewardId: reward.id,
            level: currentLevel + 1,
          },
        });

        if (!alreadyGiven) {
          await EmployeeReward.create({
            employeeId: employee.id,
            rewardId: reward.id,
            level: currentLevel + 1,
            createdAt: new Date(),
          });
        }

        currentLevel++;
        needed = 5 * (currentLevel + 1);
      }
    }
  }
};

module.exports = { checkAndUpdateAllRewards };
