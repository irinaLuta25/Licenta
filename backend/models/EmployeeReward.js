const EmployeeRewardModel = (sequelize, DataTypes) => {
  const employeeReward = sequelize.define(
    "employee_reward",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      receivedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
    }
  );
  return employeeReward;
};

module.exports = EmployeeRewardModel;
