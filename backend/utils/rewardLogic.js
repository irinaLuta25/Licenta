const { EmployeeGoal, Habit, EmployeeReward, Reward, HabitTracking} = require("../models");

const checkAndUpdateReward = async (employeeId, models) => {
  const goals = await EmployeeGoal.findAll({
    where: { employeeId },
    include: [{ model: Habit }],
  });

  const completedCounts = {};

  for (const goal of goals) {
    const trackings = await HabitTracking.findAll({
      where: { employeeGoalId: goal.id },
    });

    const today = new Date();
    const relevant = trackings.filter((t) => {
      const d = new Date(t.createdAt);
      if (goal.period === "zilnic") return d.toDateString() === today.toDateString();
      if (goal.period === "săptămânal") {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        return d >= start && d <= today;
      }
      if (goal.period === "lunar")
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      if (goal.period === "anual") return d.getFullYear() === today.getFullYear();
      return false;
    });

    const sum = relevant.reduce((acc, curr) => acc + curr.value, 0);
    if (sum >= goal.targetValue) {
      const cat = goal.habit.category;
      completedCounts[cat] = (completedCounts[cat] || 0) + 1;
    }
  }

  for (const [category, count] of Object.entries(completedCounts)) {
    const reward = await Reward.findOne({ where: { category } });
    if (!reward) continue;

    const existing = await EmployeeReward.findOne({
      where: { employeeId, rewardId: reward.id },
      order: [["level", "DESC"]],
    });

    const currentLevel = existing ? existing.level : 0;
    const needed = 5 * (currentLevel + 1);

    if (count >= needed) {
      await EmployeeReward.create({
        employeeId,
        rewardId: reward.id,
        createdAt: new Date(),
        level: currentLevel + 1,
      });
    }
  }
};

module.exports = { checkAndUpdateReward };
