const EmployeeGoalModel = (sequelize, DataTypes) => {
    const employeeGoal = sequelize.define("employee_goal", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        targetValue: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
    });
    return employeeGoal;
};

module.exports = EmployeeGoalModel;
