const EmployeeRewardModel = (sequelize, DataTypes) => {
    const employeeReward = sequelize.define("employee_reward", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        receivedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
    });
    return employeeReward;
};

module.exports = EmployeeRewardModel;
