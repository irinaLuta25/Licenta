const EmployeeEventModel = (sequelize, DataTypes) => {
    const employeeEvent = sequelize.define("employee_event", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
    }, {
        underscored: true,
        freezeTableName: true,
    });
    return employeeEvent;
};

module.exports = EmployeeEventModel;
