const { EmployeeGoal, Habit, EmployeeReward, Reward, HabitTracking} = require("../models");

const checkAndUpdateReward = async (employeeId) => {
  let rewardGranted = false;

  const goals = await EmployeeGoal.findAll({
    where: { employeeId },
    include: [{ model: Habit }],
  });

  const now = new Date();
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
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else if (goal.period === "lunar") {
        key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      } else if (goal.period === "anual") {
        key = `${d.getFullYear()}`;
      }

      grouped[key] = (grouped[key] || 0) + t.value;
    }

    const completari = Object.values(grouped).filter((sum) => sum >= goal.targetValue).length;

    if (completari > 0) {
      const cat = goal.habit.category;
      completedCounts[cat] = (completedCounts[cat] || 0) + completari;
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

      rewardGranted = true;
      console.log(`🎉 Ai primit o recompensă! Nivel nou: ${currentLevel + 1}`);
    }

    console.log(`Obiective îndeplinite pt ${category}: ${count} / necesare: ${needed}`);
  }

  return rewardGranted;
};

module.exports = { checkAndUpdateReward };
